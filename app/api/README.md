# app/api 백엔드 API 서버

이 디렉토리는 FastAPI 기반의 Python 백엔드 서버 코드입니다. 기존 Node.js(Express) 서버를 완전히 대체하며, 주요 구조와 역할은 다음과 같습니다.

## 디렉토리 구조

```
app/
  main.py           # FastAPI 앱 진입점
  __main__.py       # uvicorn 실행 진입점
  api/
    core/           # DB 연결 등 핵심 모듈
      database.py
    models/         # SQLAlchemy ORM 모델
      user.py
    routes/         # FastAPI 라우터 (엔드포인트)
      auth.py
      posts.py
    schemas/        # Pydantic 데이터 검증/직렬화 스키마
      user.py
    README.md       # (이 파일)
```

## 주요 기술 스택
- Python 3.12+
- FastAPI
- SQLAlchemy (async)
- aiomysql
- Pydantic
- Uvicorn (ASGI 서버)

## 실행 방법

1. 의존성 설치
   ```bash
   pip install -r requirements.txt
   # 또는
   pip install fastapi uvicorn[standard] sqlalchemy aiomysql pydantic
   ```
2. 서버 실행
   ```bash
   python -m app
   # 또는
   uvicorn app.main:app --reload
   ```

## 환경 변수 예시 (.env)
```
SESSION_SECRET=your_secret
SESSION_COOKIE_NAME=sid
DB_HOST=project-db-cgi.smhr.com
DB_PORT=3307
DB_USER=cgi_25IS_LI1_p3_3
DB_PASS=smhrd3
DB_NAME=cgi_25IS_LI1_p3_3
```

## 주요 파일 설명
- **main.py**: FastAPI 앱 생성, 미들웨어 및 라우터 등록
- **core/database.py**: MySQL 비동기 연결(SQLAlchemy/aiomysql)
- **models/user.py**: 유저 ORM 모델 및 쿼리 함수
- **routes/auth.py**: 인증/로그인 관련 라우터 (OAuth 콜백 등)
- **routes/posts.py**: posts 관련 라우터
- **schemas/user.py**: 유저 데이터 직렬화/검증용 Pydantic 스키마

## 확장 및 커스텀
- OAuth(카카오/구글/네이버) 전략, 미들웨어, 추가 라우트 등은 core, routes, models, schemas에 자유롭게 추가/확장할 수 있습니다.
- 기존 server 폴더의 모든 기능은 이 구조로 옮겨졌으며, Node.js 코드가 없어도 FastAPI로만 동작합니다.

## 문의
- 구조/코드/확장 관련 문의는 언제든 README에 추가하거나, 이슈로 남겨주세요.
