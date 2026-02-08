import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { YearsPage } from "./pages/YearsPage";
import { MonthsPage } from "./pages/MonthsPage";
import { DetailsPage } from "./pages/DetailsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<YearsPage />} />
        <Route path="/:year" element={<MonthsPage />} />
        <Route path="/:year/:month" element={<DetailsPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

// import { useState, useMemo } from "react";
// import { usePortfolio } from "./hooks/usePortfolio";
// import {
//   processDividendsFromExcel,
//   processOpenPositions,
// } from "./utils/excelParser";
// import Dashboard from "./components/Dashboard";
// import { ArrowLeft, Plus, Briefcase } from "lucide-react";
// import { UploadModal } from "./components/UploadModal";
// import { PortfolioTable } from "./components/PortfolioTable";
// import { DividendSection } from "./components/DividendSection";
// import { YearCard } from "./components/YearCard";
// import { MonthCard } from "./components/MonthCard";
// import { YearlySummary } from "./components/YearlySummary";
// import { DividendSortKeys, PortfolioSortKeys, SortOrder } from "./types";

// export default function App() {
//   const [view, setView] = useState<{
//     type: "years" | "months" | "details";
//     id?: number | string;
//   }>({ type: "years" });

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [pendingFile, setPendingFile] = useState<File | null>(null);

//   const [divForm, setDivForm] = useState({ symbol: "", yield: "", date: "" });
//   const { store, addReport, addPlannedDividend, removePlannedDividend } =
//     usePortfolio();

//   const [portfolioSort, setPortfolioSort] = useState<{
//     key: PortfolioSortKeys;
//     order: SortOrder;
//   }>({
//     key: "purchaseValue",
//     order: "desc",
//   });

//   const [divSort, setDivSort] = useState<{
//     key: DividendSortKeys;
//     order: SortOrder;
//   }>({
//     key: "payDate",
//     order: "asc",
//   });

//   const calculateMonthlyDelta = (currentReport: any) => {
//     const prevReport = getPreviousMonthReport(
//       currentReport.year,
//       currentReport.month,
//     );
//     if (!prevReport) return currentReport.totalProfit;
//     return currentReport.totalProfit - prevReport.totalProfit;
//   };

//   const getPreviousMonthReport = (year: number, month: number) => {
//     const allReports = Object.values(store.reports);
//     return allReports.find((r) => {
//       if (month === 1) return r.year === year - 1 && r.month === 12;
//       return r.year === year && r.month === month - 1;
//     });
//   };

//   const globalStats = useMemo(() => {
//     const allReports = Object.values(store.reports).sort((a, b) => {
//       if (a.year !== b.year) return a.year - b.year;
//       return a.month - b.month;
//     });
//     if (allReports.length === 0) return null;

//     const latestReport = allReports[allReports.length - 1];
//     const totalProfit = allReports.reduce(
//       (sum, r) => sum + calculateMonthlyDelta(r),
//       0,
//     );

//     const sortedPositions = [...latestReport.positions].sort((a, b) => {
//       let aVal: any, bVal: any;

//       if (portfolioSort.key === "currPrice") {
//         aVal = a.currentPrice || (a.purchaseValue + a.profit) / a.volume;
//         bVal = b.currentPrice || (b.purchaseValue + b.profit) / b.volume;
//       } else {
//         aVal = a[portfolioSort.key as keyof typeof a] ?? 0;
//         bVal = b[portfolioSort.key as keyof typeof b] ?? 0;
//       }

//       if (portfolioSort.order === "asc") return aVal > bVal ? 1 : -1;
//       return aVal < bVal ? 1 : -1;
//     });

//     return {
//       totalInvested: latestReport.totalInvested,
//       totalProfit,
//       roi:
//         latestReport.totalInvested !== 0
//           ? (totalProfit / latestReport.totalInvested) * 100
//           : 0,
//       latestPositions: sortedPositions,
//       reportCount: allReports.length,
//     };
//   }, [store.reports, portfolioSort]);

//   const requestPortfolioSort = (key: PortfolioSortKeys) => {
//     setPortfolioSort((prev) => ({
//       key,
//       order: prev.key === key && prev.order === "desc" ? "asc" : "desc",
//     }));
//   };

//   const requestDivSort = (key: DividendSortKeys) => {
//     setDivSort((prev) => ({
//       key,
//       order: prev.key === key && prev.order === "desc" ? "asc" : "desc",
//     }));
//   };

//   const SortIndicator = ({
//     active,
//     order,
//   }: {
//     active: boolean;
//     order: SortOrder;
//   }) => {
//     if (!active) return <span className="ml-1 opacity-20">↕</span>;
//     return (
//       <span className="ml-1 text-indigo-500">
//         {order === "asc" ? "↑" : "↓"}
//       </span>
//     );
//   };

//   const calculateYearlyStats = (year: number) => {
//     const yearReports = Object.values(store.reports)
//       .filter((r) => r.year === year)
//       .sort((a, b) => a.month - b.month);

//     if (yearReports.length === 0)
//       return {
//         totalInvested: 0,
//         deltaProfit: 0,
//         roi: 0,
//         monthlyData: [],
//         bestMonth: null,
//       };

//     const latestReport = yearReports[yearReports.length - 1];

//     const monthlyData = yearReports.map((r) => ({
//       name: new Date(0, r.month - 1).toLocaleString("pl-PL", {
//         month: "short",
//       }),
//       profit: calculateMonthlyDelta(r),
//       monthNum: r.month,
//     }));

//     const yearlyDelta = monthlyData.reduce((sum, m) => sum + m.profit, 0);
//     const bestMonth = [...monthlyData].sort((a, b) => b.profit - a.profit)[0];

//     return {
//       totalInvested: latestReport.totalInvested,
//       deltaProfit: yearlyDelta,
//       roi:
//         latestReport.totalInvested !== 0
//           ? (yearlyDelta / latestReport.totalInvested) * 100
//           : 0,
//       monthlyData,
//       bestMonth,
//     };
//   };

//   const handleSaveDividend = () => {
//     if (!divForm.symbol || !divForm.yield || !divForm.date) return;

//     addPlannedDividend({
//       id: crypto.randomUUID(),
//       symbol: divForm.symbol,
//       yieldPercentage: Number(divForm.yield),
//       payDate: divForm.date,
//       status: "planned",
//     });

//     setDivForm({ symbol: "", yield: "", date: "" });
//   };

//   const handleUpload = async () => {
//     if (pendingFile) {
//       const positionsData = await processOpenPositions(pendingFile);
//       addReport(selectedYear, selectedMonth, positionsData);

//       try {
//         const historicalDividends =
//           await processDividendsFromExcel(pendingFile);
//         historicalDividends.forEach((div) => {
//           addPlannedDividend({ ...div, status: "received" });
//         });
//       } catch (err) {
//         console.log("Brak arkusza dywidend - pomijam.");
//       }
//       setIsModalOpen(false);
//       setPendingFile(null);
//     }
//   };

//   const years = Array.from(
//     new Set(Object.values(store.reports).map((r) => r.year)),
//   ).sort((a, b) => b - a);

//   const sortedDividends = useMemo(() => {
//     const baseDividends = [...(store.plannedDividends || [])].map((div) => {
//       if (div.status === "received" && div.totalAmount) return div;
//       const pos = globalStats?.latestPositions.find(
//         (p) => p.symbol === div.symbol,
//       );
//       if (pos) {
//         const currPrice =
//           pos.currentPrice ||
//           (pos.volume > 0 ? (pos.purchaseValue + pos.profit) / pos.volume : 0);
//         const amountPerShare = currPrice * (div.yieldPercentage / 100);
//         return {
//           ...div,
//           amountPerShare,
//           totalAmount: amountPerShare * pos.volume,
//         };
//       }
//       return div;
//     });

//     return baseDividends.sort((a, b) => {
//       let aVal = a[divSort.key as keyof typeof a] ?? 0;
//       let bVal = b[divSort.key as keyof typeof b] ?? 0;

//       if (divSort.key === "payDate") {
//         aVal = new Date(a.payDate).getTime();
//         bVal = new Date(b.payDate).getTime();
//       }

//       if (divSort.order === "asc") {
//         return aVal > bVal ? 1 : -1;
//       }
//       return aVal < bVal ? 1 : -1;
//     });
//   }, [store.plannedDividends, globalStats, divSort]);

//   if (view.type === "years") {
//     return (
//       <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10 font-sans text-slate-900 pb-32">
//         <header className="max-w-7xl mx-auto mb-12">
//           <h1 className="text-3xl md:text-4xl font-black tracking-tighter italic">
//             INVEST_DASH
//           </h1>
//           <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">
//             Portfolio Summary
//           </p>
//         </header>

//         {globalStats && (
//           <div className="max-w-7xl mx-auto mb-16 bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-10 items-center">
//             <div className="flex-1 w-full">
//               <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 mb-6">
//                 <Briefcase className="text-indigo-500" /> Stan Portfela
//                 (Łącznie)
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//                 <div className="bg-slate-50 p-6 rounded-[25px]">
//                   <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
//                     Zainwestowane
//                   </p>
//                   <p className="text-2xl font-black">
//                     {globalStats.totalInvested.toLocaleString()}{" "}
//                     <span className="text-sm font-normal">PLN</span>
//                   </p>
//                 </div>
//                 <div className="bg-slate-50 p-6 rounded-[25px]">
//                   <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
//                     Zysk Całkowity
//                   </p>
//                   <p
//                     className={`text-2xl font-black ${globalStats.totalProfit >= 0 ? "text-emerald-500" : "text-rose-500"}`}
//                   >
//                     {globalStats.totalProfit >= 0 ? "+" : ""}
//                     {globalStats.totalProfit.toLocaleString()}{" "}
//                     <span className="text-sm font-normal">PLN</span>
//                   </p>
//                 </div>
//                 <div className="bg-slate-50 p-6 rounded-[25px] text-slate-400 shadow-indigo-100">
//                   <p className="text-[10px] font-black uppercase mb-1">
//                     Global ROI
//                   </p>
//                   <p className="text-3xl font-black text-emerald-500">
//                     {globalStats.roi.toFixed(2)}%
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {years.map((year) => {
//             const stats = calculateYearlyStats(year);
//             const count = Object.values(store.reports).filter(
//               (r) => r.year === year,
//             ).length;
//             return (
//               <YearCard
//                 key={year}
//                 year={year}
//                 stats={stats}
//                 count={count}
//                 onClick={() => setView({ type: "months", id: year })}
//               />
//             );
//           })}

//           <div className="bg-indigo-600 p-8 rounded-[40px] shadow-xl flex flex-col items-center justify-center text-white hover:bg-indigo-700 transition-all cursor-pointer group min-h-[280px]">
//             <input
//               type="file"
//               onChange={(e) => {
//                 const f = e.target.files?.[0];
//                 if (f) {
//                   setPendingFile(f);
//                   setIsModalOpen(true);
//                 }
//               }}
//               className="hidden"
//               id="init-upload"
//               accept=".xlsx"
//             />
//             <label
//               htmlFor="init-upload"
//               className="cursor-pointer flex flex-col items-center"
//             >
//               <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center mb-4 group-hover:rotate-90 transition-transform duration-500">
//                 <Plus size={32} />
//               </div>
//               <span className="font-black text-lg uppercase tracking-tight">
//                 Nowy Raport
//               </span>
//             </label>
//           </div>
//         </div>

//         {globalStats && (
//           <PortfolioTable
//             positions={globalStats.latestPositions}
//             sortConfig={portfolioSort}
//             onRequestSort={requestPortfolioSort}
//           />
//         )}

//         {/* SEKCJA DYWIDEND */}
//         <DividendSection
//           dividends={sortedDividends}
//           form={divForm}
//           onFormChange={(field, value) =>
//             setDivForm({ ...divForm, [field]: value })
//           }
//           onSave={handleSaveDividend}
//           onRemove={removePlannedDividend}
//           availableSymbols={
//             globalStats?.latestPositions.map((p) => p.symbol) || []
//           }
//           sortConfig={divSort}
//           onRequestSort={requestDivSort}
//         />

//         <UploadModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           onUpload={handleUpload}
//           selectedYear={selectedYear}
//           setSelectedYear={setSelectedYear}
//           selectedMonth={selectedMonth}
//           setSelectedMonth={setSelectedMonth}
//         />
//       </div>
//     );
//   }

//   if (view.type === "months") {
//     const monthsInYear = Object.values(store.reports)
//       .filter((r) => r.year === view.id)
//       .sort((a, b) => b.month - a.month);

//     const yearlyStats = calculateYearlyStats(Number(view.id));

//     return (
//       <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10 font-sans">
//         <div className="max-w-7xl mx-auto">
//           <button
//             onClick={() => setView({ type: "years" })}
//             className="group flex items-center gap-3 text-slate-400 font-black mb-8 hover:text-indigo-600 transition-all uppercase text-[10px] md:text-xs tracking-widest"
//           >
//             <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:-translate-x-1 transition-transform">
//               <ArrowLeft size={16} />
//             </div>
//             Powrót do lat
//           </button>

//           <h2 className="text-3xl md:text-5xl font-black mb-8 md:mb-12 tracking-tighter italic">
//             Rok {view.id}
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
//             {monthsInYear.map((report) => {
//               const deltaProfit = calculateMonthlyDelta(report);
//               const monthROI =
//                 report.totalInvested !== 0
//                   ? (deltaProfit / report.totalInvested) * 100
//                   : 0;

//               return (
//                 <MonthCard
//                   key={report.id}
//                   reportId={report.id}
//                   month={report.month}
//                   deltaProfit={deltaProfit}
//                   monthROI={monthROI}
//                   onClick={() => setView({ type: "details", id: report.id })}
//                 />
//               );
//             })}
//           </div>

//           {/* PODSUMOWANIE ROKU ZE STATYSTYKAMI I WYKRESEM */}
//           <YearlySummary
//             yearId={view.id!}
//             totalInvested={yearlyStats.totalInvested}
//             roi={yearlyStats.roi}
//             deltaProfit={yearlyStats.deltaProfit}
//             bestMonth={yearlyStats.bestMonth}
//             monthlyData={yearlyStats.monthlyData}
//           />
//         </div>
//       </div>
//     );
//   }

//   // --- WIDOK: DASHBOARD (DETALE MIESIĄCA) ---
//   const activeReport = store.reports[view.id as string];
//   const currentDelta = calculateMonthlyDelta(activeReport);

//   return (
//     <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
//       <div className="p-4 md:p-8 bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-100 mb-8 shadow-sm">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <button
//             onClick={() => setView({ type: "months", id: activeReport.year })}
//             className="group flex items-center gap-3 text-slate-400 font-black hover:text-indigo-600 transition-all uppercase text-[10px] tracking-widest"
//           >
//             <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:-translate-x-1 transition-transform">
//               <ArrowLeft size={16} />
//             </div>
//             Wróć do listy
//           </button>
//           <div className="text-right">
//             <p className="text-[10px] font-black text-slate-300 uppercase leading-none mb-1">
//               Wybrany okres
//             </p>
//             <p className="font-black text-slate-800 uppercase italic text-lg leading-none">
//               {new Date(0, activeReport.month - 1).toLocaleString("pl", {
//                 month: "long",
//               })}{" "}
//               {activeReport.year}
//             </p>
//           </div>
//         </div>
//       </div>
//       <Dashboard report={{ ...activeReport, monthlyNetGain: currentDelta }} />
//     </div>
//   );
// }
