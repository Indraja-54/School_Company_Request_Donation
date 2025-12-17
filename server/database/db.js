import mongoose from "mongoose"

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("✅ MongoDB Connected Successfully...")
  } catch (err) {
    console.log("❌ MongoDB Connection Error:", err.message)
    process.exit(1)
  }
}

export default dbConnect
