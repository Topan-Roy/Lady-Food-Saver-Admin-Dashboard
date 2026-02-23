import { useState, useMemo, useRef, useEffect } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Upload, FileText, Trash2, Download, AlertCircle, Loader2, Check } from 'lucide-react';
import {
    useGetLegalDocumentsQuery,
    useDeleteLegalDocumentMutation,
    useCreateLegalDocumentMutation,
    useUpdateLegalDocumentStatusMutation
} from '@/redux/features/legal';
import { format } from 'date-fns';

export function LegalDocuments() {
    const [currentPage, setCurrentPage] = useState(1);
    const { data: legalResponse, isLoading, error: fetchError } = useGetLegalDocumentsQuery({ page: currentPage, limit: 10 });
    const [deleteLegalDocument, { isLoading: isDeleting }] = useDeleteLegalDocumentMutation();
    const [createLegalDocument, { isLoading: isCreating }] = useCreateLegalDocumentMutation();
    const [updateLegalDocumentStatus, { isLoading: isUpdatingStatus }] = useUpdateLegalDocumentStatusMutation();

    // Modal States
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<any>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Form States
    const [uploadName, setUploadName] = useState('');
    const [uploadStatus, setUploadStatus] = useState('Active');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Debugging: Log any errors
    useEffect(() => {
        if (fetchError) {
            console.error("LegalDocuments Fetch Error:", fetchError);
        }
    }, [fetchError]);

    const documents = useMemo(() => {
        // According to user provided structure: response.data.documents
        const docsArray = legalResponse?.data?.documents || legalResponse?.data || [];

        if (!Array.isArray(docsArray)) {
            console.warn("LegalDocuments: unexpected data format", legalResponse);
            return [];
        }

        return docsArray.map((doc: any) => {
            // Safer date parsing
            let formattedDate = 'N/A';
            try {
                // User provided 'LastUpdated'
                const dateStr = doc.LastUpdated || doc.uplodeDate || doc.createdAt || doc.updatedAt;
                if (dateStr) {
                    const dateObj = new Date(dateStr);
                    if (!isNaN(dateObj.getTime())) {
                        formattedDate = format(dateObj, 'MMM dd, yyyy');
                    }
                }
            } catch (e) {
                console.error("Error formatting date for doc", doc.id, e);
            }

            return {
                id: doc.id || doc._id || Math.random().toString(),
                name: doc.DocumentName || 'Untitled Document',
                type: doc.Type || 'FILE',
                size: doc.Size || doc.Siye || '0 KB',
                uploadedDate: formattedDate,
                status: doc.Status || 'Active',
                url: doc.fileUrl || ''
            };
        });
    }, [legalResponse]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            if (!uploadName) {
                setUploadName(file.name.replace(/\.[^/.]+$/, ""));
            }
        }
    };

    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !uploadName) return;

        const sizeInMb = (selectedFile.size / (1024 * 1024)).toFixed(1);

        try {
            await createLegalDocument({
                DocumentName: uploadName,
                Type: selectedFile.name.split('.').pop()?.toUpperCase() || 'FILE',
                Siye: `${sizeInMb} MB`,
                fileUrl: "https://res.cloudinary.com/demo/image/upload/v1/legal/sample.pdf",
                Status: uploadStatus
            }).unwrap();

            setIsUploadModalOpen(false);
            setUploadName('');
            setSelectedFile(null);
            alert("Document uploaded successfully");
        } catch (error) {
            console.error("Failed to upload document:", error);
            alert("Failed to upload document. Please check the console for details.");
        }
    };

    const openDeleteModal = (item: any) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await deleteLegalDocument(itemToDelete.id).unwrap();
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error) {
            console.error("Failed to delete document:", error);
            alert("Failed to delete document");
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await updateLegalDocumentStatus({ id, Status: newStatus }).unwrap();
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update status");
        }
    };

    const handleDownload = (url: string, name: string) => {
        if (!url) {
            alert("Download link is not available");
            return;
        }
        try {
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name);
            link.setAttribute('target', '_blank');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error("Download failed:", e);
            window.open(url, '_blank');
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-10 w-10 text-[#E4983A] animate-spin" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Legal Documents</h1>
                        <p className="text-gray-500">Manage company legal documents and policies</p>
                    </div>
                    {/* <Button leftIcon={<Upload className="h-4 w-4" />} onClick={() => setIsUploadModalOpen(true)}>
                        Upload Document
                    </Button> */}
                </div>

                {fetchError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                        <AlertCircle className="h-5 w-5" />
                        <p>Error loading documents: {(fetchError as any).data?.message || 'Unauthorized or server error'}</p>
                    </div>
                )}

                <Modal
                    isOpen={isUploadModalOpen}
                    onClose={() => !isCreating && setIsUploadModalOpen(false)}
                    title="Upload New Document"
                >
                    <form onSubmit={handleUploadSubmit} className="space-y-6">
                        <div
                            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${selectedFile ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-[#E4983A] hover:bg-orange-50'}`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                            />
                            {selectedFile ? (
                                <>
                                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                                        <Check className="h-6 w-6 text-green-600" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </>
                            ) : (
                                <>
                                    <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mb-3 text-[#E4983A]">
                                        <Upload className="h-6 w-6" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">Click to browse or drag and drop</p>
                                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
                                </>
                            )}
                        </div>

                        <div className="space-y-4">
                            <Input
                                label="Document Name"
                                value={uploadName}
                                onChange={(e) => setUploadName(e.target.value)}
                                placeholder="e.g., Privacy Policy 2024"
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    className="block w-full h-11 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#E4983A] focus:ring-[#E4983A] sm:text-sm transition-all outline-none px-4"
                                    value={uploadStatus}
                                    onChange={(e) => setUploadStatus(e.target.value)}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Draft">Draft</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t">
                            <Button variant="outline" className="flex-1" type="button" onClick={() => setIsUploadModalOpen(false)} disabled={isCreating}>
                                Cancel
                            </Button>
                            <Button className="flex-1" type="submit" disabled={isCreating || !selectedFile} leftIcon={isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}>
                                {isCreating ? 'Uploading...' : 'Upload Document'}
                            </Button>
                        </div>
                    </form>
                </Modal>

                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
                    title="Remove Document"
                    size="sm"
                >
                    <div className="space-y-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center">
                                <AlertCircle className="h-8 w-8 text-red-600" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900">Are you sure?</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    This action will permanently remove <span className="font-bold text-gray-900">{itemToDelete?.name}</span>. This cannot be undone.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
                                Cancel
                            </Button>
                            <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl" onClick={handleConfirmDelete} leftIcon={isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} disabled={isDeleting}>
                                {isDeleting ? 'Removing...' : 'Remove'}
                            </Button>
                        </div>
                    </div>
                </Modal>

                <Card>
                    <Table
                        data={documents}
                        currentPage={currentPage}
                        totalPages={legalResponse?.data?.meta?.totalPages || 1}
                        totalResults={legalResponse?.data?.meta?.total || 0}
                        onPageChange={(page) => setCurrentPage(page)}
                        columns={[
                            {
                                header: 'Document Name',
                                cell: (item: any) => (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <span className="font-medium text-gray-900">{item.name}</span>
                                    </div>
                                )
                            },
                            { header: 'Type', accessorKey: 'type' },
                            { header: 'Size', accessorKey: 'size' },
                            { header: 'Last Updated', accessorKey: 'uploadedDate' },
                            {
                                header: 'Status',
                                cell: (item: any) => (
                                    <select
                                        value={item.status}
                                        onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border-2 border-transparent transition-all cursor-pointer hover:border-gray-300 focus:border-[#E4983A] outline-none shadow-sm ${item.status === 'Active'
                                            ? 'bg-green-50 text-green-700'
                                            : item.status === 'Draft'
                                                ? 'bg-orange-50 text-orange-700'
                                                : 'bg-red-50 text-red-700'
                                            }`}
                                        disabled={isUpdatingStatus}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Draft">Draft</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                )
                            },
                            {
                                header: 'Actions',
                                cell: (item: any) => (
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="ghost" className="text-gray-500 hover:text-blue-600" onClick={() => handleDownload(item.url, item.name)}>
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="ghost" className="text-gray-500 hover:text-red-600" onClick={() => openDeleteModal(item)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )
                            }
                        ]}
                    />
                </Card>
            </div>
        </AdminLayout>
    );
}
