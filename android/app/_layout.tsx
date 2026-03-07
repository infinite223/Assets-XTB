import { useState } from 'react';
import { View } from 'react-native';
import { Slot } from 'expo-router';
import { usePortfolio } from '../hooks/usePortfolio';
import * as FileSystem from 'expo-file-system';
import {
  processOpenPositions,
  processClosedPositions,
  processDividendsFromExcel,
} from '../utils/excelParser';
import { UploadModal } from 'componenets/UploadModal';
import { BottomNav } from 'componenets/BottomNav';
import '../global.css';

export default function RootLayout() {
  const { addReport, addPlannedDividend } = usePortfolio();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingFileUri, setPendingFileUri] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const handleFileSelect = (fileUri: string) => {
    setPendingFileUri(fileUri);
    setIsModalOpen(true);
  };

  const handleUpload = async () => {
    if (!pendingFileUri) return;

    try {
      const base64Data = await FileSystem.readAsStringAsync(pendingFileUri, {
        encoding: 'base64',
      });

      const positionsData = await processOpenPositions(base64Data);
      const closedProfit = await processClosedPositions(base64Data);

      addReport(selectedYear, selectedMonth, positionsData, closedProfit);

      try {
        const historicalDividends = await processDividendsFromExcel(base64Data);
        historicalDividends.forEach((div) => addPlannedDividend({ ...div, status: 'received' }));
      } catch (err) {
        console.warn('Brak arkusza dywidend w pliku.');
      }

      setIsModalOpen(false);
      setPendingFileUri(null);
    } catch (error) {
      console.error('Błąd przetwarzania:', error);
      // Użyj Alert z 'react-native' zamiast window.alert
    }
  };

  return (
    <View style={{ flex: 1, paddingBottom: 100 }}>
      <Slot />

      <BottomNav onFileSelect={handleFileSelect} />

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
    </View>
  );
}
