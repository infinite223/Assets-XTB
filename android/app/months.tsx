import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { usePortfolio } from '../hooks/usePortfolio';
import { MonthCard } from 'components/MonthCard';
import { YearlySummary } from 'components/YearlySummary';

export default function months() {
  const { year } = useLocalSearchParams<{ year: string }>();
  const router = useRouter();
  const { store } = usePortfolio();

  const currentYear = Number(year);

  const getPreviousMonthReport = (y: number, m: number) => {
    const allReports = Object.values(store.reports);
    return allReports.find((r) => {
      if (m === 1) return r.year === y - 1 && r.month === 12;
      return r.year === y && r.month === m - 1;
    });
  };

  const calculateMonthlyDelta = (currentReport: any) => {
    const prevReport = getPreviousMonthReport(currentReport.year, currentReport.month);
    return prevReport
      ? currentReport.totalProfit - prevReport.totalProfit
      : currentReport.totalProfit;
  };

  const yearlyStats = useMemo(() => {
    const yearReports = Object.values(store.reports)
      .filter((r) => r.year === currentYear)
      .sort((a, b) => a.month - b.month);

    if (yearReports.length === 0) return null;

    const latestReport = yearReports[yearReports.length - 1];
    const monthlyData = yearReports.map((r) => ({
      name: new Date(0, r.month - 1).toLocaleString('pl-PL', { month: 'short' }),
      profit: calculateMonthlyDelta(r),
      monthNum: r.month,
    }));

    const yearlyDelta = monthlyData.reduce((sum, m) => sum + m.profit, 0);
    const bestMonth = [...monthlyData].sort((a, b) => b.profit - a.profit)[0];

    return {
      totalInvested: latestReport.totalInvested,
      deltaProfit: yearlyDelta,
      roi: latestReport.totalInvested !== 0 ? (yearlyDelta / latestReport.totalInvested) * 100 : 0,
      monthlyData,
      bestMonth,
    };
  }, [store.reports, currentYear]);

  const monthsInYear = Object.values(store.reports)
    .filter((r) => r.year === currentYear)
    .sort((a, b) => b.month - a.month);

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ paddingBottom: 80 }}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-slate-100 bg-white p-6 pt-12">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2">
          <View className="h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-slate-50">
            <ArrowLeft size={16} color="#475569" />
          </View>
        </TouchableOpacity>
        <Text className="text-lg font-black uppercase italic text-slate-800">Rok {year}</Text>
      </View>

      <View className="gap-4 p-4">
        {monthsInYear.map((report) => (
          <MonthCard
            key={report.id}
            reportId={report.id}
            month={report.month}
            deltaProfit={calculateMonthlyDelta(report)}
            monthROI={
              report.totalInvested !== 0
                ? (calculateMonthlyDelta(report) / report.totalInvested) * 100
                : 0
            }
            onClick={() => router.push(`/${year}/${report.month}` as any)}
          />
        ))}

        {monthsInYear.length > 0 && yearlyStats && (
          <View className="mt-6">
            <Text className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">
              Analityka
            </Text>
            <YearlySummary
              yearId={year!}
              totalInvested={yearlyStats.totalInvested}
              roi={yearlyStats.roi}
              deltaProfit={yearlyStats.deltaProfit}
              bestMonth={yearlyStats.bestMonth}
              monthlyData={yearlyStats.monthlyData}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
