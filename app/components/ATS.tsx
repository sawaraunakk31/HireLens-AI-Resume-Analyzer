import React from "react";
import { Server, CheckCircle2, AlertCircle } from "lucide-react";

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  const isExcellent = score >= 80;
  const isGood = score >= 60 && score < 80;

  const textColor = isExcellent
    ? "text-green-500"
    : isGood
      ? "text-yellow-500"
      : "text-red-500";
  const bgColor = isExcellent
    ? "bg-green-500/10"
    : isGood
      ? "bg-yellow-500/10"
      : "bg-red-500/10";
  const borderColor = isExcellent
    ? "border-green-500/20"
    : isGood
      ? "border-yellow-500/20"
      : "border-red-500/20";
  const progressColor = isExcellent
    ? "bg-green-500"
    : isGood
      ? "bg-yellow-500"
      : "bg-red-500";

  const subtitle = isExcellent
    ? "Highly Optimized"
    : isGood
      ? "Good Start"
      : "Needs Attention";

  const iconName = isExcellent ? "task_alt" : isGood ? "warning" : "error";

  return (
    <div className="w-full mt-4">
      <h3 className="text-xl font-bold font-display flex items-center gap-2 mb-4 text-[var(--text-primary)]">
        <Server className="w-6 h-6 text-primary" />
        ATS Compatibility
      </h3>

      <div className="glass-panel rounded-2xl p-6 border border-[var(--glass-border)] relative overflow-hidden">
        {/* Background circuit pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+PHBhdGggZD0iTTQwIDBMNDAgODBNMCA0MEw4MCA0MCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] pointer-events-none"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-xl ${bgColor} ${textColor} flex items-center justify-center border ${borderColor} shadow-inner`}
              >
                <span className="material-symbols-outlined text-3xl">
                  {iconName}
                </span>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-[var(--text-primary)] font-display">
                  {score}/100
                </h4>
                <p className="text-sm text-[var(--text-secondary)] font-medium">
                  {subtitle}
                </p>
              </div>
            </div>

            <div className="w-full sm:w-1/2 flex flex-col gap-2">
              <div className="flex justify-between text-xs font-semibold text-[var(--text-secondary)]">
                <span>Parse Success Rate</span>
                <span className={textColor}>{score}%</span>
              </div>
              <div className="h-2 w-full bg-[var(--form-bg)] rounded-full overflow-hidden shadow-inner border border-[var(--glass-border)]">
                <div
                  className={`h-full ${progressColor} transition-all duration-1000 ease-out`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>
          </div>

          <hr className="border-[var(--glass-border)] mb-6" />

          {/* Suggestions list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg border ${suggestion.type === "good" ? "bg-green-500/5 border-green-500/10" : "bg-red-500/5 border-red-500/10"}`}
              >
                {suggestion.type === "good" ? (
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" />
                )}
                <p
                  className={`text-sm leading-relaxed ${suggestion.type === "good" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {suggestion.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATS;
