import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import dotenv from "dotenv"
dotenv.config()

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    const user = {
      provider: "google",
      id: profile.id,
      name: profile.displayName,
      photo: profile.photos?.[0]?.value
    }
    return done(null, user)
  }
))
