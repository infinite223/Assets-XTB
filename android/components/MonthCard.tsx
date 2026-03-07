import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'lucide-react-native';

interface MonthCardProps {
  reportId: string | number;
  month: number;
  deltaProfit: number;
  monthROI: number;
  onClick: () => void;
}

export const MonthCard = ({ month, deltaProfit, monthROI, onClick }: MonthCardProps) => {
  const isPositive = deltaProfit >= 0;

  return (
    <TouchableOpacity
      onPress={onClick}
      activeOpacity={0.8}
      className="rounded-[30px] border border-slate-100 bg-white p-6 shadow-sm">
      <View className="mb-6 flex-row items-center justify-between">
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
          <Calendar color="#6366f1" size={24} />
        </View>

        <View className={`rounded-full px-3 py-1 ${isPositive ? 'bg-emerald-50' : 'bg-rose-50'}`}>
          <Text
            className={`text-[11px] font-black uppercase tracking-wider ${
              isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}>
            {isPositive ? '+' : ''}
            {monthROI.toFixed(2)}% m/m
          </Text>
        </View>
      </View>

      <Text className="mb-6 text-3xl font-black uppercase italic text-slate-800">
        {new Date(0, month - 1).toLocaleString('pl-PL', { month: 'long' })}
      </Text>

      <View className="flex-row items-center justify-between border-t border-slate-50 pt-4">
        <Text className="text-[10px] font-black uppercase text-slate-400">Wynik</Text>
        <Text
          className={`text-2xl font-black ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isPositive ? '+' : ''}
          {deltaProfit.toLocaleString()} <Text className="text-xs opacity-70">PLN</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};
