import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Ensure API base URL is configured properly

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Adjust as per your setup

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/gallery`);
            setImages(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching gallery:", error);
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Our <span className="text-purple-600">Gallery</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-slate-400">
                        Explore our premium collection of textures and styles.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center text-gray-500">Loading gallery...</div>
                ) : (
                    /* MASONRY GRID LAYOUT */
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                        {images.map((img) => (
                            <div key={img._id} className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-lg">
                                <img
                                    src={img.imageUrl}
                                    alt={img.altText}
                                    className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />
                                {/* Optional: Hover Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <p className="text-white text-sm font-medium">{img.altText}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;