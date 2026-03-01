import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MessageInput } from "@/components/chat/MessageInput";

vi.mock("@/app/actions", () => ({
  submitMessage: vi.fn(),
}));

const { submitMessage } = await import("@/app/actions");

describe("MessageInput", () => {
  it("renders form with inputs and button", () => {
    render(<MessageInput />);
    expect(screen.getByPlaceholderText("Your name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Message")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("disables send when message is empty", () => {
    render(<MessageInput />);
    const sendBtn = screen.getByRole("button", { name: /send/i });
    expect(sendBtn).toBeDisabled();
  });

  it("calls submitMessage on form submit", async () => {
    vi.mocked(submitMessage).mockResolvedValue({ success: true });
    render(<MessageInput />);

    fireEvent.change(screen.getByPlaceholderText("Your name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByPlaceholderText("Message"), {
      target: { value: "Hello" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(submitMessage).toHaveBeenCalled();
    });
  });
});
