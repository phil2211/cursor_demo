import { useState } from "react";
import { updateFeedback } from "../api/feedback";
import type { Feedback, Sentiment } from "../types/feedback";

const SENTIMENTS: { value: Sentiment; label: string }[] = [
  { value: "positive", label: "Positive" },
  { value: "neutral", label: "Neutral" },
  { value: "negative", label: "Negative" },
];

const chipStyles: Record<Sentiment, { base: string; selected: string }> = {
  positive: {
    base: "border-emerald-200 text-emerald-700 hover:bg-emerald-50",
    selected: "border-emerald-500 bg-emerald-100 text-emerald-800",
  },
  neutral: {
    base: "border-slate-200 text-slate-600 hover:bg-slate-50",
    selected: "border-slate-400 bg-slate-100 text-slate-800",
  },
  negative: {
    base: "border-amber-200 text-amber-700 hover:bg-amber-50",
    selected: "border-amber-500 bg-amber-100 text-amber-800",
  },
};

interface SentimentChipsProps {
  feedbackId: number;
  value: Sentiment | null;
  onUpdated: (updated: Feedback) => void;
  disabled?: boolean;
}

export function SentimentChips({
  feedbackId,
  value,
  onUpdated,
  disabled = false,
}: SentimentChipsProps) {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(sentiment: Sentiment) {
    if (disabled || updating || sentiment === value) return;

    setError(null);
    setUpdating(true);
    try {
      const updated = await updateFeedback(feedbackId, { sentiment });
      onUpdated(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update sentiment.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {SENTIMENTS.map(({ value: sentiment, label }) => {
          const isSelected = value === sentiment;
          const styles = chipStyles[sentiment];
          return (
            <button
              key={sentiment}
              type="button"
              data-testid={`sentiment-chip-${sentiment}`}
              disabled={disabled || updating}
              onClick={() => void handleSelect(sentiment)}
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                isSelected ? styles.selected : styles.base
              }`}
            >
              {label}
            </button>
          );
        })}
        {value === null && (
          <span className="self-center text-xs text-slate-400">Untagged</span>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
