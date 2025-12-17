import mongoose from "mongoose";

const filledDonationSchema = new mongoose.Schema({
  FDS_FromParty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Party",
    required: true,
  },

  FDS_ToParty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Party",
  },

  FDS_ItemType: String,
  FDS_Quantity: Number,

  // ✅ DEFAULT DATE
  FDS_Date: {
    type: Date,
    default: Date.now,
  },

  // ✅ SHIPPING NUMBER
  FDS_ShippingNo: {
    type: Date,
    default:Date.now,
  },
});

export default mongoose.model("FilledDonation", filledDonationSchema);
