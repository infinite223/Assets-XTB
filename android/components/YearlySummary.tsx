import React from "react";
import { View, Text, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { BarChart3, Target, Trophy } from "lucide-react-native";

interface MonthlyData {
  name: string;
  profit: number;
  monthNum: number;
}

interface YearlySummaryProps {
  yearId: string | number;
  totalInvested: number;
  roi: number;
  deltaProfit: number;
  bestMonth: { name: string; profit: number } | null;
  monthlyData: MonthlyData[];
}

export const YearlySummary = ({
  yearId,
  totalInvested,
  roi,
  deltaProfit,
  bestMonth,
  monthlyData,
}: YearlySummaryProps) => {
  const screenWidth = Dimensions.get("window").width;

  const data = {
    labels: monthlyData.map((m) => m.name),
    datasets: [{ data: monthlyData.map((m) => m.profit) }],
  };

  return (
    <View className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
      <View className="gap-8">
        <View>
          <Text className="text-xl font-black text-slate-800 mb-6 flex-row items-center">
            <BarChart3 color="#6366f1" size={20} /> Podsumowanie {yearId}
          </Text>

          <View className="flex-row flex-wrap gap-4">
            <View className="bg-slate-50 p-4 rounded-2xl flex-1 min-w-[40%]">
              <Text className="text-[10px] font-black text-slate-400 uppercase">Kapitał</Text>
              <Text className="text-lg font-black">{totalInvested.toLocaleString()} PLN</Text>
            </View>
            <View className="bg-indigo-600 p-4 rounded-2xl flex-1 min-w-[40%]">
              <Text className="text-[10px] font-black text-indigo-200 uppercase">ROI Roczne</Text>
              <Text className="text-lg font-black text-white">{roi.toFixed(2)}%</Text>
            </View>
          </View>
        </View>

        <View>
          <Text className="text-[10px] font-black text-slate-400 uppercase mb-4 text-center">
            Historia zysków (m/m)
          </Text>
          <BarChart
            data={data}
            width={screenWidth - 100}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
            }}
            style={{ borderRadius: 16 }}
            showValuesOnTopOfBars
          />
        </View>
      </View>
    </View>
  );
};