import { useCallback, useEffect, useState } from "react";
import { fetchFeedback } from "./api/feedback";
import { FeedbackForm } from "./components/FeedbackForm";
import { FeedbackList } from "./components/FeedbackList";
import type { Feedback } from "./types/feedback";

export default function App() {
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
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

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <FeedbackForm
            onSubmitted={() => {
              setLoading(true);
              void loadFeedback();
            }}
          />
          <FeedbackList items={items} loading={loading} />
        </div>
      </main>
    </div>
  );
}
