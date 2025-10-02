// server/strategies/kakao.mjs
import passport from "passport";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { findUserByInherent, createUser } from "../models/users.model.mjs";

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: "/auth/kakao/callback"
      // scope 제거 → 기본적으로 닉네임, 프로필 이미지는 제공됨
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Kakao profile:", profile); // 디버깅용 출력

        const kakaoId = profile.id.toString();
        let user = await findUserByInherent(kakaoId);

        if (!user) {
          user = await createUser({
            user_platform: "kakao",
            user_inherent: kakaoId,
            user_nick: profile.displayName || "",
            user_img: profile._json?.properties?.profile_image || null
          });
        }

        return done(null, user);
      } catch (err) {
        console.error("Kakao Strategy Error:", err);
        return done(err, null);
      }
    }
  )
);
