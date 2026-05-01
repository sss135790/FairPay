from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate


def get_expenses(
    db: Session,
    user_id: str,
    category: Optional[str] = None,
    sort: str = "date_desc",
    page: int = 1,
    limit: int = 10,
) -> List[Expense]:
    query = db.query(Expense).filter(Expense.user_id == user_id)

    if category:
        query = query.filter(Expense.category == category)

    if sort == "date_desc":
        query = query.order_by(Expense.date.desc())
    else:
        query = query.order_by(Expense.date.asc())

    offset = (page - 1) * limit
    return query.offset(offset).limit(limit).all()


def create_expense(db: Session, expense_in: ExpenseCreate, user_id: str) -> Expense:
    expense = Expense(
        user_id=user_id,
        amount=float(expense_in.amount),
        category=expense_in.category,
        description=expense_in.description,
        date=expense_in.date,
        note=expense_in.note,
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense
