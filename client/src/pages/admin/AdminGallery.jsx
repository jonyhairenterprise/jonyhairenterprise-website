import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { Button } from "@/components/ui/button"; // Assuming you have shadcn or similar button

const AdminGallery = () => {
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({ imageUrl: '', altText: '' });
    const [loading, setLoading] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/gallery`);
            setImages(res.data);
        } catch (error) {
            console.error("Error fetching images");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/gallery`, formData);
            setFormData({ imageUrl: '', altText: '' });
            fetchImages(); // Refresh list
        } catch (error) {
            alert("Failed to add image");
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;
        try {
            await axios.delete(`${API_URL}/api/gallery/${id}`);
            fetchImages();
        } catch (error) {
            console.error("Error deleting image");
        }
    };

    return (
        <div className="p-6 space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Gallery Management</h2>
            </div>

            {/* ADD IMAGE FORM */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-purple-600" /> Add New Image
                </h3>
                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3 items-end">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Image URL</label>
                        <input
                            type="text"
                            placeholder="https://..."
                            required
                            className="w-full p-2 rounded-md border bg-transparent"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Alt Text (Description)</label>
                        <input
                            type="text"
                            placeholder="e.g. Raw Curly Hair Bundle"
                            required
                            className="w-full p-2 rounded-md border bg-transparent"
                            value={formData.altText}
                            onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                        />
                    </div>
                    <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white">
                        {loading ? 'Adding...' : <><Plus className="w-4 h-4 mr-2" /> Add to Gallery</>}
                    </Button>
                </form>
            </div>

            {/* GALLERY GRID (ADMIN VIEW) */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((img) => (
                    <div key={img._id} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-slate-800">
                        <img
                            src={img.imageUrl}
                            alt={img.altText}
                            className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                onClick={() => handleDelete(img._id)}
                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-2 text-xs text-center truncate bg-gray-50 dark:bg-slate-900">
                            {img.altText}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminGallery;