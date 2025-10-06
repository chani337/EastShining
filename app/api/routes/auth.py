
from fastapi import APIRouter, Depends, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.core.database import get_db
from app.api.models.user import upsert_user_from_oauth, create_user
from app.api.schemas.user import UserCreate, UserOut
from typing import Any

router = APIRouter()

# 회원가입 엔드포인트
@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)) -> Any:
    db_user = await create_user(db, user.dict())
    return db_user

# 기존 kakao 콜백 예시 유지
@router.get("/kakao/callback")
async def kakao_callback(request: Request, db: AsyncSession = Depends(get_db)):
    provider = "kakao"
    inherent = request.query_params.get("inherent")
    nick = request.query_params.get("nick")
    img = request.query_params.get("img")
    if not provider or not inherent:
        return Response(content="Missing provider/inherent", status_code=400)
    user = await upsert_user_from_oauth(db, provider, inherent, nick, img)
    return {"user": {"user_id": user.user_id, "user_nick": user.user_nick}}
