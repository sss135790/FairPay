from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.expenses import router as expenses_router
from app.core.database import Base, engine

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://fair-pay-ashy.vercel.app",
        "https://fair-pay-git-main-shwets-projects-8a6358c9.vercel.app/",
        "https://fair-1nk2zdfzo-shwets-projects-8a6358c9.vercel.app/"
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "API is running 🚀"}

Base.metadata.create_all(bind=engine)
app.include_router(expenses_router)
