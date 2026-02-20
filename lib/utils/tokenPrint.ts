import jsPDF from 'jspdf';

interface TokenData {
    serialNumber: number;
    patientName: string;
    patientId: string;
    patientPhone: string;
    doctorName?: string;
    feeAmount: number;
    paymentStatus: string;
    bookingType: string;
    date: string;
}

export function generateToken(data: TokenData) {
    // Token slip: 80mm x 120mm (receipt size)
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 130],
    });

    const centerX = 40;
    let y = 10;

    // Header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('MediCore', centerX, y, { align: 'center' });
    y += 5;

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('Doctor Chamber Management', centerX, y, { align: 'center' });
    y += 6;

    // Divider
    doc.setDrawColor(200);
    doc.line(5, y, 75, y);
    y += 6;

    // Serial Number (large)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('SERIAL NUMBER', centerX, y, { align: 'center' });
    y += 10;

    doc.setFontSize(36);
    doc.text(`#${data.serialNumber}`, centerX, y, { align: 'center' });
    y += 10;

    // Divider
    doc.setDrawColor(200);
    doc.line(5, y, 75, y);
    y += 6;

    // Patient Info
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    const addRow = (label: string, value: string) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 8, y);
        doc.setFont('helvetica', 'normal');
        doc.text(value, 72, y, { align: 'right' });
        y += 5;
    };

    addRow('Patient:', data.patientName);
    addRow('ID:', data.patientId);
    addRow('Phone:', data.patientPhone);
    if (data.doctorName) {
        addRow('Doctor:', data.doctorName);
    }
    addRow('Type:', data.bookingType === 'walk-in' ? 'Walk-in' : 'Phone Booking');
    addRow('Fee:', `Tk ${data.feeAmount}`);
    addRow('Payment:', data.paymentStatus === 'paid' ? 'PAID' : 'PENDING');
    y += 2;

    // Divider
    doc.line(5, y, 75, y);
    y += 5;

    // Date & Time
    doc.setFontSize(7);
    doc.text(`Date: ${data.date}`, centerX, y, { align: 'center' });
    y += 4;
    doc.text(`Printed: ${new Date().toLocaleTimeString()}`, centerX, y, { align: 'center' });
    y += 6;

    // Footer
    doc.setFontSize(6);
    doc.setFont('helvetica', 'italic');
    doc.text('Please keep this token and arrive on time', centerX, y, { align: 'center' });

    // Open print dialog
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
}
