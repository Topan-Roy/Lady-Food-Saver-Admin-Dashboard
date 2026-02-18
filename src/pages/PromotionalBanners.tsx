import { useState, useMemo } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Eye, Trash2, Upload } from 'lucide-react';
import { UploadBannerModal } from '../components/modals/UploadBannerModal';
import { BannerDetailModal } from '../components/modals/BannerDetailModal';
import { ConfirmationModal } from '../components/modals/ConfirmationModal';
import { useGetBannersQuery, useDeleteBannerMutation } from '../redux/features/banner';
import { format } from 'date-fns';

export function PromotionalBanners() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState<any>(null);

    // Live API Data
    const { data: bannersResponse, isLoading } = useGetBannersQuery({ status: 'ACTIVE', page: 1, limit: 100 });
    const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();
    const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);

    const bannersData = useMemo(() => {
        const rawBanners = bannersResponse?.banners || [];

        const safeFormat = (dateStr: string, formatStr: string) => {
            if (!dateStr) return '';
            try {
                let date: Date;
                // Handle DD-MM-YYYY format
                if (dateStr.includes('-') && dateStr.split('-')[0].length === 2) {
                    const [day, month, year] = dateStr.split('-').map(Number);
                    date = new Date(year, month - 1, day);
                } else {
                    date = new Date(dateStr);
                }

                if (isNaN(date.getTime())) return '';
                return format(date, formatStr);
            } catch {
                return '';
            }
        };

        return rawBanners.map((b: any) => {
            const start = safeFormat(b.startTime, 'MMM dd, yyyy');
            const end = safeFormat(b.endTime, 'MMM dd, yyyy');

            return {
                id: b._id || b.id,
                image: b.bannerImage,
                title: b.title || 'N/A',
                status: b.status || 'INACTIVE',
                startTime: b.startTime,
                endTime: b.endTime,
                duration: start && end ? `${start} - ${end}` : 'N/A'
            };
        });
    }, [bannersResponse]);

    const filteredBanners = useMemo(() => {
        return bannersData.filter((banner: any) =>
            banner.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [bannersData, searchTerm]);

    const handleDelete = (id: string) => {
        setBannerToDelete(id);
    };

    const handleConfirmDelete = async () => {
        if (!bannerToDelete) return;
        try {
            await deleteBanner(bannerToDelete).unwrap();
            setBannerToDelete(null);
        } catch (err) {
            console.error('Failed to delete banner:', err);
        }
    };

    const handleViewDetails = (banner: any) => {
        setSelectedBanner(banner);
        setIsDetailModalOpen(true);
    };

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
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-gray-50 rounded-lg group-focus-within:bg-[#E4983A] transition-colors">
                            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-white transition-colors" />
                        </div>
                        <Input
                            placeholder="Search banners..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="!pl-16 bg-gray-50 border-transparent rounded-2xl px-4 py-4 font-medium focus:bg-white focus:ring-4 focus:ring-[#E4983A]/10 focus:border-[#E4983A] outline-none transition-all hover:bg-white hover:border-gray-200 shadow-none text-lg"
                        />
                    </div>
                </div>

                {/* Banners Table */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center min-h-[400px] text-gray-500 font-medium">
                            <div className="animate-pulse">Loading banners...</div>
                        </div>
                    ) : (
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
                                            variant={item.status === 'ACTIVE' ? 'success' : 'default'}
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
                                    cell: (item: any) => (
                                        <div className="flex gap-3">
                                            <button
                                                className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-[#E4983A]/10 hover:text-[#E4983A] transition-all"
                                                onClick={() => handleViewDetails(item)}
                                            >
                                                <Eye className="h-5 w-5" />
                                            </button>
                                            <button
                                                className="p-2.5 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-red-500/20"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    )}
                </div>
            </div>

            <UploadBannerModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
            />

            <BannerDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                banner={selectedBanner}
            />

            <ConfirmationModal
                isOpen={!!bannerToDelete}
                onClose={() => setBannerToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Banner"
                message="Are you sure you want to delete this banner? This action cannot be undone."
                confirmText="Delete"
                variant="danger"
                isLoading={isDeleting}
            />
        </AdminLayout>
    );
}
