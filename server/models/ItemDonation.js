import mongoose from "mongoose";

const itemDonationSchema = new mongoose.Schema({
  ITD_Party: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Party",        // Company
    required: true,
  },

  ITD_ItemType: {
    type: String,
    required: true,
  },

  ITD_Quantity: {
    type: Number,
    required: true,
  },

  ITD_PendingQuantity: {
    type: Number,
    required: true,
  },

  ITD_Date: {
    type: Date,
    default: Date.now,
  },

  ITD_ShippingNo: {
    type: String,
  },
});

export default mongoose.model("ItemDonation", itemDonationSchema);
