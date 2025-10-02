// server/routes/auth.route.mjs
import { Router } from "express";
import passport from "passport";
import "../strategies/kakao.mjs";   // 카카오 전략
import "../strategies/google.mjs";  // 구글 전략
import { upsertUserFromOAuth } from "../models/users.model.mjs";

const r = Router();
const FRONT_URL = process.env.FRONT_URL || "http://localhost:5174";
const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME || "sid";

/* ======== 카카오 ======== */
r.get("/kakao", passport.authenticate("kakao", { scope: ["profile_nickname", "profile_image"] }));

// passport 세션 비활성화(session:false) + 우리 세션만 사용
r.get("/kakao/callback", (req, res, next) => {
  passport.authenticate("kakao", { session: false }, async (err, profile, info) => {
    try {
      console.log("[kakao/callback] hit"); // ✅ 이게 찍히는지 먼저 확인

      if (err) {
        console.error("[kakao/callback] err:", err);
        return res.redirect(`${FRONT_URL}/?auth=failed`);
      }
      if (!profile) {
        console.error("[kakao/callback] no profile:", info);
        return res.redirect(`${FRONT_URL}/?auth=failed`);
      }

      // ✅ 프로필과 id 로그로 확인
      const raw = profile._json || {};
      console.log("[kakao] ids", { profileId: profile.id, rawId: raw.id });

      const idVal = profile.id ?? raw.id ?? null;
      if (!idVal) {
        console.error("[kakao] missing id in profile");
        return res.redirect(`${FRONT_URL}/?auth=missing_id`);
      }
      const kakaoId = String(idVal);
      const inherent = `kakao:${kakaoId}`;

      const props = raw.properties || {};
      const accp  = raw.kakao_account?.profile || {};
      const nick =
        props.nickname ??
        accp.nickname ??
        profile.displayName ??
        profile.username ??
        null;

      const img =
        accp.profile_image_url ??
        props.profile_image_url ??
        props.profile_image ??
        accp.thumbnail_image_url ??
        props.thumbnail_image ??
        null;

      console.log("[kakao] upsert args:", { inherent, nick, hasImg: !!img });

      const row = await upsertUserFromOAuth({
        provider: "kakao",
        inherent,
        nick,
        img,
      });

      req.session.user_inherent = row.user_inherent;
      return res.redirect(FRONT_URL + "/");
    } catch (e) {
      console.error("[kakao/callback] handler error:", e);
      return res.redirect(`${FRONT_URL}/?auth=failed`);
    }
  })(req, res, next);
});

/* ======== 구글 ======== */
// email scope 제거
r.get("/google", passport.authenticate("google", { scope: ["profile"] }));

r.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONT_URL}/login`,
    session: false,
  }),
  async (req, res, next) => {
    try {
      const profile = req.user;
      const googleId = profile?.id;

      const inherent = `google:${googleId}`;
      const nick = profile?.displayName ?? null;
      const img = Array.isArray(profile?.photos) ? profile.photos[0]?.value : null;

      const row = await upsertUserFromOAuth({
        provider: "google",
        inherent,
        nick,
        img,
      });

      req.session.user_inherent = row.user_inherent;
      return res.redirect(FRONT_URL + "/");
    } catch (e) {
      next(e);
    }
  }
);

/* ======== 로그인된 유저 조회 ======== */
r.get("/me", (req, res) => {
  const u = req.user; // app.mjs의 미들웨어가 채움
  if (u) {
    return res.json({
      ok: true,
      authenticated: true,
      user: {
        id: u.user_id,
        inherent: u.user_inherent,
        nick: u.user_nick || u.user_name || null,
        img: u.user_img || null,
        platform: u.user_platform || null,
      },
    });
  }
  return res.json({ ok: true, authenticated: false, user: null });
});

/* ======== 로그아웃 ======== */
r.post("/logout", (req, res) => {
  req.session?.destroy(() => {});
  res.clearCookie(SESSION_COOKIE); // app.mjs의 session name('sid')와 동일
  res.sendStatus(204);
});

export default r;
