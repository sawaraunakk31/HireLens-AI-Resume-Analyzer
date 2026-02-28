import React from "react";
import { Brain, FileCheck2, Target } from "lucide-react";
import ScoreGauge from "./ScoreGauge";

const CategoryCard = ({
  title,
  score,
  icon,
}: {
  title: string;
  score: number;
  icon: string;
}) => {
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

  return (
    <div className="glass-panel p-4 rounded-xl border border-[var(--glass-border)] flex items-center justify-between group hover:bg-[var(--bg-secondary)] transition-colors">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg ${bgColor} ${textColor} flex items-center justify-center border ${borderColor} group-hover:scale-110 transition-transform`}
        >
          <span className="material-symbols-outlined text-lg">{icon}</span>
        </div>
        <span className="font-bold text-[10px] uppercase tracking-widest text-white/40">
          {title}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`text-2xl font-black font-display tracking-tight ${textColor}`}
        >
          {score}
        </span>
        <span className="text-[10px] font-bold text-white/20">/100</span>
      </div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  const score = feedback.overallScore;
  const isExcellent = score >= 80;
  const isGood = score >= 60 && score < 80;

  const scoreColorClass = isExcellent
    ? "text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]"
    : isGood
      ? "text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]"
      : "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]";

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Overall Score Card */}
      <div className="glass-panel-heavy p-8 rounded-3xl border border-[var(--glass-border)] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
        {/* Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="flex flex-col gap-2 z-10 text-center md:text-left">
          <div className="inline-flex items-center justify-center md:justify-start gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2 w-fit mx-auto md:mx-0">
            <span className="material-symbols-outlined text-sm">
              auto_awesome
            </span>
            AI Analysis Complete
          </div>
          <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">
            Overall Impact Score
          </h2>
          <p className="font-body text-sm text-white/50 max-w-sm leading-relaxed mt-2">
            This score reflects your resume's ability to pass ATS filters and
            impress human recruiters.
          </p>
        </div>

        {/* Circular Gauge */}
        <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0 z-10">
          <svg
            className="w-full h-full -rotate-90 transform origin-center"
            viewBox="0 0 36 36"
          >
            <path
              className="text-[var(--glass-surface)]"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            ></path>
            <path
              className={scoreColorClass}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray={`${score}, 100`}
              strokeWidth="2.5"
              strokeLinecap="round"
            ></path>
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span
              className={`text-5xl font-black font-display tracking-tighter ${scoreColorClass.split(" ")[0]}`}
            >
              {score}
            </span>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <h3 className="text-xl font-bold font-display flex items-center gap-2 mt-2 text-[var(--text-primary)]">
        <span className="material-symbols-outlined text-primary">
          analytics
        </span>
        Category Breakdown
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CategoryCard
          title="Tone & Style"
          score={feedback.toneAndStyle.score}
          icon="draw"
        />
        <CategoryCard
          title="Content Quality"
          score={feedback.content.score}
          icon="article"
        />
        <CategoryCard
          title="Structure"
          score={feedback.structure.score}
          icon="schema"
        />
        <CategoryCard
          title="Skills Match"
          score={feedback.skills.score}
          icon="military_tech"
        />
      </div>
    </div>
  );
};

export default Summary;
