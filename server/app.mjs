// server/app.mjs
import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import session from "express-session"
import passport from "passport"
import dotenv from "dotenv"

import postsRoute from "./routes/posts.route.mjs"
import authRoute from "./routes/auth.route.mjs"
import { notFound, errorHandler } from "./controllers/middlewares/error.mjs"
import { findUserByInherent } from "./models/users.model.mjs"  // DB 조회용

dotenv.config()

const app = express()

// (HTTPS 프록시 뒤에서 secure 쿠키를 쓸 땐 주석 해제)
// app.set('trust proxy', 1)

// 기본 미들웨어
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(cors({
  origin: ["http://localhost:5174", "http://127.0.0.1:5174"],
  credentials: true,
}))
app.use(express.json())
app.use(morgan("dev"))

// 세션 (우리 세션만 사용)
app.use(session({
  name: "sid",
  secret: process.env.SESSION_SECRET || "selfstar-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,      // 로컬 http 개발
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}))

// OAuth 핸드셰이크만 passport 사용 (세션은 사용하지 않음)
app.use(passport.initialize())

// 매 요청마다 세션 키로 유저 로드 → req.user 세팅
app.use(async (req, _res, next) => {
  try {
    const inherent = req.session?.user_inherent
    if (!inherent) return next()
    const user = await findUserByInherent(inherent)
    req.user = user || null
    next()
  } catch (err) {
    next(err)
  }
})

// 헬스체크
app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// 로그인 상태 확인(비로그인도 200으로 통일 → 콘솔 깔끔)
app.get("/auth/me", (req, res) => {
  if (req.user) {
    const u = req.user
    return res.json({
      ok: true, authenticated: true,
      user: {
        id: u.user_id,
        inherent: u.user_inherent,
        nick: u.user_nick || u.user_name || null,
        img: u.user_img || null,
        platform: u.user_platform || null,
      }
    })
  }
  return res.json({ ok: true, authenticated: false, user: null })
})

// 라우트
app.use("/api/posts", postsRoute)
app.use("/auth", authRoute)

// 에러 핸들러
app.use(notFound)
app.use(errorHandler)

export default app
