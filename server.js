import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import userRoutes from "./routes/userRoutes.js"
import articleRoutes from "./routes/articleRoutes.js"

dotenv.config()
connectDB()

const app = express()

// Middleware
app.use(
  cors({
    origin: "https://final-project-henna-five.vercel.app", // Vite default port
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/users", userRoutes)
app.use("/api/articles", articleRoutes)

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Amido Backend API is running!" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Server Error", error: err.message })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
