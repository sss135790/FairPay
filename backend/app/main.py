from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.expenses import router as expenses_router
from app.core.database import Base, engine

app = FastAPI()


@app.get("/")
def root():
    return {"message": "API is running 🚀"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
app.include_router(expenses_router)
