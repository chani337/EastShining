import passport from "passport"
import { Strategy as NaverStrategy } from "passport-naver"
import dotenv from "dotenv"
dotenv.config()

passport.use(new NaverStrategy(
  {
    clientID: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/naver/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    const user = {
      provider: "naver",
      id: profile.id,
      name: profile.displayName || profile._json.nickname,
      photo: profile._json.profile_image
    }
    return done(null, user)
  }
))
