// server/models/users.model.mjs
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "project-db-cgi.smhr.com",
  user: process.env.DB_USER || "cgi_25IS_LI1_p3_3",
  password: process.env.DB_PASS || "smhrd3",
  database: process.env.DB_NAME || "cgi_25IS_LI1_p3_3",
  port: process.env.DB_PORT || 3307,
});

// 유저 조회
export async function findUserByInherent(user_inherent) {
  const [rows] = await pool.query(
    "SELECT * FROM ss_user WHERE user_inherent = ? LIMIT 1",
    [user_inherent]
  );
  return rows[0] || null;
}

// 유저 생성
export async function createUser(user) {
  const [result] = await pool.query(
    `INSERT INTO ss_user 
      (user_platform, user_inherent, user_nick, user_img) 
     VALUES (?, ?, ?, ?)`,
    [
      user.user_platform,
      user.user_inherent,
      user.user_nick,
      user.user_img,
    ]
  );
  return { ...user, user_id: result.insertId };
}

export async function upsertUserFromOAuth({ provider, inherent, nick=null, img=null }) {
  if (!provider || !inherent) throw new Error("provider/inherent 누락")

  await pool.query(
    `INSERT INTO ss_user
       (user_platform, user_inherent, user_nick, user_img, user_credit)
     VALUES (?, ?, ?, ?, 100)
     ON DUPLICATE KEY UPDATE
       user_platform = VALUES(user_platform),
       user_nick     = COALESCE(VALUES(user_nick), user_nick),
       user_img      = COALESCE(VALUES(user_img),  user_img)`,
    [provider, inherent, nick, img]
  );

  const [rows] = await pool.query(
    `SELECT user_id, user_platform, user_inherent, user_nick, user_img
     FROM ss_user
     WHERE user_inherent = ?
     LIMIT 1`,
    [inherent]
  );
  return rows?.[0] || null;
}