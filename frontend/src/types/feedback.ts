export type Sentiment = "positive" | "neutral" | "negative";
export type Status = "new" | "reviewing" | "done";

export interface Feedback {
  id: number;
  message: string;
  email: string | null;
  sentiment: Sentiment | null;
  status: Status;
  created_at: string;
}

export interface FeedbackCreate {
  message: string;
  email?: string;
}

export interface FeedbackUpdate {
  sentiment?: Sentiment | null;
  status?: Status;
}
