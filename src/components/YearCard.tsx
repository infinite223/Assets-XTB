import { Folder } from "lucide-react";

interface YearCardProps {
  year: number;
  stats: any;
  count: number;
  onClick: () => void;
}

export const YearCard = ({ year, stats, count, onClick }: YearCardProps) => (
  <div
    onClick={onClick}
    className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col justify-between min-h-[280px]"
  >
    <div className="flex justify-between items-start">
      <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
        <Folder className="w-7 h-7" />
      </div>
      <div
        className={`px-4 py-2 rounded-full text-xs font-black ${stats.roi >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
      >
        {stats.roi >= 0 ? "+" : ""}
        {stats.roi.toFixed(2)}%
      </div>
    </div>
    <div>
      <h2 className="text-3xl font-black text-slate-800">Rok {year}</h2>
      <p className="text-slate-400 font-bold italic text-sm">
        Raportów: {count}
      </p>
    </div>
    <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        Wynik YTD
      </span>
      <span
        className={`text-xl font-black ${stats.deltaProfit >= 0 ? "text-emerald-500" : "text-rose-500"}`}
      >
        {stats.deltaProfit >= 0 ? "+" : ""}
        {stats.deltaProfit.toLocaleString()}{" "}
        <span className="text-xs">PLN</span>
      </span>
    </div>
  </div>
);
