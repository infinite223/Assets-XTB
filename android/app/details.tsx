import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { usePortfolio } from '../hooks/usePortfolio';
import Dashboard from 'components/Dashboard';

export default function DetailsPage() {
  const { year, month } = useLocalSearchParams<{ year: string; month: string }>();
  const router = useRouter();
  const { store } = usePortfolio();

  const activeReport = Object.values(store.reports).find(
    (r) => r.year === Number(year) && r.month === Number(month)
  );

  const calculateMonthlyDelta = (report: any) => {
    if (!report) return 0;
    const allReports = Object.values(store.reports);
    const prevReport = allReports.find((r) => {
      if (report.month === 1) {
        return r.year === report.year - 1 && r.month === 12;
      }
      return r.year === report.year && r.month === report.month - 1;
    });
    return prevReport ? report.totalProfit - prevReport.totalProfit : report.totalProfit;
  };

  if (!activeReport) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 p-6">
        <Text className="mb-4 text-2xl font-black text-slate-800">Nie znaleziono raportu</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-sm font-bold uppercase tracking-widest text-indigo-600">
            Wróć do listy miesięcy
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentDelta = calculateMonthlyDelta(activeReport);
  const monthName = new Date(0, activeReport.month - 1).toLocaleString('pl', { month: 'long' });

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-slate-100 bg-white p-6 pt-14 shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2">
          <View className="h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-slate-50">
            <ArrowLeft size={16} color="#475569" />
          </View>
          <Text className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Powrót
          </Text>
        </TouchableOpacity>

        <View className="items-end">
          <Text className="mb-1 text-[10px] font-black uppercase leading-none text-slate-300">
            Szczegóły okresu
          </Text>
          <Text className="text-lg font-black uppercase italic leading-none text-slate-800">
            {monthName} {activeReport.year}
          </Text>
        </View>
      </View>

      <View className="p-4">
        {/* Tu przekazujesz dane do komponentu Dashboard */}
        <Dashboard report={{ ...activeReport, monthlyNetGain: currentDelta }} />
      </View>
    </ScrollView>
  );
}
