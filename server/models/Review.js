const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // Product ab optional hai. Agar ye null hai, to iska matlab ye "Website Review" hai.
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Product",
    },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },

    // Admin Controls
    isFeatured: { type: Boolean, default: false }, // Ye Home page par dikhane ke liye toggle hoga
    adminReply: { type: String, default: "" },
    isLoved: { type: Boolean, default: false },

    // Type identify karne ke liye (Future proofing)
    reviewType: {
      type: String,
      enum: ["product", "website"],
      default: "product",
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
