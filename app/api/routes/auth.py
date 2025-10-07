

from fastapi import APIRouter, Depends, Request, Response, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.core.database import get_db
from app.api.models.user import upsert_user_from_oauth, create_user
from app.api.schemas.user import UserCreate, UserOut
from typing import Any
import httpx
import os

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

# 카카오 OAuth 환경변수 (실서비스에서는 .env 사용 권장)
KAKAO_CLIENT_ID = os.getenv("KAKAO_CLIENT_ID", "60111a934772dc53e078fc09dc1823c3")
KAKAO_REDIRECT_URI = os.getenv(
    "KAKAO_REDIRECT_URI",
    "https://congenial-broccoli-v67v66559p4j3w4gx-5174.app.github.dev/api/auth/kakao/callback"
)

# 1. 카카오 로그인 URL 반환
@router.get("/kakao/login")
async def kakao_login_url():
    url = (
        f"https://kauth.kakao.com/oauth/authorize?response_type=code"
        f"&client_id={KAKAO_CLIENT_ID}"
        f"&redirect_uri={KAKAO_REDIRECT_URI}"
    )
    return {"url": url}

# 2. 카카오 콜백: 인증코드로 토큰/유저정보 받아 회원가입
@router.get("/kakao/callback/oauth")
async def kakao_oauth_callback(code: str, db: AsyncSession = Depends(get_db)):
    # 1) 인증코드로 토큰 요청
    token_url = "https://kauth.kakao.com/oauth/token"
    data = {
        "grant_type": "authorization_code",
        "client_id": KAKAO_CLIENT_ID,
        "redirect_uri": KAKAO_REDIRECT_URI,
        "code": code,
    }
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(token_url, data=data)
        if token_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="카카오 토큰 요청 실패")
        access_token = token_resp.json().get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="카카오 토큰 없음")
        # 2) 토큰으로 유저정보 요청
        user_resp = await client.get(
            "https://kapi.kakao.com/v2/user/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if user_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="카카오 유저정보 요청 실패")
        kakao_user = user_resp.json()
        inherent = str(kakao_user["id"])
        nick = kakao_user.get("properties", {}).get("nickname")
        img = kakao_user.get("properties", {}).get("profile_image")
        # 3) 회원가입/로그인 처리
        user = await upsert_user_from_oauth(db, "kakao", inherent, nick, img)
        return {"user": {"user_id": user.user_id, "user_nick": user.user_nick}}
