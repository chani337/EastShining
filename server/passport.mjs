// server/passport.mjs
import passport from "passport";
import "./strategies/kakao.mjs"; // 카카오 Strategy 등록
import { findUserByInherent } from "./models/users.model.mjs";

// 세션에 무엇을 넣을지(최소화) — 고유키만
passport.serializeUser((user, done) => {
  done(null, user.user_inherent);
});

// 요청마다 세션에서 사용자 복원
passport.deserializeUser(async (user_inherent, done) => {
  try {
    const user = await findUserByInherent(user_inherent);
    done(null, user || null);
  } catch (e) {
    done(e, null);
  }
});

export default passport;
