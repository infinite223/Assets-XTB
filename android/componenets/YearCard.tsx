import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Folder } from 'lucide-react-native';

interface YearCardProps {
  year: number;
  stats: any;
  count: number;
  onClick: () => void;
}

export const YearCard = ({ year, stats, count, onClick }: YearCardProps) => {
  const isPositive = stats.roi >= 0;
  const isProfitPositive = stats.deltaProfit >= 0;

  return (
    <TouchableOpacity
      onPress={onClick}
      activeOpacity={0.8}
      className="min-h-[220px] justify-between rounded-[40px] border border-slate-100 bg-white p-7 shadow-sm">
      <View className="flex-row items-start justify-between">
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
          <Folder color="#6366f1" size={24} />
        </View>

        <View className={`rounded-full px-4 py-2 ${isPositive ? 'bg-emerald-50' : 'bg-rose-50'}`}>
          <Text
            className={`text-xs font-black uppercase tracking-tighter ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {isPositive ? '+' : ''}
            {stats.roi.toFixed(2)}%
          </Text>
        </View>
      </View>

      <View>
        <Text className="text-2xl font-black uppercase italic tracking-tighter text-slate-800">
          Rok {year}
        </Text>
        <Text className="mt-1 text-xs font-bold italic text-slate-400">Raportów: {count}</Text>
      </View>

      <View className="flex-row items-center justify-between border-t border-slate-50 pt-5">
        <Text className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Wynik YTD
        </Text>
        <Text
          className={`text-lg font-black ${isProfitPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isProfitPositive ? '+' : ''}
          {stats.deltaProfit.toLocaleString()}
          <Text className="text-[10px] text-slate-400"> PLN</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};
