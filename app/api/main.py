from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from app.api.routes import auth, posts
from app.api.routes import auth, posts
import os

app = FastAPI()

origins = [
    "http://localhost:5174",
    "http://127.0.0.1:5174"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET", "selfstar-secret"),
    session_cookie=os.getenv("SESSION_COOKIE_NAME", "sid"),
)

app.include_router(auth.router, prefix="/auth")
app.include_router(posts.router, prefix="/posts")

@app.get("/")
def root():
    return {"message": "API is running"}
