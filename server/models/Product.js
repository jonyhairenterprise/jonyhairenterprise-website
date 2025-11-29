const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },

    // New: Pricing ab Length ke saath juda hua hai
    // Example: [{ length: "10 inch", price: 100 }, { length: "12 inch", price: 200 }]
    variants: [
      {
        length: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],

    // Stock (Total)
    stock: { type: Number, default: 0 },

    isBestSeller: { type: Boolean, default: false },

    // Images
    image: { type: String, required: true }, // Main Image
    gallery: [{ type: String }], // Extra Images (Max 5)

    // Colors (Dynamic Array)
    colors: [{ type: String }],

    // Highlights (Ab ye Rich Text HTML String hoga)
    highlights: { type: String },

    description: { type: String }, // Normal description

    shipping: {
      from: { type: String, default: "Beldanga, West Bengal" },
      type: { type: String, default: "International Shipping" },
      time: { type: String, default: "3-5 Days" },
    },

    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: String },
        rating: { type: Number },
        comment: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ✅ SEO & Search Optimization Indexing
// Name aur Category par text index lagao taaki search fast ho
productSchema.index({ name: "text", category: "text" });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
