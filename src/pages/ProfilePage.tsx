import { useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { User, Mail, Phone, MapPin, Calendar, Camera } from 'lucide-react';

export function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState({
        name: 'Orlando Laurentius',
        role: 'Super Admin',
        email: 'orlando@foodsaver.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, USA',
        bio: 'Passionate about food sustainability and connecting restaurants with customers.',
        joinDate: 'September 2021',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    });

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-500">Manage your account settings and preferences.</p>
                </div>

                {/* Profile Header Card */}
                <Card className="relative overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-orange-400 to-rose-400 -m-6 mb-12"></div>
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 relative px-2">
                        <div className="relative group">
                            <Avatar
                                src={user.avatar}
                                fallback="OL"
                                className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl ring-1 ring-gray-100"
                            />
                            <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-gray-400 hover:text-[#FF6B35] transition-colors">
                                <Camera className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="flex-1 text-center md:text-left mb-2">
                            <h2 className="text-2xl font-black text-gray-900">{user.name}</h2>
                            <p className="text-gray-500 font-medium">{user.role}</p>
                        </div>
                        <div className="mb-2">
                            <Button
                                variant={isEditing ? 'primary' : 'outline'}
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? 'Save Changes' : 'Edit Profile'}
                            </Button>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column - Stats */}
                    <div className="space-y-8">
                        <Card title="Account Info">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-400 font-bold uppercase">Joined</p>
                                        <p className="text-sm font-semibold">{user.joinDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-400 font-bold uppercase">Location</p>
                                        <p className="text-sm font-semibold">{user.location}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column - Form */}
                    <div className="md:col-span-2 space-y-8">
                        <Card title="Personal Information">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Full Name"
                                    value={user.name}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                    disabled={!isEditing}
                                    icon={<User className="h-4 w-4" />}
                                />
                                <Input
                                    label="Role"
                                    value={user.role}
                                    disabled
                                    className="bg-gray-50"
                                />
                                <Input
                                    label="Email Address"
                                    type="email"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    disabled={!isEditing}
                                    icon={<Mail className="h-4 w-4" />}
                                />
                                <Input
                                    label="Phone Number"
                                    type="tel"
                                    value={user.phone}
                                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                    disabled={!isEditing}
                                    icon={<Phone className="h-4 w-4" />}
                                />
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Bio</label>
                                    <textarea
                                        value={user.bio}
                                        onChange={(e) => setUser({ ...user, bio: e.target.value })}
                                        disabled={!isEditing}
                                        rows={4}
                                        className={`w-full rounded-2xl border-2 px-4 py-3 font-medium outline-none transition-all ${isEditing ? 'border-gray-100 focus:border-[#FF6B35]' : 'bg-gray-50 border-transparent text-gray-500'}`}
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
