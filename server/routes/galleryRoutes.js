const express = require("express");
const router = express.Router();
const Gallery = require("../models/Gallery");

// @route   GET /api/gallery
// @desc    Get all gallery images
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
// @desc    Add new image
// @access  Private (Admin)
router.post("/", async (req, res) => {
  const { imageUrl, altText } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ message: "Image URL is required" });
  }

  try {
    const newImage = new Gallery({
      imageUrl,
      altText,
    });

    const savedImage = await newImage.save();
    res.json(savedImage);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete image
// @access  Private (Admin)
router.delete("/:id", async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    await image.deleteOne();
    res.json({ message: "Image removed" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
