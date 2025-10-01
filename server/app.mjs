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

dotenv.config()

const app = express()

// 기본 미들웨어
app.use(helmet())
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(morgan("dev"))

// 세션 & passport
app.use(session({
  secret: process.env.SESSION_SECRET || "selfstar-secret",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((obj, done) => done(null, obj))

// 헬스체크
app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

// 라우트
app.use("/api/posts", postsRoute)
app.use("/auth", authRoute)

// 에러 핸들러
app.use(notFound)
app.use(errorHandler)

export default app
