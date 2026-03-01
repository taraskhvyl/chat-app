import { describe, it, expect } from "vitest";
import { normalizeMessage } from "./api";

describe("normalizeMessage", () => {
  it("maps snake_case to camelCase", () => {
    const result = normalizeMessage({
      _id: "123",
      message: "Hi",
      author: "Alice",
      created_at: "2024-01-01T12:00:00Z",
    });

    expect(result).toEqual({
      id: "123",
      message: "Hi",
      author: "Alice",
      createdAt: "2024-01-01T12:00:00Z",
    });
  });

  it("prefers camelCase when both present", () => {
    const result = normalizeMessage({
      id: "a",
      _id: "b",
      createdAt: "x",
      created_at: "y",
    });

    expect(result.id).toBe("a");
    expect(result.createdAt).toBe("x");
  });
});
