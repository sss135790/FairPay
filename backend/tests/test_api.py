from datetime import date


def test_post_expense_endpoint(client):
    response = client.post(
        "/expenses",
        json={
            "amount": 99.99,
            "category": "Shopping",
            "description": "New shoes",
            "date": date.today().isoformat(),
            "note": "Online order",
        },
        headers={"X-User-Id": "user-321"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["user_id"] == "user-321"
    assert body["amount"] == 99.99
    assert body["category"] == "Shopping"
    assert body["description"] == "New shoes"


def test_get_expenses_endpoint_supports_pagination_and_sort(client):
    for index in range(6):
        client.post(
            "/expenses",
            json={
                "amount": 20 + index,
                "category": "Utilities" if index < 3 else "Food",
                "description": f"Entry {index}",
                "date": date.today().isoformat(),
                "note": "",
            },
            headers={"X-User-Id": "user-321"},
        )

    response = client.get(
        "/expenses?sort=date_desc&page=1&limit=3&category=Utilities",
        headers={"X-User-Id": "user-321"},
    )

    assert response.status_code == 200
    entries = response.json()
    assert len(entries) == 3
    assert all(entry["category"] == "Utilities" for entry in entries)
