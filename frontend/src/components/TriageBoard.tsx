import type { Feedback, FeedbackUpdate, Status } from "../types/feedback";
import { FeedbackCard } from "./FeedbackCard";

interface TriageBoardProps {
  items: Feedback[];
  loading: boolean;
  updatingId?: number | null;
  onUpdate: (id: number, payload: FeedbackUpdate) => void;
}

const COLUMNS: { status: Status; title: string; description: string }[] = [
  { status: "new", title: "New", description: "Fresh submissions" },
  {
    status: "reviewing",
    title: "Reviewing",
    description: "In progress with the team",
  },
  { status: "done", title: "Done", description: "Resolved or archived" },
];

export function TriageBoard({
  items,
  loading,
  updatingId = null,
  onUpdate,
}: TriageBoardProps) {
  if (loading) {
    return (
      <div
        data-testid="feedback-loading"
        className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm"
      >
        Loading triage board…
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
    <section
      data-testid="triage-board"
      className="rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Triage board</h2>
        <p className="text-sm text-slate-500">
          {items.length} item{items.length === 1 ? "" : "s"} · tag sentiment and
          move cards through the workflow
        </p>
      </div>

      <div
        className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
        data-testid="triage-columns"
      >
        {grouped.map((column) => (
          <div
            key={column.status}
            data-testid={`triage-column-${column.status}`}
            className="flex min-h-[12rem] flex-col rounded-lg bg-slate-50 p-3"
          >
            <div className="mb-3 px-1">
              <h3 className="text-sm font-semibold text-slate-900">
                {column.title}
              </h3>
              <p className="text-xs text-slate-500">{column.description}</p>
              <span
                data-testid={`triage-column-count-${column.status}`}
                className="mt-2 inline-flex rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200"
              >
                {column.items.length} item
                {column.items.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-3">
              {column.items.length === 0 ? (
                <p className="rounded-md border border-dashed border-slate-200 px-3 py-6 text-center text-xs text-slate-400">
                  No items
                </p>
              ) : (
                column.items.map((item) => (
                  <FeedbackCard
                    key={item.id}
                    item={item}
                    onUpdate={onUpdate}
                    updating={updatingId === item.id}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
