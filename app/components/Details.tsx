import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  const isExcellent = score >= 80;
  const isGood = score >= 60 && score < 80;

  return (
    <div
      className={cn(
        "flex flex-row gap-1 items-center px-3 py-1 rounded-full text-xs font-bold border",
        isExcellent
          ? "bg-green-500/10 border-green-500/20 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
          : isGood
            ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]"
            : "bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
      )}
    >
      <TrendingUp className="w-3 h-3" />
      <span>{score}/100</span>
    </div>
  );
};

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  return (
    <div className="flex flex-row gap-4 items-center py-3 w-full justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[var(--form-bg)] border border-[var(--glass-border)] flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-sm">psychology</span>
        </div>
        <p className="text-lg font-bold text-[var(--text-primary)] font-display tracking-wide">
          {title}
        </p>
      </div>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
    <div className="flex flex-col gap-4 w-full pt-2 pb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tips.map((tip, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col gap-2 rounded-xl p-4 border transition-all duration-300",
              tip.type === "good"
                ? "bg-green-500/5 hover:bg-green-500/10 border-green-500/20"
                : "bg-yellow-500/5 hover:bg-yellow-500/10 border-yellow-500/20",
            )}
          >
            <div className="flex items-start gap-3">
              {tip.type === "good" ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex flex-col gap-1">
                <p
                  className={cn(
                    "text-sm font-bold",
                    tip.type === "good"
                      ? "text-green-600 dark:text-green-400"
                      : "text-yellow-600 dark:text-yellow-400",
                  )}
                >
                  {tip.tip}
                </p>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {tip.explanation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-xl font-bold font-display flex items-center gap-2 mt-4 text-[var(--text-primary)]">
        <span className="material-symbols-outlined text-primary">
          plagiarism
        </span>
        Detailed Insights
      </h3>

      <div className="glass-panel rounded-2xl overflow-hidden border border-[var(--glass-border)] divide-y divide-[var(--glass-border)] shadow-lg">
        <Accordion>
          <AccordionItem
            id="tone-style"
            className="px-6 data-[state=open]:bg-[var(--glass-surface)] transition-colors"
          >
            <AccordionHeader itemId="tone-style">
              <CategoryHeader
                title="Tone & Style"
                categoryScore={feedback.toneAndStyle.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="tone-style">
              <CategoryContent tips={feedback.toneAndStyle.tips} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            id="content"
            className="px-6 data-[state=open]:bg-[var(--glass-surface)] transition-colors"
          >
            <AccordionHeader itemId="content">
              <CategoryHeader
                title="Content Analysis"
                categoryScore={feedback.content.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="content">
              <CategoryContent tips={feedback.content.tips} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            id="structure"
            className="px-6 data-[state=open]:bg-[var(--glass-surface)] transition-colors"
          >
            <AccordionHeader itemId="structure">
              <CategoryHeader
                title="Structure & Formatting"
                categoryScore={feedback.structure.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="structure">
              <CategoryContent tips={feedback.structure.tips} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            id="skills"
            className="px-6 data-[state=open]:bg-[var(--glass-surface)] transition-colors"
          >
            <AccordionHeader itemId="skills">
              <CategoryHeader
                title="Skills Alignment"
                categoryScore={feedback.skills.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="skills">
              <CategoryContent tips={feedback.skills.tips} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Details;
