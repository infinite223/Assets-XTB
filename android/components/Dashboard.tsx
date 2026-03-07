import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Wallet, PieChart, TrendingUp, ChevronUp, ChevronDown } from 'lucide-react-native';
import { BarChart } from 'react-native-chart-kit';
import { MonthData, OpenPosition, SortOrder } from '../types';
import { usePortfolio } from '../hooks/usePortfolio';

type SortKeys = 'purchaseValue' | 'monthlyProfitDelta' | 'profit';

interface DashboardProps {
  report: MonthData;
}

export default function Dashboard({ report }: DashboardProps) {
  const { store } = usePortfolio();
  const { positions, totalInvested, monthlyNetGain, year, month } = report;
  const screenWidth = Dimensions.get('window').width;

  const [sortConfig, setSortConfig] = useState<{ key: SortKeys; order: SortOrder }>({
    key: 'purchaseValue',
    order: 'desc',
  });

  const prevReport = useMemo(() => {
    return Object.values(store.reports).find((r) => {
      if (month === 1) return r.year === year - 1 && r.month === 12;
      return r.year === year && r.month === month - 1;
    });
  }, [store.reports, year, month]);

  const enrichedPositions = useMemo(() => {
    const data = positions.map((currentPos) => {
      const prevPos = prevReport?.positions.find((p) => p.symbol === currentPos.symbol);
      return {
        ...currentPos,
        monthlyProfitDelta: prevPos ? currentPos.profit - prevPos.profit : currentPos.profit,
      };
    });

    return [...data].sort((a, b) => {
      return sortConfig.order === 'asc'
        ? a[sortConfig.key] > b[sortConfig.key]
          ? 1
          : -1
        : a[sortConfig.key] < b[sortConfig.key]
          ? 1
          : -1;
    });
  }, [positions, prevReport, sortConfig]);

  const chartData = {
    labels: enrichedPositions.map((p) => p.symbol),
    datasets: [{ data: enrichedPositions.map((p) => p.purchaseValue) }],
  };

  return (
    <View className="flex-1 p-4">
      {/* Wykres */}
      <View className="mb-6 rounded-[30px] border border-slate-100 bg-white p-6">
        <Text className="mb-4 flex-row items-center text-lg font-black">
          <PieChart color="#6366f1" size={20} /> Alokacja
        </Text>
        <BarChart
          data={chartData}
          width={screenWidth - 64}
          height={220}
          // Dodaj te dwa pola, aby spełnić wymogi TypeScripta:
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`, // Opcjonalnie dodaj dla czytelności
          }}
          style={{ borderRadius: 16 }}
        />
      </View>

      {/* Statystyki */}
      <View className="mb-6 flex-row justify-between rounded-[30px] border border-slate-100 bg-white p-6">
        <View>
          <Text className="text-[10px] font-black uppercase text-slate-400">Portfel {year}</Text>
          <Text className="text-2xl font-black">{totalInvested.toLocaleString()} PLN</Text>
        </View>
        <View className="items-end">
          <Text className="text-[10px] font-black uppercase text-slate-400">Zysk netto</Text>
          <Text
            className={`text-2xl font-black ${monthlyNetGain >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {monthlyNetGain >= 0 ? '+' : ''}
            {monthlyNetGain.toLocaleString()} PLN
          </Text>
        </View>
      </View>

      {/* Lista Pozycji zamiast Tabeli */}
      <FlatList
        data={enrichedPositions}
        keyExtractor={(item) => item.symbol}
        renderItem={({ item }) => (
          <View className="mb-3 flex-row items-center justify-between rounded-2xl border border-slate-100 bg-white p-4">
            <Text className="text-lg font-black italic">{item.symbol}</Text>
            <View className="items-end">
              <Text className="font-bold">{item.purchaseValue.toLocaleString()} PLN</Text>
              <Text
                className={`font-black ${item.monthlyProfitDelta >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {item.monthlyProfitDelta >= 0 ? '+' : ''}
                {item.monthlyProfitDelta.toLocaleString()}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
