import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";

vi.mock("@/lib/api", () => ({
  fetchMessages: vi.fn(),
}));

const { fetchMessages } = await import("@/lib/api");

describe("GET /api/messages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns messages from fetchMessages", async () => {
    const mockMessages = [
      {
        id: "1",
        message: "Hi",
        author: "Alice",
        createdAt: "2024-01-01T12:00:00Z",
      },
    ];
    vi.mocked(fetchMessages).mockResolvedValue(mockMessages);

    const request = new Request("http://localhost/api/messages");
    const response = await GET(request as never);
    const data = await response.json();

    expect(data).toEqual(mockMessages);
    expect(fetchMessages).toHaveBeenCalledWith({
      after: undefined,
      before: undefined,
      limit: 50,
    });
  });

  it("passes after and limit from query params", async () => {
    vi.mocked(fetchMessages).mockResolvedValue([]);

    const request = new Request(
      "http://localhost/api/messages?after=msg123&limit=10"
    );
    await GET(request as never);

    expect(fetchMessages).toHaveBeenCalledWith({
      after: "msg123",
      before: undefined,
      limit: 10,
    });
  });
});
