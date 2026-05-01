from datetime import date

from app.crud.expense import create_expense, get_expenses
from app.schemas.expense import ExpenseCreate


def test_create_expense_persists_record(db_session):
    payload = ExpenseCreate(
        amount=150.0,
        category="Food",
        description="Dinner",
        date=date.today(),
        note="Indian restaurant",
    )

    expense = create_expense(db_session, payload, user_id="user-123")

    assert expense.id is not None
    assert expense.user_id == "user-123"
    assert expense.amount == 150.0
    assert expense.category == "Food"
    assert expense.description == "Dinner"
    assert expense.note == "Indian restaurant"


def test_get_expenses_filters_category_and_pagination(db_session):
    for i in range(12):
        create_expense(
            db_session,
            ExpenseCreate(
                amount=10.0 + i,
                category="Transport" if i % 2 == 0 else "Food",
                description=f"Expense {i}",
                date=date.today(),
                note="",
            ),
            user_id="user-123",
        )

    page1 = get_expenses(db_session, user_id="user-123", category="Transport", sort="date_desc", page=1, limit=5)
    page2 = get_expenses(db_session, user_id="user-123", category="Transport", sort="date_desc", page=2, limit=5)

    assert len(page1) == 5
    assert len(page2) == 1
    assert all(exp.category == "Transport" for exp in page1)
    assert all(exp.category == "Transport" for exp in page2)
    assert page1[0].date >= page1[-1].date
