import type { Feedback } from "../types/feedback";

interface FeedbackListProps {
  items: Feedback[];
  loading: boolean;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function FeedbackList({ items, loading }: FeedbackListProps) {
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
          Submit the first message to populate the inbox.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Inbox</h2>
        <p className="text-sm text-slate-500">
          {items.length} item{items.length === 1 ? "" : "s"} · newest first
        </p>
      </div>

      <ul className="divide-y divide-slate-100" data-testid="feedback-list">
        {items.map((item) => (
          <li
            key={item.id}
            data-testid={`feedback-item-${item.id}`}
            className="px-6 py-4"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-slate-900">{item.message}</p>
              <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium capitalize text-slate-600">
                {item.status}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <time dateTime={item.created_at}>{formatDate(item.created_at)}</time>
              {item.email && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{item.email}</span>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
