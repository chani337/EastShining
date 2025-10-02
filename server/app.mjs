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

// (HTTPS 프록시 뒤에서 쿠키 옵션 'secure'를 쓰게 될 경우 필요)
// app.set('trust proxy', 1)

// 기본 미들웨어
app.use(helmet({
  crossOriginResourcePolicy: false, // 이미지/정적 리소스 교차 제공 이슈 예방(선택)
}))
app.use(cors({
  origin: ["http://localhost:5174", "http://127.0.0.1:5174"], // 프론트 정확히 지정
  credentials: true,
}))
app.use(express.json())
app.use(morgan("dev"))

// 세션 & passport
app.use(session({
  name: "sid",
  secret: process.env.SESSION_SECRET || "selfstar-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    // 로컬 개발은 http이므로 secure:false + sameSite:'lax' 가 가장 안전
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}))
app.use(passport.initialize())
app.use(passport.session())

// 세션 직렬화/복원 : user 전체 대신 식별자만 저장
passport.serializeUser((user, done) => {
  done(null, user.user_inherent)   // DB PK나 social_id만 저장
})

passport.deserializeUser(async (inherent, done) => {
  try {
    const user = await findUserByInherent(inherent)
    done(null, user || null)
  } catch (err) {
    done(err, null)
  }
})

// 헬스체크
app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

// 라우트
app.use("/api/posts", postsRoute)
app.use("/auth", authRoute)

// 로그인 상태 확인(비로그인도 200으로 통일해 콘솔 깔끔)
app.get("/auth/me", (req, res) => {
  const row = req.user || null;
  if (row) {
    return res.json({
      ok: true,
      authenticated: true,
      user: {
        id: row.user_id,
        inherent: row.user_inherent,
        nick: row.user_nick || row.user_name || null,
        img: row.user_img || null,
        platform: row.user_platform || null,
      },
    });
  }
  return res.json({ ok: true, authenticated: false, user: null });
});


// 에러 핸들러
app.use(notFound)
app.use(errorHandler)

export default app
