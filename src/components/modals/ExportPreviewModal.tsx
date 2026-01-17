import { X, Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRef } from 'react';

interface ExportPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any[];
    title: string;
}

export function ExportPreviewModal({ isOpen, onClose, data, title }: ExportPreviewModalProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    const handleDownloadPDF = async () => {
        if (!contentRef.current) return;

        try {
            const canvas = await html2canvas(contentRef.current, {
                scale: 2,
                backgroundColor: '#ffffff',
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 10;

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(`${title.toLowerCase().replace(/\s+/g, '-')}-report.pdf`);

            onClose();
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#FF6B35] rounded-xl shadow-lg shadow-orange-500/20">
                            <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Export Report Preview</h2>
                            <p className="text-sm text-gray-500">Review before downloading</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Content Preview */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <div ref={contentRef} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
                            <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</p>
                        </div>

                        {/* Data Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        {Object.keys(data[0] || {}).map((key) => (
                                            <th key={key} className="text-left py-3 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row, idx) => (
                                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                            {Object.values(row).map((value: any, cellIdx) => (
                                                <td key={cellIdx} className="py-3 px-4 text-sm text-gray-600">
                                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                Total Records: <span className="font-bold text-gray-900">{data.length}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        className="px-6 py-3 rounded-xl font-bold text-white bg-[#FF6B35] hover:bg-[#E85A2D] shadow-lg shadow-orange-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
