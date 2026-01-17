import { useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Upload, FileText, Trash2, Download } from 'lucide-react';

interface LegalDoc {
    id: number;
    name: string;
    type: string;
    size: string;
    lastUpdated: string;
    status: string;
}

export function LegalDocuments() {
    const [documents, setDocuments] = useState<LegalDoc[]>([
        { id: 1, name: 'Privacy Policy', type: 'PDF', size: '2.4 MB', lastUpdated: 'Oct 24, 2023', status: 'Active' },
        { id: 2, name: 'Terms & Conditions', type: 'PDF', size: '1.8 MB', lastUpdated: 'Sep 15, 2023', status: 'Active' },
        { id: 3, name: 'Merchant Agreement', type: 'DOCX', size: '3.1 MB', lastUpdated: 'Aug 01, 2023', status: 'Draft' }
    ]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const newDoc = {
                id: Date.now(),
                name: file.name,
                type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
                size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                lastUpdated: 'Just now',
                status: 'Draft'
            };
            setDocuments([newDoc, ...documents]);
        }
    };

    const triggerUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = (e: any) => handleFileChange(e);
        input.click();
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this document?")) {
            setDocuments(documents.filter(d => d.id !== id));
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Legal Documents</h1>
                        <p className="text-gray-500">Manage company legal documents and policies</p>
                    </div>
                    <Button leftIcon={<Upload className="h-4 w-4" />} onClick={triggerUpload}>
                        Upload Document
                    </Button>
                </div>

                <Card>
                    <Table
                        data={documents}
                        columns={[
                            {
                                header: 'Document Name',
                                cell: (item) => (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <span className="font-medium text-gray-900">{item.name}</span>
                                    </div>
                                )
                            },
                            {
                                header: 'Type',
                                accessorKey: 'type'
                            },
                            {
                                header: 'Size',
                                accessorKey: 'size'
                            },
                            {
                                header: 'Last Updated',
                                accessorKey: 'lastUpdated'
                            },
                            {
                                header: 'Status',
                                cell: (item) => (
                                    <Badge variant={item.status === 'Active' ? 'success' : 'default'}>
                                        {item.status}
                                    </Badge>
                                )
                            },
                            {
                                header: 'Actions',
                                cell: (item) => (
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="ghost" className="text-gray-500 hover:text-blue-600">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="ghost" className="text-gray-500 hover:text-red-600" onClick={() => handleDelete(item.id)}>
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
