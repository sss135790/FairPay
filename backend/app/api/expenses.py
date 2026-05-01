from fastapi import APIRouter, Depends, Header, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.expense import create_expense, get_expenses
from app.models import Expense
from app.schemas.expense import ExpenseCreate, ExpenseResponse

router = APIRouter()

@router.get("/")
def root() -> dict[str, str]:
    return {"message": "FastAPI + SQLAlchemy working"}

@router.post("/expenses", response_model=ExpenseResponse)
def post_expense(
    expense_in: ExpenseCreate,
    x_user_id: str = Header(..., alias="X-User-Id"),
    db: Session = Depends(get_db),
) -> Expense:
    if not x_user_id:
        raise HTTPException(status_code=400, detail="Missing X-User-Id header")

    expense = create_expense(db=db, expense_in=expense_in, user_id=x_user_id)
    return expense

@router.get("/expenses", response_model=list[ExpenseResponse])
def read_expenses(
    x_user_id: str = Header(..., alias="X-User-Id"),
    category: str | None = Query(None),
    sort: str = Query("date_desc"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
) -> list[Expense]:
    if not x_user_id:
        raise HTTPException(status_code=400, detail="Missing X-User-Id header")

    if sort not in {"date_desc", "date_asc"}:
        raise HTTPException(status_code=400, detail="Invalid sort value")

    return get_expenses(
        db=db,
        user_id=x_user_id,
        category=category,
        sort=sort,
        page=page,
        limit=limit,
    )
