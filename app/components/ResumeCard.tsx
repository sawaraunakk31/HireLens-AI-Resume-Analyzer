import { Link } from "react-router";
import { ArrowRight, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({ resume }: { resume: Resume }) => {
  const { id, companyName, jobTitle, feedback, imagePath } = resume;
  const { fs } = usePuterStore();
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const loadImage = async () => {
      if (!imagePath) return;
      try {
        const imageBlob = await fs.read(imagePath);
        if (imageBlob) {
          const url = URL.createObjectURL(
            new Blob([imageBlob], { type: "image/png" }),
          );
          setImageUrl(url);
        }
      } catch (err) {
        console.error("Failed to load resume image for card", err);
      }
    };
    loadImage();
  }, [imagePath, fs]);

  // Calculate a mock score color based on overallScore
  const score = feedback?.overallScore || 0;
  const isExcellent = score >= 80;
  const isGood = score >= 60 && score < 80;

  const scoreColorClass = isExcellent
    ? "text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.8)]"
    : isGood
      ? "text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]"
      : "text-rose-500 drop-shadow-[0_0_4px_rgba(244,63,94,0.8)]";

  const initials = companyName
    ? companyName.substring(0, 2).toUpperCase()
    : jobTitle
      ? jobTitle.substring(0, 2).toUpperCase()
      : "RE";

  return (
    <Link
      to={`/resume/${id}`}
      className="glass-panel rounded-xl overflow-hidden transition-all duration-300 glass-card-hover group cursor-pointer flex flex-col h-full p-0!"
    >
      {/* Top Image Banner */}
      <div className="relative w-full h-40 bg-gradient-to-br from-primary/20 to-purple-600/20 shrink-0 border-b border-[var(--glass-border)]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Resume thumbnail"
            className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity dark:contrast-125 dark:invert-[.85] dark:hue-rotate-180"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-purple-600">
            <span className="font-bold text-white text-4xl tracking-wider">
              {initials}
            </span>
          </div>
        )}

        {/* Circular Score Floating Badge */}
        <div className="absolute -bottom-6 right-5 z-10 rounded-full bg-[var(--bg-primary)] p-1 shadow-xl border border-[var(--glass-border)]">
          <div className="relative size-12 flex items-center justify-center bg-[var(--glass-surface)] backdrop-blur-md rounded-full">
            <svg
              className="absolute inset-0 size-full -rotate-90"
              viewBox="0 0 36 36"
            >
              <path
                className="text-[var(--glass-border)]"
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
              ></path>
            </svg>
            <span className="text-sm font-bold text-[var(--text-primary)] z-10">
              {score}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-4 pr-14">
          <h4 className="text-[var(--text-primary)] font-bold text-lg truncate">
            {jobTitle || "Resume Analysis"}
          </h4>
          <p className="text-[var(--text-secondary)] text-sm truncate">
            {companyName || "General Submission"}
          </p>
        </div>

        <div className="space-y-3 mb-6 flex-1">
          <div className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
            <Briefcase className="w-4 h-4 mt-0.5 text-primary shrink-0" />
            <p className="line-clamp-2 leading-relaxed">
              Comprehensive ATS parsing and AI analysis completed. Click to view
              detailed metrics and optimizations.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--glass-border)] mt-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-secondary)] font-medium">
              Ready for review
            </span>
            <div className="text-primary text-sm font-semibold transition-all group-hover:translate-x-1 flex items-center gap-1">
              View Feedback <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default ResumeCard;
