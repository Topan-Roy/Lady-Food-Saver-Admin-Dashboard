import { X, Download, Receipt } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRef } from 'react';
import { getAppLogo } from '../../utils/logo';

interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderData: {
        id: string;
        customer: string;
        restaurant: string;
        date: string;
        items: Array<{ name: string; quantity: number; price: number }>;
        subtotal: number;
        tax: number;
        total: number;
    };
}

export function InvoiceModal({ isOpen, onClose, orderData }: InvoiceModalProps) {
    const invoiceRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    const handleDownloadPDF = async () => {
        if (!invoiceRef.current) return;

        try {
            const canvas = await html2canvas(invoiceRef.current, {
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
            pdf.save(`invoice-${orderData.id}.pdf`);

            onClose();
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#E4983A] rounded-xl shadow-lg shadow-orange-500/20">
                            <Receipt className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Order Invoice</h2>
                            <p className="text-sm text-gray-500">Invoice #{orderData.id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Invoice Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <div ref={invoiceRef} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
                        {/* Restaurant Header */}
                        <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-gray-200">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 mb-2 transform transition-transform hover:rotate-6 duration-300">
                                        <img src={getAppLogo()} alt="DineFive" className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">DineFive</h1>
                                        <p className="text-sm text-gray-500">Premium Meal Solutions</p>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p className="font-semibold">{orderData.restaurant}</p>
                                    <p>123 Restaurant Street</p>
                                    <p>City, State 12345</p>
                                    <p>contact@dinefive.com</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <h2 className="text-3xl font-bold text-[#E4983A] mb-2">INVOICE</h2>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p><span className="font-semibold">Invoice #:</span> {orderData.id}</p>
                                    <p><span className="font-semibold">Date:</span> {orderData.date}</p>
                                    <p><span className="font-semibold">Status:</span> <span className="text-green-600 font-bold">Paid</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Bill To */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To</h3>
                            <p className="text-lg font-bold text-gray-900">{orderData.customer}</p>
                        </div>

                        {/* Items Table */}
                        <div className="mb-8">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-3 text-sm font-bold text-gray-700 uppercase tracking-wider">Item</th>
                                        <th className="text-center py-3 text-sm font-bold text-gray-700 uppercase tracking-wider">Qty</th>
                                        <th className="text-right py-3 text-sm font-bold text-gray-700 uppercase tracking-wider">Price</th>
                                        <th className="text-right py-3 text-sm font-bold text-gray-700 uppercase tracking-wider">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderData.items.map((item, idx) => (
                                        <tr key={idx} className="border-b border-gray-100">
                                            <td className="py-4 text-gray-900">{item.name}</td>
                                            <td className="py-4 text-center text-gray-600">{item.quantity}</td>
                                            <td className="py-4 text-right text-gray-600">${item.price.toFixed(2)}</td>
                                            <td className="py-4 text-right font-semibold text-gray-900">${(item.quantity * item.price).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="flex justify-end mb-8">
                            <div className="w-64 space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal:</span>
                                    <span className="font-semibold">${orderData.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (10%):</span>
                                    <span className="font-semibold">${orderData.tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t-2 border-gray-200">
                                    <span>Total:</span>
                                    <span className="text-[#E4983A]">${orderData.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Note */}
                        <div className="pt-6 border-t border-gray-200 text-center">
                            <p className="text-sm text-gray-500">
                                Thank you for choosing DineFive! ðŸ±
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                This invoice was generated electronically and is valid without signature.
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
                        className="px-6 py-3 rounded-xl font-bold text-white bg-[#E4983A] hover:bg-[#E85A2D] shadow-lg shadow-orange-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Download Invoice
                    </button>
                </div>
            </div>
        </div>
    );
}
