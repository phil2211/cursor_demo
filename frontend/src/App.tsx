import { useCallback, useEffect, useState } from "react";
import { fetchFeedback, updateFeedback } from "./api/feedback";
import { FeedbackForm } from "./components/FeedbackForm";
import { TriageBoard } from "./components/TriageBoard";
import type { Feedback, FeedbackUpdate } from "./types/feedback";

export default function App() {
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadFeedback = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchFeedback();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load feedback.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFeedback();
  }, [loadFeedback]);

  async function handleUpdateFeedback(id: number, payload: FeedbackUpdate) {
    const previous = items.find((item) => item.id === id);
    if (!previous) return;

    const optimistic: Feedback = {
      ...previous,
      ...payload,
      sentiment:
        payload.sentiment !== undefined ? payload.sentiment : previous.sentiment,
      status: payload.status ?? previous.status,
    };

    setUpdatingId(id);
    setError(null);
    setItems((current) =>
      current.map((item) => (item.id === id ? optimistic : item))
    );

    try {
      const updated = await updateFeedback(id, payload);
      setItems((current) =>
        current.map((item) => (item.id === id ? updated : item))
      );
    } catch (err) {
      setItems((current) =>
        current.map((item) => (item.id === id ? previous : item))
      );
      setError(err instanceof Error ? err.message : "Could not update feedback.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Feedback Pulse
            </h1>
            <p className="text-sm text-slate-500">
              Customer feedback inbox for your product team
            </p>
          </div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            MVP
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {error && (
          <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-8">
          <FeedbackForm
            onSubmitted={() => {
              setLoading(true);
              void loadFeedback();
            }}
          />
          <TriageBoard
            items={items}
            loading={loading}
            updatingId={updatingId}
            onUpdate={handleUpdateFeedback}
          />
        </div>
      </main>
    </div>
  );
}
