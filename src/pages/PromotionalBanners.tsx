import { useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Eye, Trash2, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { UploadBannerModal } from '../components/modals/UploadBannerModal';

const mockBanners = [
    {
        id: '1',
        image: 'https://images.unsplash.com/photo-1555503460-b239009abc2e?w=200&h=100&fit=crop',
        title: 'Summer Sale',
        status: 'Active',
        duration: '2024-06-01 - 2024-08-31',
    },
    {
        id: '2',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=100&fit=crop',
        title: 'New User Promo',
        status: 'Active',
        duration: '2024-01-01 - 2024-12-31',
    },
    {
        id: '3',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=100&fit=crop',
        title: 'Holiday Special',
        status: 'Inactive',
        duration: '2023-12-01 - 2023-12-31',
    },
];

export function PromotionalBanners() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const filteredBanners = mockBanners.filter((banner) =>
        banner.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                            Promotional Banners
                        </h1>
                        <p className="text-gray-500 mt-1 font-medium text-[15px]">
                            Manage app banners and promotions
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsUploadModalOpen(true)}
                        leftIcon={<Upload className="h-4 w-4" />}
                        className="bg-[#E4983A] hover:bg-[#E4983A] text-white px-6 py-3 rounded-2xl shadow-lg shadow-orange-500/20 transform hover:scale-105 transition-all font-bold"
                    >
                        Upload Banner
                    </Button>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center">
                    <div className="w-full relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-gray-50 rounded-lg group-focus-within:bg-[#FF6B35] transition-colors">
                            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-white transition-colors" />
                        </div>
                        <Input
                            placeholder="Search banners..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="!pl-16 bg-gray-50 border-transparent rounded-2xl px-4 py-4 font-medium focus:bg-white focus:ring-4 focus:ring-[#FF6B35]/10 focus:border-[#FF6B35] outline-none transition-all hover:bg-white hover:border-gray-200 shadow-none text-lg"
                        />
                    </div>
                </div>

                {/* Banners Table */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                    <Table
                        data={filteredBanners}
                        columns={[
                            {
                                header: 'BANNER',
                                cell: (item: any) => (
                                    <div className="w-32 h-16 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ),
                            },
                            {
                                header: 'TITLE',
                                accessorKey: 'title',
                                className: 'font-bold text-gray-900 text-lg',
                            },
                            {
                                header: 'STATUS',
                                cell: (item: any) => (
                                    <Badge
                                        variant={item.status === 'Active' ? 'success' : 'default'}
                                        className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider"
                                    >
                                        {item.status}
                                    </Badge>
                                ),
                            },
                            {
                                header: 'DURATION',
                                accessorKey: 'duration',
                                className: 'text-gray-500 font-medium whitespace-nowrap',
                            },
                            {
                                header: 'ACTIONS',
                                cell: (_item: any) => (
                                    <div className="flex gap-3">
                                        <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-[#FF6B35]/10 hover:text-[#FF6B35] transition-all">
                                            <Eye className="h-5 w-5" />
                                        </button>
                                        <button className="p-2.5 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-red-500/20">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                ),
                            },
                        ]}
                    />

                </div>
            </div>

            <UploadBannerModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
            />
        </AdminLayout>
    );
}
