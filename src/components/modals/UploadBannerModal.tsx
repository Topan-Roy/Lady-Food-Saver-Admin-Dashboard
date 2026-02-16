import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAddBannerMutation } from '../../redux/features/banner';

interface UploadBannerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UploadBannerModal({ isOpen, onClose }: UploadBannerModalProps) {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [startTime, setStartTime] = useState(() => {
        const d = new Date();
        return d.toISOString().split('T')[0];
    });
    const [endTime, setEndTime] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        return d.toISOString().split('T')[0];
    });
    const [addBanner, { isLoading }] = useAddBannerMutation();

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setError(null);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setImage(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image || !title) return;
        setError(null);

        if (new Date(endTime) <= new Date(startTime)) {
            setError('End time must be after start time');
            return;
        }

        try {
            // Step 1: Upload image to ImgBB to get a URL
            const formData = new FormData();
            formData.append('image', image);

            // Using ImgBB free API (you can replace with your own upload endpoint)
            const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;
            const uploadResponse = await fetch(
                `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload image');
            }

            const uploadData = await uploadResponse.json();
            const imageUrl = uploadData.data.url;

            // Step 2: Format dates to DD-MM-YYYY (Required by backend validation)
            const formatDate = (dateStr: string) => {
                if (!dateStr) return '';
                const [year, month, day] = dateStr.split('-');
                return `${day}-${month}-${year}`;
            };

            const startFormatted = formatDate(startTime);
            const endFormatted = formatDate(endTime);

            // Step 3: Create banner with the image URL
            const bannerData = {
                title,
                bannerImage: imageUrl,
                startTime: startFormatted,
                endTime: endFormatted,
                status: 'ACTIVE'
            };

            console.log('Sending Banner Payload:', bannerData);

            await addBanner(bannerData).unwrap();
            setTitle('');
            setImage(null);
            onClose();
        } catch (err: any) {
            console.error('Upload failed details:', {
                status: err?.status,
                data: err?.data,
                message: err?.message
            });
            setError(err?.data?.message || err?.message || 'Failed to upload banner.');
        }
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Upload Banner">
            <form
                className="space-y-6"
                onSubmit={handleSubmit}
            >
                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold">
                        {error}
                    </div>
                )}
                <div
                    className="relative border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center transition-colors hover:border-[#E4983A] group cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('banner-upload')?.click()}
                >
                    <input
                        id="banner-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                    />
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-[#E4983A]" />
                        </div>
                        <p className="text-lg font-bold text-gray-900 mb-1">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-400">
                            SVG, PNG, JPG or GIF (max. 800x400px)
                        </p>
                    </div>
                    {image && (
                        <div className="absolute inset-0 bg-white rounded-3xl flex items-center justify-center p-4">
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Preview"
                                className="max-h-full rounded-2xl object-cover"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setImage(null);
                                }}
                                className="absolute top-4 right-4 p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Banner Title
                    </label>
                    <Input
                        placeholder="e.g., Summer Sale 2024"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="rounded-2xl"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Start Date
                        </label>
                        <Input
                            type="date"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="rounded-2xl"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            End Date
                        </label>
                        <Input
                            type="date"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="rounded-2xl"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        className="px-8 rounded-2xl"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="px-8 rounded-2xl bg-[#E4983A] hover:bg-[#E4983A]"
                        disabled={!image || !title || isLoading}
                    >
                        {isLoading ? 'Uploading...' : 'Upload Banner'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
