import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

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
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Dane raportu</Text>

          {/* Sekcja Roku */}
          <Text style={styles.label}>ROK</Text>
          <View style={styles.row}>
            {[2024, 2025, 2026].map((y) => (
              <TouchableOpacity
                key={y}
                onPress={() => setSelectedYear(y)}
                style={[styles.box, selectedYear === y && styles.activeBox]}>
                <Text style={[styles.text, selectedYear === y && styles.activeText]}>{y}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sekcja Miesiąca */}
          <Text style={styles.label}>MIESIĄC</Text>
          <View style={styles.grid}>
            {Array.from({ length: 12 }, (_, i) => (
              <TouchableOpacity
                key={i + 1}
                onPress={() => setSelectedMonth(i + 1)}
                style={[styles.box, selectedMonth === i + 1 && styles.activeBox]}>
                <Text style={[styles.text, selectedMonth === i + 1 && styles.activeText]}>
                  {(i + 1).toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={onUpload}>
            <Text style={styles.saveButtonText}>ZAPISZ RAPORT</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>ANULUJ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  title: { fontSize: 22, fontWeight: '900', color: '#1e293b', marginBottom: 20 },
  label: { fontSize: 10, fontWeight: '900', color: '#94a3b8', marginBottom: 10, letterSpacing: 1 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 30 },
  box: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    minWidth: 50,
  },
  activeBox: { backgroundColor: '#4f46e5' },
  text: { fontWeight: 'bold', color: '#334155' },
  activeText: { color: 'white' },
  saveButton: { backgroundColor: '#4f46e5', padding: 20, borderRadius: 20, alignItems: 'center' },
  saveButtonText: { color: 'white', fontWeight: '900', letterSpacing: 1 },
  cancelButton: { marginTop: 15, alignItems: 'center' },
  cancelButtonText: { color: '#94a3b8', fontWeight: '900', letterSpacing: 1 },
});
