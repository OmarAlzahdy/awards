from __future__ import annotations

import base64
import hashlib
import hmac
import json
import time
from typing import Any


TOKEN_TTL_SECONDS = 60 * 60 * 12


def _urlsafe_b64encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")


def _urlsafe_b64decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(value + padding)


def _sign(message: str, secret: str) -> str:
    digest = hmac.new(secret.encode("utf-8"), message.encode("utf-8"), hashlib.sha256).digest()
    return _urlsafe_b64encode(digest)


def issue_token(username: str, secret: str) -> str:
    payload = {"sub": username, "iat": int(time.time())}
    payload_raw = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    payload_b64 = _urlsafe_b64encode(payload_raw)
    signature = _sign(payload_b64, secret)
    return f"{payload_b64}.{signature}"


def verify_token(token: str, secret: str) -> dict[str, Any] | None:
    try:
        payload_b64, signature = token.split(".", 1)
    except ValueError:
        return None

    if not hmac.compare_digest(signature, _sign(payload_b64, secret)):
        return None

    try:
        payload = json.loads(_urlsafe_b64decode(payload_b64))
    except (json.JSONDecodeError, ValueError):
        return None

    issued_at = int(payload.get("iat", 0))
    if issued_at <= 0 or time.time() - issued_at > TOKEN_TTL_SECONDS:
        return None

    return payload

