import mysql from "mysql2/promise"
import dotenv from "dotenv"
dotenv.config()

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "project-db-cgi.smhr.com",
  port: process.env.DB_PORT || 3307,
  user: process.env.DB_USER || "cgi_25IS_LI1_p3_3",
  password: process.env.DB_PASS || "smhrd3",
  database: process.env.DB_NAME || "cgi_25IS_LI1_p3_3",
  connectionLimit: 10
})
