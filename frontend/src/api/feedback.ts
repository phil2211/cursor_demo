import type { Feedback, FeedbackCreate, FeedbackUpdate } from "../types/feedback";

const API_BASE = "/api";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let detail = "Something went wrong. Please try again.";
    try {
      const body = await response.json();
      if (typeof body.detail === "string") {
        detail = body.detail;
      } else if (Array.isArray(body.detail)) {
        detail = body.detail[0]?.msg ?? detail;
      }
    } catch {
      // use default message
    }
    throw new Error(detail);
  }
  return response.json() as Promise<T>;
}

export async function fetchFeedback(): Promise<Feedback[]> {
  const response = await fetch(`${API_BASE}/feedback`);
  return handleResponse<Feedback[]>(response);
}

export async function createFeedback(
  payload: FeedbackCreate
): Promise<Feedback> {
  const response = await fetch(`${API_BASE}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Feedback>(response);
}

export async function updateFeedback(
  id: number,
  payload: FeedbackUpdate
): Promise<Feedback> {
  const response = await fetch(`${API_BASE}/feedback/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Feedback>(response);
}
