import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Customer, Transaction } from './types';

const SHOP_NAME = 'Abdun Nur Grocery LLC';
const SHOP_PHONE = '+971 4 XXX XXXX';
const SHOP_ADDRESS = 'Deira, Dubai, UAE';

export function generateInvoicePDF(customer: Customer, transactions: Transaction[]): void {
  const doc = new jsPDF();
  const totalDebt = transactions.reduce((sum, t) => sum + t.total, 0);
  const now = new Date();
  const invoiceNo = `INV-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${customer.id.substring(0, 5).toUpperCase()}`;

  // Header background
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 42, 'F');

  // Shop name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(SHOP_NAME, 105, 16, { align: 'center' });

  // Shop details
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Phone: ${SHOP_PHONE}  |  Address: ${SHOP_ADDRESS}`, 105, 24, { align: 'center' });

  // Invoice title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 211, 238);
  doc.text('CREDIT INVOICE / STATEMENT', 105, 35, { align: 'center' });

  // Reset text color
  doc.setTextColor(30, 30, 30);

  // Customer info box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 48, 182, 28, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Customer Details:', 20, 57);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${customer.name}`, 20, 64);
  doc.text(`Phone: ${customer.phone}`, 90, 64);
  doc.text(`Address: ${customer.address}`, 20, 71);

  // Invoice info
  doc.setFont('helvetica', 'bold');
  doc.text(`Invoice No: ${invoiceNo}`, 130, 57);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${now.toLocaleDateString('en-GB')}`, 130, 64);
  doc.text(`Time: ${now.toLocaleTimeString('en-GB')}`, 130, 71);

  // Transactions table
  const tableBody: string[][] = [];
  let runningTotal = 0;

  transactions.forEach((t, idx) => {
    runningTotal += t.total;
    const itemsSummary = t.items.map((i) => `${i.name} x${i.quantity}`).join(', ');
    tableBody.push([
      (idx + 1).toString(),
      formatDate(t.date),
      itemsSummary,
      t.items.map((i) => i.total.toFixed(2)).join(', '),
      t.total.toFixed(2),
      runningTotal.toFixed(2),
    ]);
  });

  autoTable(doc, {
    startY: 82,
    head: [['#', 'Date', 'Items', 'Item Totals (AED)', 'Txn Total (AED)', 'Running Total (AED)']],
    body: tableBody,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'center', cellWidth: 25 },
      4: { halign: 'right', cellWidth: 28 },
      5: { halign: 'right', cellWidth: 30 },
    },
  });

  // Total box
  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(120, finalY, 76, 16, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL OUTSTANDING:', 125, finalY + 7);
  doc.text(`AED ${totalDebt.toFixed(2)}`, 192, finalY + 7, { align: 'right' });

  // Footer
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const pageHeight = doc.internal.pageSize.height;
  doc.text('This is a computer-generated document from Abdun Nur Grocery LLC Credit Management System.', 105, pageHeight - 15, { align: 'center' });
  doc.text(`Generated on: ${now.toLocaleString('en-GB')}`, 105, pageHeight - 10, { align: 'center' });

  doc.save(`Invoice_${customer.name.replace(/\s+/g, '_')}_${now.toISOString().split('T')[0]}.pdf`);
}

export function generateLegalNoticePDF(customer: Customer, transactions: Transaction[]): void {
  const doc = new jsPDF();
  const totalDebt = transactions.reduce((sum, t) => sum + t.total, 0);
  const now = new Date();
  const refNo = `LND-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${customer.id.substring(0, 5).toUpperCase()}`;

  // Header
  doc.setFillColor(127, 29, 29);
  doc.rect(0, 0, 210, 38, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('FORMAL NOTICE OF DEFAULT', 105, 16, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(SHOP_NAME, 105, 25, { align: 'center' });
  doc.text(`${SHOP_ADDRESS} | ${SHOP_PHONE}`, 105, 32, { align: 'center' });

  doc.setTextColor(30, 30, 30);

  let y = 48;

  // Reference
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Reference No: ${refNo}`, 20, y);
  doc.text(`Date: ${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`, 140, y);
  y += 12;

  // To
  doc.setFont('helvetica', 'bold');
  doc.text('TO:', 20, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${customer.name}`, 20, y);
  y += 5;
  doc.text(`Phone: ${customer.phone}`, 20, y);
  y += 5;
  doc.text(`Address: ${customer.address}`, 20, y);
  y += 12;

  // Subject
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Subject: Formal Demand for Payment of Outstanding Debt', 20, y);
  y += 10;

  doc.setDrawColor(127, 29, 29);
  doc.setLineWidth(0.5);
  doc.line(20, y, 190, y);
  y += 8;

  // Body
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  const bodyLines = [
    `Dear ${customer.name},`,
    '',
    `This is a formal notice that you owe a total outstanding amount of AED ${totalDebt.toFixed(2)} to ${SHOP_NAME}, located at ${SHOP_ADDRESS}.`,
    '',
    'The debt arises from credit purchases made at our establishment, details of which are as follows:',
  ];

  bodyLines.forEach((line) => {
    doc.text(line, 20, y);
    y += 6;
  });

  y += 4;

  // Transactions summary table
  const tableBody: string[][] = [];
  transactions.forEach((t, idx) => {
    const itemsSummary = t.items.map((i) => `${i.name} x${i.quantity}`).join(', ');
    tableBody.push([
      (idx + 1).toString(),
      formatDate(t.date),
      itemsSummary,
      `AED ${t.total.toFixed(2)}`,
    ]);
  });

  autoTable(doc, {
    startY: y,
    head: [['#', 'Date', 'Items Purchased on Credit', 'Amount (AED)']],
    body: tableBody,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: {
      fillColor: [127, 29, 29],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: { fillColor: [254, 242, 242] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'center', cellWidth: 28 },
      3: { halign: 'right', cellWidth: 30 },
    },
  });

  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // Total
  doc.setFillColor(127, 29, 29);
  doc.roundedRect(120, y, 70, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`TOTAL: AED ${totalDebt.toFixed(2)}`, 155, y + 8, { align: 'center' });
  y += 20;

  // Warning
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('DEMAND FOR PAYMENT:', 20, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  const warningLines = [
    `You are hereby required to pay the full outstanding amount of AED ${totalDebt.toFixed(2)} within `,
    'FOURTEEN (14) DAYS from the date of this notice.',
    '',
    'FAILURE TO PAY within the stipulated period will result in the following actions:',
    '',
    '1. Filing a formal complaint with the Dubai Police (Deira Police Station).',
    '2. Initiation of legal proceedings in the Dubai Courts for recovery of debt.',
    '3. Reporting the debt to relevant credit bureaus and financial institutions in the UAE.',
    '4. All legal costs and court fees will be borne by the defaulter.',
    '',
    'This notice serves as your final warning before legal action is taken.',
  ];

  warningLines.forEach((line) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, 20, y);
    y += 6;
  });

  y += 10;

  // Signature block
  doc.setFont('helvetica', 'bold');
  doc.text('For and on behalf of:', 20, y);
  y += 6;
  doc.text(SHOP_NAME, 20, y);
  y += 20;

  doc.line(20, y, 80, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.text('Authorized Signatory', 20, y);
  y += 5;
  doc.text(`Date: ${now.toLocaleDateString('en-GB')}`, 20, y);

  // Footer
  doc.setTextColor(127, 29, 29);
  doc.setFontSize(7);
  const pageHeight = doc.internal.pageSize.height;
  doc.text('CONFIDENTIAL - This document is intended for the named recipient only and may contain privileged information.', 105, pageHeight - 10, { align: 'center' });

  doc.save(`LegalNotice_${customer.name.replace(/\s+/g, '_')}_${now.toISOString().split('T')[0]}.pdf`);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
