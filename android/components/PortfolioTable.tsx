import { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import {
  Layers,
  ChevronDown,
  ChevronUp,
  PieChart as PieIcon,
  ArrowUpRight,
} from 'lucide-react-native';
import { Svg } from 'react-native-svg';
import { PortfolioSortKeys, SortOrder } from '../types';
import { VictoryPie } from 'victory-native';
import '../global.css';

interface PortfolioTableProps {
  positions: any[];
  sortConfig: { key: PortfolioSortKeys; order: SortOrder };
  onRequestSort: (key: PortfolioSortKeys) => void;
}

const COLORS = [
  '#6366f1',
  '#10b981',
  '#8b5cf6',
  '#f59e0b',
  '#3b82f6',
  '#ec4899',
  '#14b8a6',
  '#f43f5e',
];

export const PortfolioTable = ({ positions, sortConfig, onRequestSort }: PortfolioTableProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isChartExpanded, setIsChartExpanded] = useState(true);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const allocationData = useMemo(() => {
    return positions
      .map((pos) => ({
        name: pos.symbol,
        value: Math.max(0, pos.purchaseValue + pos.profit),
      }))
      .sort((a, b) => b.value - a.value);
  }, [positions]);

  const totalValue = useMemo(
    () => allocationData.reduce((acc, curr) => acc + curr.value, 0),
    [allocationData]
  );

  const SortIndicator = ({ active, order }: { active: boolean; order: SortOrder }) => (
    <Text className="ml-1 text-[10px] opacity-50">
      {active ? (order === 'asc' ? '↑' : '↓') : '↕'}
    </Text>
  );

  return (
    <View className="mb-8 px-4">
      <View className="mb-6 overflow-hidden rounded-[30px] border border-slate-100 bg-white shadow-sm">
        <TouchableOpacity
          className="flex-row items-center justify-between border-b border-slate-50 bg-slate-50/30 p-5"
          onPress={() => setIsExpanded(!isExpanded)}>
          <View className="flex-row items-center gap-3">
            <Layers color="#6366f1" size={20} />
            <Text className="text-base font-black uppercase italic text-slate-800">
              Skład Portfela
            </Text>
            <Text className="text-[10px] font-bold text-slate-400">({positions.length} poz)</Text>
          </View>
          <View className="h-7 w-7 items-center justify-center rounded-full border border-slate-100 bg-white">
            {isExpanded ? (
              <ChevronUp size={14} color="#475569" />
            ) : (
              <ChevronDown size={14} color="#475569" />
            )}
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="min-w-[600px]">
              <View className="flex-row bg-slate-50/50">
                {['Symbol', 'Ilość', 'Śr. Cena', 'Zainw.', 'Akt. Cena', 'Zysk'].map((h) => (
                  <TouchableOpacity
                    key={h}
                    className="flex-1 px-5 py-4"
                    onPress={() => onRequestSort(h.toLowerCase() as any)}>
                    <Text className="text-[9px] font-black uppercase text-slate-400">{h}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {positions.map((pos) => (
                <View key={pos.symbol} className="flex-row items-center border-t border-slate-50">
                  <Text className="flex-1 px-5 py-4 font-black italic text-slate-800">
                    {pos.symbol}
                  </Text>
                  <Text className="flex-1 px-5 py-4 text-right font-bold text-slate-600">
                    {pos.volume.toLocaleString()}
                  </Text>
                  <Text className="flex-1 px-5 py-4 text-right font-bold text-slate-400">
                    {(pos.purchaseValue / pos.volume).toFixed(2)}
                  </Text>
                  <Text className="flex-1 px-5 py-4 text-right font-bold text-slate-800">
                    {pos.purchaseValue.toLocaleString()}
                  </Text>
                  <Text className="flex-1 px-5 py-4 text-right font-black text-indigo-600">
                    {(pos.purchaseValue + pos.profit / pos.volume).toFixed(2)}
                  </Text>
                  <View className="flex-1 items-end px-5 py-4">
                    <Text
                      className={`font-black ${pos.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {pos.profit >= 0 ? '+' : ''}
                      {pos.profit.toLocaleString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      <View className="overflow-hidden rounded-[30px] border border-slate-100 bg-white shadow-sm">
        <TouchableOpacity
          className="flex-row items-center justify-between border-b border-slate-50 bg-slate-50/30 p-5"
          onPress={() => setIsChartExpanded(!isChartExpanded)}>
          <View className="flex-row items-center gap-3">
            <PieIcon color="#6366f1" size={20} />
            <Text className="text-base font-black uppercase italic text-slate-800">Alokacja</Text>
          </View>
          <View className="h-7 w-7 items-center justify-center rounded-full border border-slate-100 bg-white">
            {isChartExpanded ? (
              <ChevronUp size={14} color="#475569" />
            ) : (
              <ChevronDown size={14} color="#475569" />
            )}
          </View>
        </TouchableOpacity>

        {isChartExpanded && (
          <View className="items-center p-0">
            <View style={{ width: 300, height: 300 }}>
              <VictoryPie
                standalone={true} // VictoryPie samo zajmie się renderowaniem SVG
                width={300}
                height={300}
                data={allocationData}
                x="name"
                y="value"
                colorScale={COLORS}
                innerRadius={70} // Zmniejsz to, jeśli chcesz cieńszy/grubszy pierścień
                padding={0} // Kluczowe: usuwamy padding, żeby wykres był na środku
                labels={() => ''}
                style={{
                  data: {
                    stroke: 'white', // Biała przerwa między segmentami
                    strokeWidth: 2,
                  },
                }}
              />
            </View>

            {/* Legenda */}
            <View className="mb-6 mt-2 flex-row flex-wrap justify-center gap-x-4 gap-y-2 px-4">
              {allocationData.map((entry, index) => (
                <View key={entry.name} className="flex-row items-center gap-1">
                  <View
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <Text className="text-[10px] font-black text-slate-500">{entry.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
