// server/strategies/kakao.mjs
import passport from "passport";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { findUserByInherent, createUser } from "../models/users.model.mjs";

const BACK_URL =
  process.env.BACK_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:4000";

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: `${BACK_URL}/auth/kakao/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      // ✅ DB 작업하지 말고 프로필만 넘겨요
      done(null, profile);
    }
  )
);
