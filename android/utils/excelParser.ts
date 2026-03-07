import * as XLSX from 'xlsx';
import { Dividend, OpenPosition } from '../types';

export const processClosedPositions = async (base64Data: string): Promise<number> => {
  const workbook = XLSX.read(base64Data, { type: 'base64' });
  const sheetName = 'CLOSED POSITION HISTORY';
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) return 0;

  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
  const headerRow = jsonData.find((row) => row.includes('Gross P/L'));
  if (!headerRow) return 0;

  const grossIndex = headerRow.indexOf('Gross P/L');

  return jsonData.reduce((sum, row) => {
    const isDataRow = typeof row[0] === 'number';
    const value = parseFloat(row[grossIndex]);
    return isDataRow && !isNaN(value) ? sum + value : sum;
  }, 0);
};

export const processDividendsFromExcel = async (base64Data: string): Promise<Dividend[]> => {
  const workbook = XLSX.read(base64Data, { type: 'base64' });
  const sheetName = workbook.SheetNames.find((n) =>
    n.toUpperCase().includes('CASH OPERATION HISTORY')
  );
  if (!sheetName) return [];

  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
  const headerRowIndex = rows.findIndex((row) => row.includes('Symbol') && row.includes('Amount'));

  if (headerRowIndex === -1) return [];

  const header = rows[headerRowIndex];
  return rows
    .slice(headerRowIndex + 1)
    .map((row) => {
      const obj: any = {};
      header.forEach((key: string, i: number) => (obj[key] = row[i]));
      return obj;
    })
    .filter((row) =>
      String(row['Type'] || '')
        .toUpperCase()
        .includes('DIVIDEND')
    )
    .map((row) => ({
      id: Math.random().toString(36).substr(2, 9),
      symbol: String(row['Symbol'] || 'Cash').replace(/\.(PL|UK|US)$/, ''),
      amountPerShare: 0,
      totalAmount: Math.abs(parseFloat(row['Amount'] || 0)),
      yieldPercentage: 0,
      payDate: formatExcelDate(row['Time']),
      status: 'received' as const,
    }));
};

const formatExcelDate = (rawDate: any): string => {
  if (typeof rawDate === 'number') {
    const date = new Date((rawDate - 25569) * 86400 * 1000);
    return date.toISOString().split('T')[0];
  }
  return new Date().toISOString().split('T')[0];
};

export const formatCurrency = (value: number | string | undefined | null): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (num === null || num === undefined || isNaN(num)) return '0,00';
  return num.toFixed(2).replace('.', ',');
};

const excelDateToJS = (excelDate: any): Date => {
  if (excelDate instanceof Date) return excelDate;
  const dateNum = parseFloat(excelDate);
  if (isNaN(dateNum)) return new Date();
  return new Date((dateNum - 25569) * 86400 * 1000);
};

export const processOpenPositions = async (base64Data: string): Promise<OpenPosition[]> => {
  const workbook = XLSX.read(base64Data, { type: 'base64', cellDates: true });

  const sheetName =
    workbook.SheetNames.find((n) => n.includes('OPEN POSITION')) || workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json<any>(worksheet, { range: 10 });

  const grouped = rawData.reduce(
    (acc, row) => {
      const symbol = row['Symbol'];
      if (!symbol || row['Position'] === 'Total') return acc;

      const rowDate = excelDateToJS(row['Open time']);
      const volume = parseFloat(row['Volume'] || 0);
      const purchaseValue = parseFloat(row['Purchase value'] || 0);
      const profit = parseFloat(row['Gross P/L'] || 0);
      const currentValue = purchaseValue + profit;

      if (!acc[symbol]) {
        acc[symbol] = {
          symbol,
          volume: 0,
          purchaseValue: 0,
          currentValue: 0,
          profit: 0,
          avgPurchasePrice: 0,
          currentPrice: 0,
          openTime: rowDate,
        };
      } else if (rowDate < acc[symbol].openTime) {
        acc[symbol].openTime = rowDate;
      }

      acc[symbol].volume += volume;
      acc[symbol].purchaseValue += purchaseValue;
      acc[symbol].profit += profit;
      acc[symbol].currentValue += currentValue;

      if (acc[symbol].volume > 0) {
        acc[symbol].avgPurchasePrice = acc[symbol].purchaseValue / acc[symbol].volume;
        acc[symbol].currentPrice = acc[symbol].currentValue / acc[symbol].volume;
      }

      return acc;
    },
    {} as Record<string, OpenPosition>
  );

  return (Object.values(grouped) as OpenPosition[]).sort(
    (a, b) => b.purchaseValue - a.purchaseValue
  );
};
