import dotenv from "dotenv"
dotenv.config()

import express from "express"
import dbConnect from "./database/db.js"
import authRoutes from "./routes/authRoutes.js"
import requestRoutes from "./routes/requestRoutes.js"
import donationRoutes from "./routes/donationRoutes.js"

const app = express()

// Middleware
app.use(express.json())

// Connect to MongoDB
await dbConnect()

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/requests", requestRoutes);

// Test route (optional)
app.get("/", (req, res) => {
  res.send("API is running 🚀")
})

// Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`)
})

app.use("/api/donations", donationRoutes);

