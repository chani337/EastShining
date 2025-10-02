import dotenv from "dotenv"
dotenv.config();
import app from "./app.mjs"

console.log("ID:", process.env.GOOGLE_CLIENT_ID);
console.log("SECRET length:", process.env.GOOGLE_CLIENT_SECRET?.length);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[API] running at http://localhost:${PORT}`)
})
