// Utility functions for parsing Excel files and converting to text format for AI analysis
import * as XLSX from 'xlsx';

export interface ExcelData {
  fileName: string;
  sheets: SheetData[];
  totalRows: number;
  totalColumns: number;
  fileSize: number;
}

export interface SheetData {
  name: string;
  data: string[][];
  rows: number;
  columns: number;
}

export function parseExcelToText(file: File): Promise<ExcelData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('Failed to read file'));
          return;
        }

        // Parse Excel file using xlsx library
        const workbook = XLSX.read(data, { type: 'array' });
        const excelData = parseWorkbook(workbook, file);
        resolve(excelData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    // Read as ArrayBuffer for xlsx library
    reader.readAsArrayBuffer(file);
  });
}

function parseWorkbook(workbook: XLSX.WorkBook, file: File): ExcelData {
  const sheets: SheetData[] = [];
  let totalRows = 0;
  let totalColumns = 0;

  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    
    // Convert to string array
    const data = jsonData.map((row: any) => 
      Array.isArray(row) ? row.map(cell => String(cell || '')) : [String(row || '')]
    );

    // Remove empty rows at the end
    while (data.length > 0 && data[data.length - 1].every(cell => cell === '')) {
      data.pop();
    }

    if (data.length > 0) {
      const rows = data.length;
      const columns = Math.max(...data.map(row => row.length));
      
      sheets.push({
        name: sheetName,
        data: data,
        rows,
        columns
      });

      totalRows += rows;
      totalColumns = Math.max(totalColumns, columns);
    }
  });

  return {
    fileName: file.name,
    sheets,
    totalRows,
    totalColumns,
    fileSize: file.size
  };
}


export function formatExcelDataForAI(excelData: ExcelData): string {
  let formattedText = `EXCEL FILE ANALYSIS: ${excelData.fileName}\n`;
  formattedText += `File Size: ${(excelData.fileSize / 1024).toFixed(2)} KB\n`;
  formattedText += `Total Sheets: ${excelData.sheets.length}\n`;
  formattedText += `Total Rows: ${excelData.totalRows}\n`;
  formattedText += `Total Columns: ${excelData.totalColumns}\n\n`;

  excelData.sheets.forEach((sheet, index) => {
    formattedText += `=== SHEET ${index + 1}: ${sheet.name} ===\n`;
    formattedText += `Dimensions: ${sheet.rows} rows × ${sheet.columns} columns\n\n`;
    
    // Add the data in a readable format
    sheet.data.forEach((row, rowIndex) => {
      if (rowIndex === 0) {
        // Header row
        formattedText += `Headers: ${row.join(' | ')}\n`;
        formattedText += `${'='.repeat(row.join(' | ').length)}\n`;
      } else {
        // Data rows
        formattedText += `Row ${rowIndex}: ${row.join(' | ')}\n`;
      }
    });
    
    formattedText += '\n';
  });

  return formattedText;
}

export function extractDataInsights(excelData: ExcelData): string[] {
  const insights: string[] = [];
  
  excelData.sheets.forEach(sheet => {
    if (sheet.data.length > 1) {
      const headers = sheet.data[0];
      const dataRows = sheet.data.slice(1);
      
      // Basic insights
      insights.push(`Sheet "${sheet.name}" contains ${dataRows.length} data records`);
      
      // Look for numeric columns
      const numericColumns = headers.map((header, index) => {
        const columnData = dataRows.map(row => row[index]).filter(cell => !isNaN(Number(cell)));
        return { header, index, count: columnData.length };
      }).filter(col => col.count > 0);
      
      if (numericColumns.length > 0) {
        insights.push(`Numeric columns found: ${numericColumns.map(col => col.header).join(', ')}`);
      }
      
      // Look for date columns
      const dateColumns = headers.map((header, index) => {
        const columnData = dataRows.map(row => row[index]);
        const hasDates = columnData.some(cell => 
          cell.includes('/') || cell.includes('-') || cell.includes('2024') || cell.includes('2023')
        );
        return { header, index, hasDates };
      }).filter(col => col.hasDates);
      
      if (dateColumns.length > 0) {
        insights.push(`Date columns found: ${dateColumns.map(col => col.header).join(', ')}`);
      }
    }
  });
  
  return insights;
}
