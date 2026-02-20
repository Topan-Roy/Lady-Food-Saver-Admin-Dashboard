import { useState, useEffect, useRef } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { User, Mail, Phone, MapPin, Calendar, Camera, Loader2, CheckCircle2 } from 'lucide-react';
import { useGetProfileQuery, useUpdateProfileMutation } from '../redux/features/setting.ts';
import { format } from 'date-fns';

export function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery({});
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: '',
        Role: '',
        Email: '',
        PhoneNumber: '',
        address: '',
        Boi: '',
        JoinedDate: '',
        avatar: ''
    });

    useEffect(() => {
        if (profileData?.data) {
            const user = profileData.data;
            setFormData({
                name: user.name || '',
                Role: user.Role || 'Admin',
                Email: user.Email || '',
                PhoneNumber: user.PhoneNumber || user.phone || '',
                address: user.address || '',
                Boi: user.Boi || user.bio || '',
                JoinedDate: user.JoinedDate || '',
                avatar: user.profilePic || user.avatar || ''
            });
        }
    }, [profileData]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                setIsUploading(true);
                const uploadData = new FormData();
                uploadData.append('image', file);

                const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;
                const uploadResponse = await fetch(
                    `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
                    {
                        method: 'POST',
                        body: uploadData,
                    }
                );

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload image');
                }

                const result = await uploadResponse.json();
                const imageUrl = result.data.url;

                // Immediately update profile with new image
                await updateProfile({
                    profilePic: imageUrl
                }).unwrap();

                setFormData(prev => ({ ...prev, avatar: imageUrl }));
                alert('Profile picture updated successfully!');
            } catch (error) {
                console.error('Image upload failed:', error);
                alert('Failed to upload image. Please try again.');
            } finally {
                setIsUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        }
    };

    const handleSave = async () => {
        if (!isEditing) {
            setIsEditing(true);
            return;
        }

        try {
            await updateProfile({
                name: formData.name,
                PhoneNumber: formData.PhoneNumber,
                Boi: formData.Boi,
                address: formData.address,
            }).unwrap();
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    if (isProfileLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-12 w-12 animate-spin text-[#E4983A]" />
                        <p className="text-gray-500 font-medium animate-pulse">Loading profile...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Profile</h1>
                        <p className="text-gray-500 font-medium">Manage your personal information and account settings.</p>
                    </div>
                    {isEditing && (
                        <div className="flex gap-2 mb-1">
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-[#E4983A] text-xs font-bold rounded-full border border-orange-100 uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#E4983A] animate-pulse"></span>
                                Editing Mode
                            </span>
                        </div>
                    )}
                </div>

                {/* Profile Header Card */}
                <Card className="relative overflow-hidden border-none shadow-2xl shadow-orange-100/50">
                    <div className="h-40 bg-gradient-to-br from-[#E4983A] via-orange-400 to-rose-400 -m-6 mb-12 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-8 relative px-4">
                        <div className="relative group">
                            <div className="relative">
                                <Avatar
                                    src={formData.avatar}
                                    fallback={formData.name?.substring(0, 2).toUpperCase() || 'AD'}
                                    className="w-36 h-36 rounded-[2.5rem] border-8 border-white shadow-2xl ring-1 ring-gray-100 object-cover"
                                />
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center backdrop-blur-[2px]">
                                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                className="hidden"
                                accept="image/*"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="absolute -bottom-2 -right-2 p-3 bg-white rounded-2xl shadow-xl border border-gray-100 text-gray-400 hover:text-[#E4983A] hover:scale-110 transition-all active:scale-95 group-hover:rotate-12"
                                title="Change Avatar"
                            >
                                <Camera className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex-1 text-center md:text-left mb-4">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{formData.name}</h2>
                            <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg uppercase tracking-widest">{formData.Role}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span className="text-sm text-gray-500 font-medium">{formData.Email}</span>
                            </div>
                        </div>
                        <div className="mb-4">
                            <Button
                                variant={isEditing ? 'primary' : 'outline'}
                                onClick={handleSave}
                                disabled={isUpdating}
                                className={`min-w-[140px] h-12 rounded-2xl font-bold transition-all ${isEditing ? 'shadow-lg shadow-orange-200' : ''}`}
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : isEditing ? (
                                    <>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                ) : (
                                    'Edit Profile'
                                )}
                            </Button>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column - Stats */}
                    <div className="space-y-8">
                        <Card title="Account Details" className="border-none shadow-xl shadow-gray-200/50">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 group">
                                    <div className="p-3 bg-orange-50 rounded-2xl group-hover:scale-110 transition-transform">
                                        <Calendar className="h-5 w-5 text-[#E4983A]" />
                                    </div>
                                    <div className="flex-1 border-b border-gray-50 pb-2">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Member Since</p>
                                        <p className="text-sm font-bold text-gray-800">
                                            {formData.JoinedDate ? format(new Date(formData.JoinedDate), 'MMMM d, yyyy') : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="p-3 bg-rose-50 rounded-2xl group-hover:scale-110 transition-transform">
                                        <MapPin className="h-5 w-5 text-rose-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Primary Location</p>
                                        <p className="text-sm font-bold text-gray-800 truncate">{formData.address || 'Location not set'}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:bg-white/10 transition-colors"></div>
                            <h4 className="font-black text-xl mb-1">Status</h4>
                            <p className="text-gray-400 text-sm font-medium mb-4">Your account is currently active and verified.</p>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-green-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                Verified Admin
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="md:col-span-2 space-y-8">
                        <Card title="Personal Information" className="border-none shadow-xl shadow-gray-200/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <Input
                                    label="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={!isEditing}
                                    icon={<User className="h-4 w-4" />}
                                    className={isEditing ? 'border-[#E4983A]/20 focus:border-[#E4983A]' : ''}
                                />
                                <Input
                                    label="Role"
                                    value={formData.Role}
                                    disabled
                                    className="bg-gray-50/50 border-gray-100 italic"
                                />
                                <Input
                                    label="Email Address"
                                    type="email"
                                    value={formData.Email}
                                    disabled
                                    className="bg-gray-50/50 border-gray-100"
                                    icon={<Mail className="h-4 w-4" />}
                                />
                                <Input
                                    label="Phone Number"
                                    type="tel"
                                    value={formData.PhoneNumber}
                                    onChange={(e) => setFormData({ ...formData, PhoneNumber: e.target.value })}
                                    disabled={!isEditing}
                                    icon={<Phone className="h-4 w-4" />}
                                    className={isEditing ? 'border-[#E4983A]/20 focus:border-[#E4983A]' : ''}
                                />
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Professional Bio</label>
                                    <textarea
                                        value={formData.Boi}
                                        onChange={(e) => setFormData({ ...formData, Boi: e.target.value })}
                                        disabled={!isEditing}
                                        rows={4}
                                        className={`w-full rounded-[1.5rem] border-2 px-5 py-4 font-bold text-sm outline-none transition-all resize-none ${isEditing ? 'border-gray-100 bg-white focus:border-[#E4983A] focus:ring-4 focus:ring-orange-50' : 'bg-gray-50/50 border-transparent text-gray-500'}`}
                                        placeholder="Briefly describe your role and background..."
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Input
                                        label="Office Address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        disabled={!isEditing}
                                        icon={<MapPin className="h-4 w-4" />}
                                        className={isEditing ? 'border-[#E4983A]/20 focus:border-[#E4983A]' : ''}
                                        placeholder="e.g. 123 Tech Lane, San Francisco, CA"
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
