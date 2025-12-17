import mongoose from "mongoose";

const itemRequestSchema = new mongoose.Schema({
  ITR_Party: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Party",
    required: true
  },
  ITR_ItemType: {
    type: String,
    required: true
  },
  ITR_QuantityRequested: Number,
  ITR_PendingQuantity: Number,
  ITR_RequestStatus: {
    type: String,
    enum: ["Pending", "Partially Filled", "Completed"],
    default: "Pending"
  }
}, { timestamps: true });

export default mongoose.model("ItemRequest", itemRequestSchema);
