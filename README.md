
# EastShining 프로젝트

## 개요
React(Vite) 프론트엔드와 FastAPI 백엔드로 구성된 소셜 회원가입/로그인 플랫폼입니다.

### 주요 기능
- 카카오, 네이버, 구글 등 소셜 로그인/회원가입 연동
- 이메일 회원가입 및 로그인
- 사용자 정보 관리, 마이페이지, 채팅 등

## 실행 방법

### 1. 백엔드(FastAPI)
```bash
uvicorn app.__main__:app --reload --host 0.0.0.0 --port 8000
```

### 2. 프론트엔드(React/Vite)
```bash
npm install
npm run dev
```

### 3. 소셜 로그인 연동
- 카카오/네이버/구글 개발자 콘솔에서 redirect_uri를 반드시 등록해야 합니다.
- Codespaces/배포 환경에서는 외부 주소, 로컬에서는 localhost 주소를 등록하세요.

## 폴더 구조
- `app/` : FastAPI 백엔드
- `src/` : React 프론트엔드
- `components/` : 프론트 공용 컴포넌트

## 문의/기여
이슈 및 PR 환영합니다.
