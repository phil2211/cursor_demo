import { useState } from "react";
import { updateFeedback } from "../api/feedback";
import type { Feedback, Sentiment, Status } from "../types/feedback";
import { SentimentChips } from "./SentimentChips";

const COLUMNS: { status: Status; label: string }[] = [
  { status: "new", label: "New" },
  { status: "reviewing", label: "Reviewing" },
  { status: "done", label: "Done" },
];

const STATUS_LABELS: Record<Status, string> = {
  new: "New",
  reviewing: "Reviewing",
  done: "Done",
};

const cardStyles: Record<Sentiment, string> = {
  positive: "border-emerald-200 bg-emerald-50",
  neutral: "border-slate-300 bg-slate-100",
  negative: "border-amber-200 bg-amber-50",
};

function getCardClassName(sentiment: Sentiment | null): string {
  const base = "rounded-lg border p-3 shadow-sm";
  if (sentiment === null) {
    return `${base} border-slate-200 bg-white`;
  }
  return `${base} ${cardStyles[sentiment]}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

interface TriageBoardProps {
  items: Feedback[];
  loading: boolean;
  onItemUpdated: (updated: Feedback) => void;
}

export function TriageBoard({ items, loading, onItemUpdated }: TriageBoardProps) {
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

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {COLUMNS.map(({ status, label }) => {
        const columnItems = items.filter((item) => item.status === status);
        return (
          <div
            key={status}
            data-testid={`triage-column-${status}`}
            className="rounded-xl border border-slate-200 bg-slate-50 shadow-sm"
          >
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-900">{label}</h2>
              <p className="text-xs text-slate-500">
                {columnItems.length} item{columnItems.length === 1 ? "" : "s"}
              </p>
            </div>
            <ul className="space-y-3 p-3">
              {columnItems.length === 0 ? (
                <li className="rounded-lg border border-dashed border-slate-200 bg-white px-3 py-6 text-center text-xs text-slate-400">
                  No items
                </li>
              ) : (
                columnItems.map((item) => (
                  <TriageCard
                    key={item.id}
                    item={item}
                    onItemUpdated={onItemUpdated}
                  />
                ))
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

interface TriageCardProps {
  item: Feedback;
  onItemUpdated: (updated: Feedback) => void;
}

function TriageCard({ item, onItemUpdated }: TriageCardProps) {
  const [moving, setMoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const otherStatuses = COLUMNS.map((c) => c.status).filter(
    (s) => s !== item.status
  );

  async function handleMoveStatus(status: Status) {
    if (moving) return;

    setError(null);
    setMoving(true);
    try {
      const updated = await updateFeedback(item.id, { status });
      onItemUpdated(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update status.");
    } finally {
      setMoving(false);
    }
  }

  return (
    <li
      data-testid={`triage-card-${item.id}`}
      className={getCardClassName(item.sentiment)}
    >
      <p className="text-sm text-slate-900">{item.message}</p>
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
        <time dateTime={item.created_at}>{formatDate(item.created_at)}</time>
        {item.email && (
          <>
            <span aria-hidden="true">·</span>
            <span>{item.email}</span>
          </>
        )}
      </div>

      <div className="mt-3">
        <SentimentChips
          feedbackId={item.id}
          value={item.sentiment}
          onUpdated={onItemUpdated}
          disabled={moving}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {otherStatuses.map((status) => (
          <button
            key={status}
            type="button"
            data-testid={`status-move-${status}`}
            disabled={moving}
            onClick={() => void handleMoveStatus(status)}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </li>
  );
}
