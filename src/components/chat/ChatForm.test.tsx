import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChatForm } from "./ChatForm";

vi.mock("@/app/actions", () => ({
  submitMessage: vi.fn(),
}));

const { submitMessage } = await import("@/app/actions");

describe("ChatForm", () => {
  it("renders form with input and button", () => {
    render(<ChatForm author="TestUser" />);
    expect(screen.getByPlaceholderText("Message")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("disables send when message is empty", () => {
    render(<ChatForm author="TestUser" />);
    const sendBtn = screen.getByRole("button", { name: /send/i });
    expect(sendBtn).toBeDisabled();
  });

  it("calls submitMessage on form submit", async () => {
    vi.mocked(submitMessage).mockResolvedValue({
      success: true,
      message: {
        id: "1",
        message: "Hello",
        author: "TestUser",
        createdAt: "2024-01-01T12:00:00Z",
      },
    });
    render(<ChatForm author="TestUser" />);

    fireEvent.change(screen.getByPlaceholderText("Message"), {
      target: { value: "Hello" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(submitMessage).toHaveBeenCalled();
    });
  });
});
