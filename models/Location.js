import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  title: String,
  area: String,
  lat: Number,
  lng: Number,
  type: String,
  time: String,
  contact: String,
  submittedBy: String,

  status: { type: String, default: "pending" },

  expireAt: Date, // 🔥 auto expire field

  trueCount: { type: Number, default: 0 },
  fakeCount: { type: Number, default: 0 },
  voters: [String]

}, { timestamps: true });

export default mongoose.model("Location", locationSchema);
