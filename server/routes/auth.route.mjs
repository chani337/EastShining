// server/routes/auth.route.mjs
import { Router } from "express";
import passport from "passport";
import "../strategies/kakao.mjs";  // 카카오 전략 불러오기
import "../strategies/google.mjs"; // Google 불러오기

const r = Router();

/* ======== 카카오 ========*/
// 로그인 시작 (카카오 인증 요청)
r.get("/kakao", passport.authenticate("kakao"));

// 콜백
r.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "http://localhost:5174/login",
    session: true, // 세션 저장 (true 기본값, 명시하면 안정적)
  }),
  (req, res) => {
    // 로그인 성공 → 프론트 이동
    res.redirect("http://localhost:5174/");
  }
);

/* ======== 구글 ========*/
r.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

r.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5174/login",
    session: true,
  }),
  (req, res) => {
    // 로그인 성공 → 프론트 이동
    res.redirect("http://localhost:5174/");
  }
);

export default r;
