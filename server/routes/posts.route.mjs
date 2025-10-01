// server/routes/posts.route.mjs
import { Router } from "express";

const r = Router();

// 임시 테스트용 라우트
r.get("/", (req, res) => {
  res.json({ message: "posts route is working" });
});

export default r;