from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base
from sqlalchemy.future import select

Base = declarative_base()

class User(Base):
    __tablename__ = "ss_user"
    user_id = Column(Integer, primary_key=True, index=True)
    user_platform = Column(String(32))
    user_inherent = Column(String(64), unique=True, index=True)
    user_nick = Column(String(64))
    user_img = Column(String(256))
    user_credit = Column(Integer, default=100)
    password = Column(String(128), nullable=True)  # password 필드 예시

async def find_user_by_inherent(db, user_inherent: str):
    stmt = select(User).where(User.user_inherent == user_inherent)
    result = await db.execute(stmt)
    user = result.scalars().first()
    return user

import hashlib
async def create_user(db, user: dict):
    # password 해시 예시 (실제 서비스에서는 bcrypt 등 사용 권장)
    if user.get("password"):
        user["password"] = hashlib.sha256(user["password"].encode()).hexdigest()
    db_user = User(**user)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def upsert_user_from_oauth(db, provider, inherent, nick=None, img=None):
    user = await find_user_by_inherent(db, inherent)
    if user:
        if nick:
            user.user_nick = nick
        if img:
            user.user_img = img
        user.user_platform = provider
        await db.commit()
        await db.refresh(user)
        return user
    else:
        new_user = User(
            user_platform=provider,
            user_inherent=inherent,
            user_nick=nick,
            user_img=img,
            user_credit=100
        )
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return new_user
