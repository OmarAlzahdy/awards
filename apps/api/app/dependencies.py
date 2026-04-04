from __future__ import annotations

import secrets
from collections.abc import Iterator

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from .auth import verify_token
from .database import Runtime

bearer_scheme = HTTPBearer(auto_error=False)


def get_runtime(request: Request) -> Runtime:
    return request.app.state.runtime  # type: ignore[return-value]


def get_session(runtime: Runtime = Depends(get_runtime)) -> Iterator[Session]:
    session = runtime.session_factory()
    try:
        yield session
    finally:
        session.close()


def require_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    runtime: Runtime = Depends(get_runtime),
) -> str:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="admin_auth_required")

    payload = verify_token(credentials.credentials, runtime.settings.auth_secret)
    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid_admin_token")

    username = str(payload.get("sub", ""))
    if not username or username != runtime.settings.admin_username:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid_admin_token")

    return username


def verify_admin_credentials(username: str, password: str, runtime: Runtime) -> bool:
    return secrets.compare_digest(username, runtime.settings.admin_username) and secrets.compare_digest(
        password, runtime.settings.admin_password
    )


def require_writable(runtime: Runtime = Depends(get_runtime)) -> None:
    if runtime.settings.is_read_only:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="read_only_mode")

