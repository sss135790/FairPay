from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field, PositiveFloat


class ExpenseBase(BaseModel):
    amount: PositiveFloat = Field(..., description="Expense amount in rupees")
    category: str
    description: str
    date: date
    note: Optional[str] = None


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseResponse(ExpenseBase):
    id: int
    user_id: str
    created_at: datetime

    class Config:
        orm_mode = True
