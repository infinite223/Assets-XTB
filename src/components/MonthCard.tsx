import { Calendar } from "lucide-react";

interface MonthCardProps {
  reportId: string | number;
  month: number;
  deltaProfit: number;
  monthROI: number;
  onClick: () => void;
}

export const MonthCard = ({
  month,
  deltaProfit,
  monthROI,
  onClick,
}: MonthCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-white p-6 md:p-8 rounded-[30px] md:rounded-[40px] shadow-sm border border-slate-100 cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all group"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
          <Calendar size={20} />
        </div>
        <div
          className={`px-3 py-1 rounded-full text-[9px] md:text-[11px] font-black ${
            deltaProfit >= 0
              ? "bg-emerald-50 text-emerald-600"
              : "bg-rose-50 text-rose-600"
          }`}
        >
          {monthROI >= 0 ? "+" : ""}
          {monthROI.toFixed(2)}% m/m
        </div>
      </div>

      <h3 className="text-xl md:text-3xl font-black text-slate-800 uppercase italic mb-6">
        {new Date(0, month - 1).toLocaleString("pl-PL", {
          month: "long",
        })}
      </h3>

      <div className="flex justify-between items-center pt-4 border-t border-slate-50">
        <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase">
          Wynik
        </span>
        <p
          className={`text-lg md:text-2xl font-black ${
            deltaProfit >= 0 ? "text-emerald-500" : "text-rose-500"
          }`}
        >
          {deltaProfit >= 0 ? "+" : ""}
          {deltaProfit.toLocaleString()} <span className="text-xs">PLN</span>
        </p>
      </div>
    </div>
  );
};
