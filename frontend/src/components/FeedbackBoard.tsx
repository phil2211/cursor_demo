import { useState } from "react";
import { updateFeedback } from "../api/feedback";
import type { Feedback, Sentiment, Status } from "../types/feedback";

interface FeedbackBoardProps {
  items: Feedback[];
  loading: boolean;
  onUpdated: () => void;
}

const COLUMNS: { status: Status; label: string }[] = [
  { status: "new", label: "New" },
  { status: "reviewing", label: "Reviewing" },
  { status: "done", label: "Done" },
];

const SENTIMENT_OPTIONS: { value: Sentiment | ""; label: string }[] = [
  { value: "", label: "Unset" },
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

function sentimentCardClass(sentiment: Sentiment | null): string {
  switch (sentiment) {
    case "positive":
      return "bg-emerald-50 border-emerald-200";
    case "negative":
      return "bg-red-50 border-red-200";
    default:
      return "bg-white border-slate-200";
  }
}

function columnCountBadgeClass(status: Status): string {
  const base = "rounded-full px-2 py-0.5 text-xs font-medium ring-1";
  switch (status) {
    case "new":
      return `${base} bg-emerald-50 text-emerald-700 ring-emerald-200`;
    case "reviewing":
      return `${base} bg-indigo-50 text-indigo-700 ring-indigo-200`;
    case "done":
      return `${base} bg-amber-50 text-amber-700 ring-amber-200`;
  }
}

interface FeedbackCardProps {
  item: Feedback;
  onUpdated: () => void;
}

function FeedbackCard({ item, onUpdated }: FeedbackCardProps) {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStatusChange(status: Status) {
    setError(null);
    setUpdating(true);
    try {
      await updateFeedback(item.id, { status });
      onUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update status.");
    } finally {
      setUpdating(false);
    }
  }

  async function handleSentimentChange(value: string) {
    setError(null);
    setUpdating(true);
    try {
      await updateFeedback(item.id, {
        sentiment: value === "" ? null : (value as Sentiment),
      });
      onUpdated();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update sentiment."
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <article
      data-testid={`feedback-item-${item.id}`}
      className={`rounded-lg border p-4 shadow-sm ${sentimentCardClass(item.sentiment)}`}
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
          onChange={(e) => void handleSentimentChange(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
        >
          {SENTIMENT_OPTIONS.map((option) => (
            <option key={option.value || "unset"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {item.status === "new" && (
          <button
            type="button"
            data-testid={`feedback-start-review-${item.id}`}
            disabled={updating}
            onClick={() => void handleStatusChange("reviewing")}
            className="rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start review
          </button>
        )}

        {item.status === "reviewing" && (
          <>
            <button
              type="button"
              data-testid={`feedback-mark-done-${item.id}`}
              disabled={updating}
              onClick={() => void handleStatusChange("done")}
              className="rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mark done
            </button>
            <button
              type="button"
              data-testid={`feedback-back-to-new-${item.id}`}
              disabled={updating}
              onClick={() => void handleStatusChange("new")}
              className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back to new
            </button>
          </>
        )}

        {item.status === "done" && (
          <button
            type="button"
            data-testid={`feedback-reopen-${item.id}`}
            disabled={updating}
            onClick={() => void handleStatusChange("reviewing")}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reopen
          </button>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </article>
  );
}

export function FeedbackBoard({ items, loading, onUpdated }: FeedbackBoardProps) {
  if (loading) {
    return (
      <div
        data-testid="feedback-loading"
        className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm"
      >
        Loading inbox…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        data-testid="feedback-empty"
        className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm"
      >
        <p className="text-sm font-medium text-slate-700">No feedback yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Submit the first message to populate the board.
        </p>
      </div>
    );
  }

  const grouped = COLUMNS.map((column) => ({
    ...column,
    items: items.filter((item) => item.status === column.status),
  }));

  return (
    <div data-testid="feedback-board">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Triage board</h2>
        <p className="text-sm text-slate-500">
          {items.length} item{items.length === 1 ? "" : "s"} · tag sentiment and
          move through review
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {grouped.map((column) => (
          <section
            key={column.status}
            data-testid={`feedback-column-${column.status}`}
            className="rounded-xl border border-slate-200 bg-slate-50/80 p-4"
          >
            <header className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                {column.label}
              </h3>
              <span className={columnCountBadgeClass(column.status)}>
                {column.items.length}
              </span>
            </header>

            <div className="space-y-3">
              {column.items.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-6 text-center text-xs text-slate-500">
                  No items
                </p>
              ) : (
                column.items.map((item) => (
                  <FeedbackCard
                    key={item.id}
                    item={item}
                    onUpdated={onUpdated}
                  />
                ))
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
