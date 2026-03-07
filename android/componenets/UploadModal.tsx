import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: () => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
}

export const UploadModal = ({
  isOpen,
  onClose,
  onUpload,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
}: UploadModalProps) => {
  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/60 p-4">
        <View className="w-full max-w-sm rounded-[40px] bg-white p-8 shadow-2xl">
          <Text className="mb-6 text-2xl font-black text-slate-800">Dane raportu</Text>

          <View className="mb-6 flex-row gap-4">
            <View className="flex-1">
              <Text className="mb-2 text-[10px] font-black uppercase text-slate-400">Rok</Text>
              <ScrollView horizontal className="flex-row gap-2">
                {[2024, 2025, 2026].map((y) => (
                  <TouchableOpacity
                    key={y}
                    onPress={() => setSelectedYear(y)}
                    className={`rounded-xl p-3 ${selectedYear === y ? 'bg-indigo-600' : 'bg-slate-100'}`}>
                    <Text className={selectedYear === y ? 'font-black text-white' : 'font-black'}>
                      {y}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-[10px] font-black uppercase text-slate-400">Miesiąc</Text>
            <View className="flex-row flex-wrap gap-2">
              {Array.from({ length: 12 }, (_, i) => (
                <TouchableOpacity
                  key={i + 1}
                  onPress={() => setSelectedMonth(i + 1)}
                  className={`rounded-lg p-3 ${selectedMonth === i + 1 ? 'bg-indigo-600' : 'bg-slate-100'}`}>
                  <Text className={selectedMonth === i + 1 ? 'font-bold text-white' : 'font-bold'}>
                    {(i + 1).toString().padStart(2, '0')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            onPress={onUpload}
            className="w-full items-center rounded-2xl bg-indigo-600 py-5 active:opacity-80">
            <Text className="font-black uppercase tracking-widest text-white">Zapisz raport</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} className="mt-4 items-center">
            <Text className="font-black uppercase tracking-widest text-slate-400">Anuluj</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
