import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MessageList } from "@/components/chat/MessageList";

const mockMessages = [
  {
    id: "1",
    message: "Hello",
    author: "Alice",
    createdAt: "2024-01-01T12:00:00.000Z",
  },
  {
    id: "2",
    message: "Hi there",
    author: "Bob",
    createdAt: "2024-01-01T12:01:00.000Z",
  },
];

describe("MessageList", () => {
  it("renders empty state when no messages", () => {
    render(<MessageList messages={[]} />);
    expect(screen.getByText(/no messages yet/i)).toBeInTheDocument();
  });

  it("renders messages", () => {
    render(<MessageList messages={mockMessages} />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi there")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("marks own messages with currentAuthor", () => {
    const { container } = render(
      <MessageList messages={mockMessages} currentAuthor="Alice" />
    );
    expect(container.querySelector(".self-end")).toBeInTheDocument();
  });
});
