import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { MaterialItem, CostBreakdown, HumanIntervention, ProjectDetails } from '@/types/cost-estimation';
import { UserOptions } from 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => void;
    lastAutoTable: { finalY: number };
    internal: {
      pageSize: { width: number; height: number; getWidth: () => number; getHeight: () => number };
      getNumberOfPages: () => number;
    };
  }
}

export const exportToPDF = (
  materialItems: MaterialItem[],
  costBreakdowns: CostBreakdown[],
  humanIntervention: HumanIntervention,
  projectDetails: ProjectDetails
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Add title with company logo styling
  doc.setFontSize(24);
  doc.setTextColor(44, 62, 80);
  doc.text('Cost Estimation Quotation', pageWidth / 2, 20, { align: 'center' });

  // Add project details with improved styling
  doc.setFontSize(14);
  doc.setTextColor(52, 73, 94);
  doc.text('Project Details', 14, 35);
  const projectInfo = [
    ['Customer Name', projectDetails.customerName || '—'],
    ['Customer ID', projectDetails.customerId || '—'],
    ['Project Name', projectDetails.projectName || '—'],
    ['Project ID', projectDetails.projectId || '—'],
    ['Location', projectDetails.location || '—'],
    ['Firm Price', projectDetails.firmPrice ? 'Yes' : 'No'],
  ];
  doc.autoTable({
    startY: 40,
    head: [],
    body: projectInfo,
    theme: 'grid',
    styles: { 
      fontSize: 10,
      cellPadding: 5,
      textColor: [44, 62, 80]
    },
    columnStyles: { 
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 'auto' }
    },
    margin: { left: 14 },
    tableWidth: 'auto'
  });

  // Add estimation summary with improved layout
  doc.setFontSize(14);
  doc.text('Estimation Summary', 14, doc.lastAutoTable.finalY + 15);
  const totalQuantity = materialItems.reduce((a, c) => a + (c.quantity || 0), 0);
  const totalWeight = materialItems.reduce((a, c) => a + ((c.unitWeight || 0) * (c.quantity || 0)), 0);
  const summaryInfo = [
    ['Total Items', materialItems.length.toString()],
    ['Estimation Date', new Date().toLocaleDateString('en-GB')],
    ['Total Quantity', `${totalQuantity.toLocaleString()} pieces`],
    ['Total Weight', `${totalWeight.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg`],
  ];
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    head: [],
    body: summaryInfo,
    theme: 'grid',
    styles: { 
      fontSize: 10,
      cellPadding: 5,
      textColor: [44, 62, 80]
    },
    columnStyles: { 
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 'auto' }
    },
    margin: { left: 14 },
    tableWidth: 'auto'
  });

  // Add quotation details table with improved formatting
  doc.setFontSize(14);
  doc.text('Quotation Details', 14, doc.lastAutoTable.finalY + 15);
  const tableHeaders = [
    ['Part No.', 'Description', 'Weight (kg)', 'Qty', 'L1 (₹/kg)', 'L2 (₹/kg)', 'L3 (₹/kg)', 'L4 (₹/kg)', 'L5 (₹/kg)', 'Total (₹/pc)', 'Freight (₹/kg)'],
  ];
  const tableData = materialItems.map((item, idx) => [
    String(item.itemPartNumber || item.itemNumber),
    item.itemDescription,
    item.unitWeight.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    item.quantity.toLocaleString(),
    (costBreakdowns[idx]?.l1CostPerKg ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    (costBreakdowns[idx]?.l2CostPerKg ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    (costBreakdowns[idx]?.l3CostPerKg ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    (costBreakdowns[idx]?.l4CostPerKg ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    (costBreakdowns[idx]?.l5CostPerKg ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    (costBreakdowns[idx]?.l5CostPerPiece ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    (humanIntervention.freightPerKg ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  ]);

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    head: tableHeaders,
    body: tableData,
    theme: 'grid',
    styles: { 
      fontSize: 8,
      cellPadding: 3,
      textColor: [44, 62, 80],
      halign: 'center'
    },
    headStyles: { 
      fillColor: [46, 204, 113],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 'auto', halign: 'left' },
      2: { cellWidth: 25 },
      3: { cellWidth: 20 },
      4: { cellWidth: 25 },
      5: { cellWidth: 25 },
      6: { cellWidth: 25 },
      7: { cellWidth: 25 },
      8: { cellWidth: 25 },
      9: { cellWidth: 25 },
      10: { cellWidth: 25 }
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Add page number at the bottom
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.text(`Page ${data.pageCount} of ${pageCount}`, pageWidth - 20, doc.internal.pageSize.height - 10, { align: 'right' });
    }
  });

  // Save the PDF with a formatted date in the filename
  const date = new Date().toISOString().split('T')[0];
  doc.save(`cost-estimation-quotation-${date}.pdf`);
};