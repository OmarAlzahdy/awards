from __future__ import annotations

import re

from fastapi.testclient import TestClient

from app.main import create_app

EGYPTIAN_NATIONALITIES = {"\u0645\u0635\u0631\u064a", "\u0645\u0635\u0631\u064a\u0629"}


def _cycle_year(label: str | None) -> int:
    if not label:
        return -1
    match = re.search(r"(19|20)\d{2}", label)
    return int(match.group(0)) if match else -1


def _admin_token(client: TestClient) -> str:
    response = client.post(
        "/v1/auth/login",
        json={"username": "admin", "password": "secret"},
    )
    assert response.status_code == 200
    return response.json()["token"]


def test_awards_listing_and_filters(client: TestClient) -> None:
    response = client.get("/v1/awards", params={"q": "نايف", "page_size": 5})
    assert response.status_code == 200
    payload = response.json()
    assert payload["total"] >= 1
    assert any("نايف" in item["name"] for item in payload["items"])


def test_award_detail_and_winners(client: TestClient) -> None:
    detail = client.get("/v1/awards/1")
    winners = client.get("/v1/awards/1/winners")

    assert detail.status_code == 200
    assert winners.status_code == 200
    assert detail.json()["winner_count"] == len(winners.json())
    assert len(winners.json()) >= 1


def test_featured_winners_endpoint_returns_ranked_egyptian_winners(client: TestClient) -> None:
    response = client.get(
        "/v1/winners/featured",
        params=[
            ("nationality", "\u0645\u0635\u0631\u064a"),
            ("nationality", "\u0645\u0635\u0631\u064a\u0629"),
            ("limit", "6"),
        ],
    )

    assert response.status_code == 200
    payload = response.json()
    assert len(payload) == 6
    assert all(item["nationality_or_location"] in EGYPTIAN_NATIONALITIES for item in payload)
    assert all(item["award_name"] for item in payload)

    expected = sorted(payload, key=lambda item: item["id"])
    expected = sorted(expected, key=lambda item: item["cycle_label"] or "", reverse=True)
    expected = sorted(expected, key=lambda item: _cycle_year(item["cycle_label"]), reverse=True)
    assert payload == expected


def test_stats_summary(client: TestClient) -> None:
    response = client.get("/v1/stats/summary")
    assert response.status_code == 200
    payload = response.json()
    assert payload["awards_count"] == 61
    assert payload["winners_count"] == 437
    assert payload["read_only_mode"] is False


def test_admin_crud_and_read_only_guard(client: TestClient, api_settings) -> None:
    token = _admin_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    create_award = client.post(
        "/v1/admin/awards",
        headers=headers,
        json={
            "id": 999,
            "name": "جائزة اختبار",
            "summary": "وصف تجريبي",
            "supervising_body": "جهة اختبار",
            "prize_value": "1000",
            "year_established": 2026,
            "country": "مصر",
            "discipline": "اختبار",
            "notes": "ملاحظات",
            "website_url": "https://example.com",
            "authority_name": "هيئة اختبار",
            "authority_type": "مركز",
        },
    )
    assert create_award.status_code == 200

    award_id = create_award.json()["id"]
    create_winner = client.post(
        "/v1/admin/winners",
        headers=headers,
        json={
            "award_id": award_id,
            "cycle_label": "2026",
            "winner_name": "باحث اختباري",
            "nationality_or_location": "مصر",
            "summary": "فائز تجريبي",
            "discipline": "اختبار",
        },
    )
    assert create_winner.status_code == 200
    winner_id = create_winner.json()["id"]

    update_winner = client.put(
        f"/v1/admin/winners/{winner_id}",
        headers=headers,
        json={
            "cycle_label": "2027",
            "winner_name": "باحث اختباري",
            "nationality_or_location": "مصر",
            "summary": "فائز محدث",
            "discipline": "اختبار",
        },
    )
    assert update_winner.status_code == 200
    assert update_winner.json()["cycle_label"] == "2027"

    delete_winner = client.delete(f"/v1/admin/winners/{winner_id}", headers=headers)
    assert delete_winner.status_code == 200

    delete_award = client.delete(f"/v1/admin/awards/{award_id}", headers=headers)
    assert delete_award.status_code == 200

    read_only_settings = api_settings.model_copy(update={"read_only_mode": True, "auto_seed": True})
    read_only_client = TestClient(create_app(read_only_settings))
    read_only_headers = {"Authorization": f"Bearer {_admin_token(read_only_client)}"}
    blocked = read_only_client.post(
        "/v1/admin/awards",
        headers=read_only_headers,
        json={"name": "محظور"},
    )
    assert blocked.status_code == 403
    assert blocked.json()["detail"] == "read_only_mode"
