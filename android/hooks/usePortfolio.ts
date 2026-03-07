import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
import { MonthData, OpenPosition, PortfolioStore, Dividend } from '../types';

const STORAGE_KEY = 'invest_dash_data';

export const usePortfolio = () => {
  const [store, setStore] = useState<PortfolioStore>({
    reports: {},
    plannedDividends: [],
    isFirstVisit: true,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setStore(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store)).catch(console.error);
    }
  }, [store, isLoaded]);

  const addReport = (
    year: number,
    month: number,
    positions: OpenPosition[],
    closedProfit: number = 0
  ) => {
    const id = `${year}-${month.toString().padStart(2, '0')}`;
    const totalInvested = positions.reduce((sum, p) => sum + p.purchaseValue, 0);
    const totalProfit = positions.reduce((sum, p) => sum + p.profit, 0);
    const prevMonthId =
      month === 1 ? `${year - 1}-12` : `${year}-${(month - 1).toString().padStart(2, '0')}`;
    const prevReport = store.reports[prevMonthId];
    const monthlyNetGain = prevReport ? totalProfit - prevReport.totalProfit : totalProfit;

    const newReport: MonthData = {
      id,
      year,
      month,
      positions,
      totalInvested,
      totalProfit,
      closedProfit,
      monthlyNetGain,
    };

    setStore((prev) => ({
      ...prev,
      reports: { ...prev.reports, [id]: newReport },
    }));
  };

  const addPlannedDividend = (dividend: Dividend) => {
    setStore((prev) => ({
      ...prev,
      plannedDividends: [...(prev.plannedDividends || []), dividend],
    }));
  };

  const removePlannedDividend = (id: string) => {
    setStore((prev) => ({
      ...prev,
      plannedDividends: prev.plannedDividends.filter((d) => d.id !== id),
    }));
  };

  const addReceivedDividends = (dividends: Dividend[]) => {
    setStore((prev) => {
      const existingIds = new Set(prev.plannedDividends.map((d) => d.id));
      const newDividends = dividends.filter((d) => !existingIds.has(d.id));
      return {
        ...prev,
        plannedDividends: [...prev.plannedDividends, ...newDividends],
      };
    });
  };

  const completeFirstVisit = () => {
    setStore((prev) => ({ ...prev, isFirstVisit: false }));
  };

  const resetAllData = async () => {
    Alert.alert('Potwierdzenie', 'Czy na pewno usunąć wszystkie dane?', [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem(STORAGE_KEY);
          setStore({ reports: {}, plannedDividends: [], isFirstVisit: true });
        },
      },
    ]);
  };

  const exportData = async () => {
    try {
      const fileUri = (FileSystem as any).documentDirectory + 'portfolio_backup.json';
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(store, null, 2));
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Eksportuj dane',
      });
    } catch (e) {
      Alert.alert('Błąd', 'Nie udało się wyeksportować danych.');
    }
  };

  const importData = async (): Promise<boolean> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
      if (result.canceled) return false;

      const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
      const parsed = JSON.parse(fileContent);

      if (parsed.reports && parsed.plannedDividends) {
        setStore(parsed);
        return true;
      }
      throw new Error('Nieprawidłowy format');
    } catch (e) {
      Alert.alert('Błąd', 'Nie udało się zaimportować pliku.');
      return false;
    }
  };

  return {
    store,
    isLoaded,
    addReport,
    addPlannedDividend,
    removePlannedDividend,
    addReceivedDividends,
    completeFirstVisit,
    resetAllData,
    exportData,
    importData,
  };
};
