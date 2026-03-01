import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitMessage } from "./actions";

vi.mock("@/lib/api", () => ({
  sendMessage: vi.fn(),
}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const { sendMessage } = await import("@/lib/api");

describe("submitMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when validation fails", async () => {
    const formData = new FormData();
    formData.set("message", "");
    formData.set("author", "John");

    const result = await submitMessage(formData);

    expect(result).toEqual({ error: "Message is required" });
    expect(sendMessage).not.toHaveBeenCalled();
  });

  it("returns success and message when sent", async () => {
    const created = {
      id: "1",
      message: "Hello",
      author: "John",
      createdAt: "2024-01-01T12:00:00Z",
    };
    vi.mocked(sendMessage).mockResolvedValue(created);
    const formData = new FormData();
    formData.set("message", "Hello");
    formData.set("author", "John");

    const result = await submitMessage(formData);

    expect(result).toEqual({ success: true, message: created });
    expect(sendMessage).toHaveBeenCalledWith({
      message: "Hello",
      author: "John",
    });
  });

  it("returns error when API fails", async () => {
    vi.mocked(sendMessage).mockRejectedValue(new Error("Network error"));
    const formData = new FormData();
    formData.set("message", "Hello");
    formData.set("author", "John");

    const result = await submitMessage(formData);

    expect(result).toEqual({ error: "Network error" });
  });
});
