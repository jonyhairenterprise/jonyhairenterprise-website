import React, { useEffect, useState } from 'react';
import api from "@/lib/axios"; // ✅ Use configured axios instance for Auth
import { Trash2, Plus, Image as ImageIcon, Pencil, Loader2, X, UploadCloud } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { sooner } from "@/components/ui/use-sooner.jsx";

const AdminGallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    // Form States
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [altText, setAltText] = useState("");

    // Edit States
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingImage, setEditingImage] = useState(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const { data } = await api.get('/gallery');
            setImages(data);
        } catch (error) {
            console.error("Error fetching images");
        } finally {
            setFetchLoading(false);
        }
    };

    // --- HANDLERS ---

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            // 5MB Validation Check
            if (selectedFile.size > 5 * 1024 * 1024) {
                sooner.error("File Too Large", "Please upload an image smaller than 5MB.");
                e.target.value = null; // Input reset karo
                setFile(null);
                setPreview("");
                return;
            }

            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            sooner.error("Image Required", "Please select an image to upload.");
            return;
        }

        setLoading(true);
        const loadingSooner = sooner.loading("Uploading", "Processing image and saving to cloud...");

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('altText', altText);

            const { data } = await api.post('/gallery', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setImages([data, ...images]); // Prepend new image

            // Reset Form
            setFile(null);
            setPreview("");
            setAltText("");

            loadingSooner.update({
                title: "Uploaded!",
                description: "Image added to gallery successfully.",
                variant: "success",
                duration: 3000
            });

        } catch (error) {
            loadingSooner.update({
                title: "Upload Failed",
                description: error.response?.data?.message || "Could not upload image.",
                variant: "destructive",
                duration: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (img) => {
        setEditingImage(img);
        setAltText(img.altText);
        setPreview(img.imageUrl); // Show current image as preview
        setFile(null); // Reset file input
        setIsEditOpen(true);
    };

    const handleUpdateSubmit = async () => {
        if (!editingImage) return;

        setLoading(true);
        const loadingSooner = sooner.loading("Updating", "Saving changes...");

        try {
            const formData = new FormData();
            formData.append('altText', altText);
            if (file) {
                formData.append('image', file); // Only append if new file selected
            }

            const { data } = await api.put(`/gallery/${editingImage._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Update local state
            setImages(images.map(img => img._id === data._id ? data : img));
            setIsEditOpen(false);

            loadingSooner.update({
                title: "Updated!",
                description: "Image details updated successfully.",
                variant: "success",
                duration: 3000
            });

        } catch (error) {
            loadingSooner.update({
                title: "Update Failed",
                description: "Could not update image.",
                variant: "destructive",
                duration: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmationSooner = sooner.error(
            "Confirm Delete",
            "This will permanently delete the image from database and cloud.",
            Infinity
        );

        confirmationSooner.update({
            action: (
                <div className='flex gap-2'>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                            confirmationSooner.dismiss();
                            const deleteLoading = sooner.loading("Deleting...", "Removing image...");

                            try {
                                await api.delete(`/gallery/${id}`);
                                setImages(images.filter(img => img._id !== id));

                                deleteLoading.update({
                                    title: "Deleted",
                                    description: "Image removed permanently.",
                                    variant: "success",
                                    duration: 3000
                                });
                            } catch (error) {
                                deleteLoading.update({
                                    title: "Failed",
                                    description: "Could not delete image.",
                                    variant: "destructive",
                                    duration: 3000
                                });
                            }
                        }}
                    >
                        Yes, Delete
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => confirmationSooner.dismiss()}>Cancel</Button>
                </div>
            ),
            variant: "interactive",
            duration: Infinity
        });
    };

    return (
        <div className="space-y-8 pb-20">

            {/* HEADER */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Gallery Manager</h1>
                <p className="text-gray-500 dark:text-slate-400">Upload and manage showcase images. Images are auto-converted to WebP.</p>
            </div>

            {/* ADD IMAGE CARD */}
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                        <UploadCloud className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upload New Image</h3>
                </div>

                <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* File Drop Area */}
                    <div className="md:col-span-4 lg:col-span-3">
                        <div className="relative w-full aspect-square bg-gray-50 dark:bg-slate-950 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center overflow-hidden group hover:border-purple-400 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                            />

                            {preview ? (
                                <>
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <p className="text-white text-xs font-bold">Change Image</p>
                                    </div>
                                </>
                            ) : (
                                <div className="p-4">
                                    <ImageIcon className="h-8 w-8 text-gray-300 dark:text-slate-600 mx-auto mb-2" />
                                    <p className="text-xs font-bold text-gray-500 dark:text-slate-400">Click to Upload</p>
                                    <p className="text-[10px] text-gray-400 mt-1">Max 5MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Alt Text / Description</label>
                                <Input
                                    value={altText}
                                    onChange={(e) => setAltText(e.target.value)}
                                    placeholder="e.g. Raw Curly Bundle close-up"
                                    className="h-12 rounded-xl bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button type="submit" disabled={loading || !file} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-12 px-8 font-bold shadow-lg shadow-purple-200 dark:shadow-none">
                                {loading ? <Loader2 className="animate-spin" /> : <><Plus className="h-5 w-5 mr-2" /> Add to Gallery</>}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            {/* GALLERY GRID */}
            {fetchLoading ? (
                <div className="py-20 text-center text-gray-400 animate-pulse">Loading Gallery...</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {images.map((img) => (
                        <div key={img._id} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-slate-800">
                            <img
                                src={img.imageUrl}
                                alt={img.altText}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Overlay Actions */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                                <p className="text-white text-xs font-medium text-center line-clamp-2 px-2">
                                    {img.altText}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditClick(img)}
                                        className="p-2 bg-white/20 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-md transition-all"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(img._id)}
                                        className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full backdrop-blur-md transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* EDIT MODAL */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Edit Image Details</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Image Preview & Change */}
                        <div className="flex justify-center">
                            <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 dark:border-slate-700 group cursor-pointer">
                                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                <img src={preview} alt="Edit Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <p className="text-white text-xs font-bold">Replace Image</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Alt Text</label>
                            <Input
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                className="h-12 rounded-xl bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800"
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex gap-2">
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateSubmit} disabled={loading} className="bg-primary text-white rounded-xl">
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default AdminGallery;