import { useState, type FormEvent } from "react";
import { createFeedback } from "../api/feedback";

interface FeedbackFormProps {
  onSubmitted: () => void;
}

const MESSAGE_MAX_LENGTH = 500;

export function FeedbackForm({ onSubmitted }: FeedbackFormProps) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await createFeedback({
        message: message.trim(),
        email: email.trim() || undefined,
      });
      setMessage("");
      setEmail("");
      onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">Submit feedback</h2>
      <p className="mt-1 text-sm text-slate-500">
        Share a note from a customer or teammate.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-slate-700"
          >
            Message
          </label>
          <textarea
            id="message"
            data-testid="feedback-message"
            required
            rows={4}
            maxLength={MESSAGE_MAX_LENGTH}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What did they say?"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <p
            data-testid="feedback-message-counter"
            className={`mt-1 text-right text-xs ${
              message.length >= MESSAGE_MAX_LENGTH
                ? "text-amber-600"
                : "text-slate-400"
            }`}
            aria-live="polite"
          >
            {message.length} / {MESSAGE_MAX_LENGTH}
          </p>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700"
          >
            Email <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input
            id="email"
            type="email"
            data-testid="feedback-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="customer@example.com"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        data-testid="feedback-submit"
        disabled={submitting || !message.trim()}
        className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Submit feedback"}
      </button>
    </form>
  );
}
