
# EastShining 프로젝트

React(Vite) 프론트엔드와 FastAPI 백엔드로 구성된 소셜 회원가입/로그인 데모 애플리케이션입니다. 카카오 OAuth를 중심으로 세션 기반 인증, 프론트/백 연동, Vite 프록시 설정까지 포함합니다.

## 주요 기능
- 카카오 간편 로그인/회원가입 (prompt=login으로 로그인/동의 화면 강제 표출)
- 카카오 계정 연결 해제(관리자 키 필요)로 재동의 유도 가능
- 세션 기반 인증(/auth/me, /auth/logout)과 프론트엔드 상태 반영
- React + Vite 개발 프록시로 쿠키(SameSite) 문제 최소화

## 기술 스택
- Frontend: React, Vite, TailwindCSS
- Backend: FastAPI, Uvicorn, Starlette SessionMiddleware
- DB: MySQL (aiomysql)
- OAuth: Kakao OAuth 2.0 (httpx)

## 폴더 구조
- `app/` — FastAPI 백엔드 소스
	- `api/routes/auth.py` — 인증 및 카카오 OAuth 엔드포인트
	- `api/models/users.py` — 사용자 조회/업서트 DB 로직(aiomysql)
	- `api/core/mysql.py` — MySQL 커넥션 풀 생성
	- `main.py` — 앱 부트스트랩(CORS, 세션, 라우터)
- `src/` — React 프론트엔드 소스
	- `App.jsx` — 상단 헤더/라우트, 인증 상태 반영 및 “세션 선택” 모달
	- `components/` — UI 컴포넌트들
- `vite.config.js` — 개발 프록시 설정(/auth, /api → http://localhost:8000)

---

## 빠른 시작 (Windows PowerShell 기준)

사전 요구사항
- Python 3.10+ (권장 3.12)
- Node.js 18+
- MySQL 8.x (로컬 또는 원격)

1) .env 설정
프로젝트 루트에 `.env` 파일을 생성하세요. 필요한 키 목록은 `.env.example` 참고.

2) 데이터베이스 준비
MySQL에 데이터베이스를 생성하고 `.env`의 접속 정보를 맞춰주세요.

3) 백엔드 실행

```powershell
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

개발 중 재시작 루프가 있다면 `--reload`를 빼고 실행하세요(특히 Windows에서 권장).

4) 프론트엔드 실행

```powershell
npm install
npm run dev
```

Vite dev server가 `http://localhost:5174`에서 뜨고, 프록시를 통해 `/auth/*` 요청이 자동으로 백엔드(`http://localhost:8000`)로 전달됩니다.

---

## 환경 변수(.env)

루트 `.env` 또는 `app/.env` 중 어느 한 곳에 설정하면 됩니다(백엔드가 둘 다 로드). 주요 키:

- 서버/프론트
	- `BACKEND_URL` (기본: http://localhost:8000)
	- `FRONTEND_URL` (기본: http://localhost:5174)
	- `SESSION_SECRET` (세션 쿠키 암호화 키)
	- `STRICT_CORS` ("1"이면 FRONTEND_URL만 허용, 기본은 전체 허용)

- DB (aiomysql)
	- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_PORT`

- Kakao OAuth
	- `KAKAO_CLIENT_ID` (REST API 키)
	- `KAKAO_REDIRECT_URI` (기본: http://localhost:8000/auth/kakao/callback)
	- `KAKAO_SCOPE` (예: `profile_nickname,profile_image`)
	- `KAKAO_ADMIN_KEY` (연결 해제용 관리자 키)

`.env.example` 파일을 복사하여 값을 채우면 빠르게 시작할 수 있습니다.

---

## 개발 프록시(vite)

`vite.config.js`에 `/auth`와 `/api`가 `http://localhost:8000`으로 프록시되도록 설정되어 있습니다. 프론트엔드에서 API 호출은 반드시 상대경로(`/auth/*`)로 하고, `credentials: 'include'`를 사용하세요. 이렇게 하면 개발 환경에서 쿠키 SameSite 문제를 최소화할 수 있습니다.

---

## 인증 플로우(카카오)

엔드포인트 요약
- `GET /auth/kakao/login` — 카카오 인증 페이지로 리다이렉트(prompt=login 포함)
- `GET /auth/kakao/callback` — 카카오 코드 콜백 → 토큰 교환 → 사용자정보 조회 → DB 업서트 → 세션 저장 → 프론트로 리다이렉트
- `GET /auth/me` — 세션에 저장된 사용자 조회(없으면 authenticated=false)
- `POST /auth/logout` — 세션 삭제
- `POST /auth/kakao/unlink` — 관리자 키로 카카오 연결 해제(성공 시 세션 정리)

세션/쿠키
- Starlette SessionMiddleware를 사용하여 서버 세션 쿠키에 `user_id`를 저장합니다.
- 개발 프록시를 사용하면 Cross-Site 쿠키 제약을 피할 수 있습니다(프론트에서 `credentials: 'include'`).

프론트 UX(세션 선택 모달)
- 로그인된 상태에서 카카오 버튼을 누르면 모달이 떠서 다음을 선택할 수 있습니다:
	- 현재 계정으로 계속하기(마이페이지로 이동)
	- 다른 계정으로 로그인(카카오 로그인 화면으로 이동)
	- 카카오 연결 해제 후 새로 로그인(관리자 키 필요)

---

## 데이터베이스

`app/api/models/users.py`에서 사용하는 컬럼 명칭 예시는 아래와 같습니다.
- `user_id` (PK, AUTO_INCREMENT)
- `user_platform` (예: "kakao")
- `user_inherent` (플랫폼 사용자 고유값, 예: 카카오 id)
- `user_nick`, `user_img`

플랫폼 고유값에 대한 유니크 제약을 권장합니다(예: UNIQUE(user_platform, user_inherent)).

---

## 문제 해결(Troubleshooting)

1) 8000 포트 사용 중 오류(Windows)

```powershell
$pids = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($pids) { $pids | ForEach-Object { Stop-Process -Id $_ -Force }; Write-Output ("Killed PIDs: " + ($pids -join ", ")) } else { Write-Output "No process using port 8000" }
```

2) 개발 서버가 계속 재시작됨(reload 루프)
- Windows에서 파일 감시 이슈가 있을 수 있습니다. `--reload` 옵션 없이 실행해 보세요.

3) `.env` 인식 안됨
- 루트 `.env` 또는 `app/.env` 중 하나에 값을 넣으세요.
- `app/main.py`에서 로드 로그가 출력되니 서버 시작 로그를 확인해 보세요.

4) 카카오 동의/로그인 화면이 안 보임(자동 로그인)
- 서버는 `prompt=login`으로 강제로 화면을 띄웁니다.
- 그래도 동일 계정이 자동 선택되면 `POST /auth/kakao/unlink`로 연결을 끊고 다시 시도하세요(관리자 키 필요).

5) 세션/쿠키가 유지되지 않음
- 프론트 fetch에 `credentials: 'include'`가 포함되어야 합니다.
- 개발 프록시를 사용하고 있는지 확인하세요(동일 도메인처럼 취급).

---

## 자주 쓰는 명령어(Windows PowerShell)

백엔드 실행(권장: reload 없이)
```powershell
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

프론트엔드 실행
```powershell
npm install
npm run dev
```

OpenAPI 스키마(서버 구동 중)
```powershell
curl http://localhost:8000/openapi.json
```

---

## 문의/기여
이슈 및 PR을 환영합니다. 버그 리포트 시 사용 환경(Windows/PowerShell, Python/Node 버전)과 콘솔 로그를 함께 첨부해 주세요.
