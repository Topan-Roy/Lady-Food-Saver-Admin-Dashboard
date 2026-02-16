import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false
}: ConfirmationModalProps) {
    // Determine button styles based on variant
    const getButtonStyles = () => {
        switch (variant) {
            case 'danger':
                return 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20';
            case 'warning':
                return 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20';
            default:
                return 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-6">
                <p className="text-gray-600">{message}</p>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="px-6 rounded-2xl"
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className={`px-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 ${getButtonStyles()}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
