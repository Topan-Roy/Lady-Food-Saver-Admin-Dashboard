import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useUpdateBannerMutation } from '../../redux/features/banner';
import { format } from 'date-fns';

interface BannerDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    banner: any;
}

const safeFormat = (dateStr: string, formatStr: string) => {
    if (!dateStr) return 'N/A';
    try {
        let date: Date;
        // Handle DD-MM-YYYY format
        if (dateStr.includes('-') && dateStr.split('-')[0].length === 2) {
            const [day, month, year] = dateStr.split('-').map(Number);
            date = new Date(year, month - 1, day);
        } else {
            date = new Date(dateStr);
        }

        if (isNaN(date.getTime())) return 'N/A';
        return format(date, formatStr);
    } catch {
        return 'N/A';
    }
};

export function BannerDetailModal({ isOpen, onClose, banner }: BannerDetailModalProps) {
    const [updateBanner, { isLoading }] = useUpdateBannerMutation();
    const [currentStatus, setCurrentStatus] = useState(banner?.status);

    useEffect(() => {
        if (banner) {
            setCurrentStatus(banner.status);
        }
    }, [banner]);

    if (!banner) return null;

    const handleToggleStatus = async () => {
        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        try {
            await updateBanner({
                id: banner.id,
                data: { status: newStatus }
            }).unwrap();
            setCurrentStatus(newStatus);
            // Don't close modal, just update state
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Banner Details">
            <div className="space-y-6">
                <div className="w-full aspect-[2/1] rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Title</p>
                        <p className="text-lg font-bold text-gray-900">{banner.title}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Status</p>
                        <Badge
                            variant={currentStatus === 'ACTIVE' ? 'success' : 'default'}
                            className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider"
                        >
                            {currentStatus}
                        </Badge>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Start Date</p>
                        <p className="text-gray-900 font-bold">
                            {safeFormat(banner.startTime, 'MMM dd, yyyy')}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">End Date</p>
                        <p className="text-gray-900 font-bold">
                            {safeFormat(banner.endTime, 'MMM dd, yyyy')}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="px-8 rounded-2xl"
                    >
                        Close
                    </Button>
                    <Button
                        variant={currentStatus === 'ACTIVE' ? 'danger' : 'primary'}
                        onClick={handleToggleStatus}
                        disabled={isLoading}
                        className="px-8 rounded-2xl"
                    >
                        {isLoading ? 'Processing...' : (currentStatus === 'ACTIVE' ? 'Deactivate' : 'Activate')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
