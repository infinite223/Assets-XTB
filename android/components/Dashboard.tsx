import React, { useMemo, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Wallet, PieChart, TrendingUp } from 'lucide-react-native';
import { BarChart } from 'react-native-chart-kit';
import { MonthData, SortOrder } from '../types';
import { usePortfolio } from '../hooks/usePortfolio';

type SortKeys = 'purchaseValue' | 'monthlyProfitDelta' | 'profit';

interface DashboardProps {
  report: MonthData;
}

export default function Dashboard({ report }: DashboardProps) {
  const { store } = usePortfolio();
  const { positions, totalInvested, monthlyNetGain, year, month } = report;
  const screenWidth = Dimensions.get('window').width;

  const [sortConfig] = useState<{ key: SortKeys; order: SortOrder }>({
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
    <View className="flex-1">
      <View className="mb-6 rounded-[30px] border border-slate-100 bg-white p-6 shadow-sm">
        <View className="mb-4 flex-row items-center gap-2">
          <PieChart color="#6366f1" size={20} />
          <Text className="text-lg font-black text-slate-800">Alokacja</Text>
        </View>
        <BarChart
          data={chartData}
          width={screenWidth - 64}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
            style: { borderRadius: 16 },
            propsForLabels: { fontSize: 10, fontWeight: '600' },
          }}
          verticalLabelRotation={30}
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>

      <View className="mb-6 flex-row justify-between rounded-[30px] border border-slate-100 bg-white p-6 shadow-sm">
        <View>
          <View className="mb-1 flex-row items-center gap-1">
            <Wallet size={12} color="#94a3b8" />
            <Text className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Portfel {year}
            </Text>
          </View>
          <Text className="text-2xl font-black text-slate-800">
            {totalInvested.toLocaleString()}{' '}
            <Text className="text-sm font-bold text-slate-400">PLN</Text>
          </Text>
        </View>
        <View className="items-end">
          <View className="mb-1 flex-row items-center gap-1">
            <TrendingUp size={12} color="#94a3b8" />
            <Text className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Zysk netto
            </Text>
          </View>
          <Text
            className={`text-2xl font-black ${monthlyNetGain >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {monthlyNetGain >= 0 ? '+' : ''}
            {monthlyNetGain.toLocaleString()}{' '}
            <Text className="text-sm font-bold opacity-60">PLN</Text>
          </Text>
        </View>
      </View>

      <View className="gap-3">
        <Text className="mb-1 ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Aktywne Pozycje
        </Text>
        {enrichedPositions.map((item) => (
          <View
            key={item.symbol}
            className="flex-row items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <View>
              <Text className="text-lg font-black uppercase italic text-slate-800">
                {item.symbol}
              </Text>
              <Text className="text-[10px] font-bold text-slate-400">OPEN POSITION</Text>
            </View>
            <View className="items-end">
              <Text className="font-bold text-slate-700">
                {item.purchaseValue.toLocaleString()} PLN
              </Text>
              <Text
                className={`text-xs font-black ${item.monthlyProfitDelta >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {item.monthlyProfitDelta >= 0 ? '+' : ''}
                {item.monthlyProfitDelta.toLocaleString()} <Text className="text-[8px]">M/M</Text>
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
