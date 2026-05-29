import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeedbackForm } from "./FeedbackForm";

describe("FeedbackForm", () => {
  it("uses polished primary button styling for the submit action", () => {
    render(<FeedbackForm onSubmitted={() => undefined} />);

    const submitButton = screen.getByRole("button", {
      name: /submit feedback/i,
    });

    expect(submitButton).toHaveClass(
      "inline-flex",
      "items-center",
      "justify-center",
      "rounded-full",
      "shadow-sm",
      "focus-visible:outline",
      "focus-visible:outline-2",
      "focus-visible:outline-offset-2",
      "focus-visible:outline-indigo-600",
      "disabled:bg-slate-300",
      "disabled:text-slate-500"
    );
  });
});
