import { describe, it, expect } from "vitest";
import { sendMessageSchema } from "./validation";

describe("sendMessageSchema", () => {
  it("accepts valid input", () => {
    const result = sendMessageSchema.safeParse({
      message: "Hello",
      author: "John",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty message", () => {
    const result = sendMessageSchema.safeParse({
      message: "",
      author: "John",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty author", () => {
    const result = sendMessageSchema.safeParse({
      message: "Hello",
      author: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects message over 5000 chars", () => {
    const result = sendMessageSchema.safeParse({
      message: "a".repeat(5001),
      author: "John",
    });
    expect(result.success).toBe(false);
  });
});
