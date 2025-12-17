import mongoose from "mongoose";

const userLoginSchema = new mongoose.Schema({
  loginName: {
    type: String,
    required: true,
    unique: true, // email must be unique
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  userType: {
    type: String,
    enum: ["COMPANY", "SCHOOL"],
    required: true
  },

  partyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Party",
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("UserLogin", userLoginSchema);
