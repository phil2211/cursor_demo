import type { Feedback, FeedbackUpdate, Sentiment, Status } from "../types/feedback";

interface FeedbackCardProps {
  item: Feedback;
  onUpdate: (id: number, payload: FeedbackUpdate) => void;
  updating?: boolean;
}

const STATUSES: Status[] = ["new", "reviewing", "done"];

const SENTIMENT_OPTIONS: { value: Sentiment | ""; label: string }[] = [
  { value: "", label: "Untagged" },
  { value: "positive", label: "Positive" },
  { value: "neutral", label: "Neutral" },
  { value: "negative", label: "Negative" },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function sentimentBorderClass(sentiment: Sentiment | null): string {
  switch (sentiment) {
    case "positive":
      return "border-emerald-200 bg-emerald-50/40";
    case "neutral":
      return "border-slate-200 bg-slate-50/60";
    case "negative":
      return "border-rose-200 bg-rose-50/40";
    default:
      return "border-slate-200 bg-white";
  }
}

function statusLabel(status: Status): string {
  switch (status) {
    case "new":
      return "New";
    case "reviewing":
      return "Reviewing";
    case "done":
      return "Done";
  }
}

export function FeedbackCard({ item, onUpdate, updating = false }: FeedbackCardProps) {
  const currentIndex = STATUSES.indexOf(item.status);
  const canMovePrev = currentIndex > 0;
  const canMoveNext = currentIndex < STATUSES.length - 1;

  function moveStatus(direction: "prev" | "next") {
    const nextIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
    const nextStatus = STATUSES[nextIndex];
    if (nextStatus) {
      onUpdate(item.id, { status: nextStatus });
    }
  }

  return (
    <article
      data-testid={`feedback-item-${item.id}`}
      className={`rounded-lg border p-4 shadow-sm transition ${sentimentBorderClass(item.sentiment)}`}
    >
      <p className="text-sm text-slate-900">{item.message}</p>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
        <time dateTime={item.created_at}>{formatDate(item.created_at)}</time>
        {item.email && (
          <>
            <span aria-hidden="true">·</span>
            <span>{item.email}</span>
          </>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor={`sentiment-${item.id}`}>
          Sentiment
        </label>
        <select
          id={`sentiment-${item.id}`}
          data-testid={`feedback-sentiment-${item.id}`}
          value={item.sentiment ?? ""}
          disabled={updating}
          onChange={(e) => {
            const value = e.target.value;
            onUpdate(item.id, {
              sentiment: value === "" ? null : (value as Sentiment),
            });
          }}
          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
        >
          {SENTIMENT_OPTIONS.map((option) => (
            <option key={option.value || "unset"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            data-testid={`feedback-status-prev-${item.id}`}
            disabled={!canMovePrev || updating}
            onClick={() => moveStatus("prev")}
            aria-label="Move to previous status"
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ←
          </button>
          <span
            data-testid={`feedback-status-${item.id}`}
            className="min-w-[4.5rem] text-center text-xs font-medium capitalize text-slate-600"
          >
            {statusLabel(item.status)}
          </span>
          <button
            type="button"
            data-testid={`feedback-status-next-${item.id}`}
            disabled={!canMoveNext || updating}
            onClick={() => moveStatus("next")}
            aria-label="Move to next status"
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            →
          </button>
        </div>
      </div>
    </article>
  );
}
