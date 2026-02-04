import { useState, useEffect } from "react";
import { MonthData, OpenPosition, PortfolioStore, Dividend } from "../types";

export const usePortfolio = () => {
  const [store, setStore] = useState<PortfolioStore>(() => {
    const saved = localStorage.getItem("invest_dash_data");
    const defaultStructure = { reports: {}, plannedDividends: [] };

    try {
      if (!saved) return defaultStructure;
      const parsed = JSON.parse(saved);
      // Scalanie starego formatu z nowym (dodanie tablicy dywidend jeśli jej nie ma)
      return {
        ...defaultStructure,
        ...parsed,
      };
    } catch {
      return defaultStructure;
    }
  });

  useEffect(() => {
    localStorage.setItem("invest_dash_data", JSON.stringify(store));
  }, [store]);

  // Funkcja dodawania raportu (została bez zmian, ale wewnątrz setStore dbamy o resztę stanu)
  const addReport = (
    year: number,
    month: number,
    positions: OpenPosition[],
  ) => {
    const id = `${year}-${month.toString().padStart(2, "0")}`;
    const totalInvested = positions.reduce(
      (sum, p) => sum + p.purchaseValue,
      0,
    );
    const totalProfit = positions.reduce((sum, p) => sum + p.profit, 0);

    const prevMonthId =
      month === 1
        ? `${year - 1}-12`
        : `${year}-${(month - 1).toString().padStart(2, "0")}`;

    const prevReport = store.reports[prevMonthId];
    const monthlyNetGain = prevReport
      ? totalProfit - prevReport.totalProfit
      : totalProfit;

    const newReport: MonthData = {
      id,
      year,
      month,
      positions,
      totalInvested,
      totalProfit,
      monthlyNetGain,
    };

    setStore((prev) => ({
      ...prev, // Zachowujemy plannedDividends
      reports: { ...prev.reports, [id]: newReport },
    }));
  };

  // --- NOWE FUNKCJE DLA DYWIDEND ---

  const addPlannedDividend = (dividend: Dividend) => {
    setStore((prev) => ({
      ...prev,
      plannedDividends: [...(prev.plannedDividends || []), dividend],
    }));
  };

  const removePlannedDividend = (id: string) => {
    setStore((prev) => ({
      ...prev,
      plannedDividends: prev.plannedDividends.filter((d) => d.id !== id),
    }));
  };

  // Funkcja do masowego dodawania dywidend z Excela (tych typu 'received')
  const addReceivedDividends = (dividends: Dividend[]) => {
    setStore((prev) => {
      const existingIds = new Set(prev.plannedDividends.map((d) => d.id));
      const newDividends = dividends.filter((d) => !existingIds.has(d.id));

      return {
        ...prev,
        plannedDividends: [...prev.plannedDividends, ...newDividends],
      };
    });
  };

  return {
    store,
    addReport,
    addPlannedDividend,
    removePlannedDividend,
    addReceivedDividends,
  };
};
