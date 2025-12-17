import mongoose from "mongoose";

const partySchema = new mongoose.Schema({
  partyType: {
    type: String,
    enum: ["COMPANY", "SCHOOL"],
    required: true
  },

  name: {
    type: String,
    required: true
  },

  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true
  },

  contactName: String,
  contactPhone: String,
  contactEmail: String,

  imageName: String,

  isValid: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model("Party", partySchema);
