const express = require("express");
const router = express.Router();
const Gallery = require("../models/Gallery");
const { protect, admin } = require("../middleware/authMiddleware");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const stream = require("stream");

// --- Cloudinary Config ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Multer Config (Memory Storage) ---
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
});

// --- Helper: Upload to Cloudinary (Convert to WebP) ---
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "jony-hair-gallery",
        format: "webp", // Force convert to WebP
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);
    bufferStream.pipe(uploadStream);
  });
};

// --- Helper: Get Public ID for Deletion ---
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    const parts = url.split("/");
    const filename = parts.pop();
    const folder = parts.pop();
    return `${folder}/${filename.split(".")[0]}`;
  } catch (err) {
    return null;
  }
};

// ============================================================================
//                                ROUTES
// ============================================================================

// @route   GET /api/gallery
// @desc    Get all images
// @access  Public
router.get("/", async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/gallery
// @desc    Upload new image
// @access  Private (Admin)
router.post("/", protect, admin, upload.single("image"), async (req, res) => {
  try {
    const { altText } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Please select an image to upload." });
    }

    // 1. Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file.buffer);

    // 2. Save to DB
    const newImage = new Gallery({
      imageUrl,
      altText: altText || "Jony Hair Gallery Image",
    });

    const savedImage = await newImage.save();
    res.status(201).json(savedImage);
  } catch (err) {
    console.error("Gallery Upload Error:", err);
    res.status(500).json({ message: "Image upload failed." });
  }
});

// @route   PUT /api/gallery/:id
// @desc    Update image (Replace file OR update text)
// @access  Private (Admin)
router.put("/:id", protect, admin, upload.single("image"), async (req, res) => {
  try {
    const { altText } = req.body;
    const image = await Gallery.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Update Alt Text
    if (altText) image.altText = altText;

    // Update Image File (If provided)
    if (req.file) {
      // 1. Purani image delete karo Cloudinary se
      const publicId = getPublicIdFromUrl(image.imageUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }

      // 2. Nayi image upload karo
      const newImageUrl = await uploadToCloudinary(req.file.buffer);
      image.imageUrl = newImageUrl;
    }

    const updatedImage = await image.save();
    res.json(updatedImage);
  } catch (err) {
    console.error("Gallery Update Error:", err);
    res.status(500).json({ message: "Update failed." });
  }
});

// @route   DELETE /api/gallery/:id
// @desc    Permanently delete image (DB + Cloudinary)
// @access  Private (Admin)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // 1. Delete from Cloudinary
    const publicId = getPublicIdFromUrl(image.imageUrl);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    // 2. Delete from DB
    await image.deleteOne();

    res.json({ message: "Image permanently deleted" });
  } catch (err) {
    console.error("Gallery Delete Error:", err);
    res.status(500).json({ message: "Delete failed." });
  }
});

module.exports = router;
