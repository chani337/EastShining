import app from "./app.mjs"
import dotenv from "dotenv"
dotenv.config()

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`[API] running at http://localhost:${PORT}`)
})
