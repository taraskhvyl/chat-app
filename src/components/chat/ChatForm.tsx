"use client";

import { submitMessage } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Message } from "@/types/message";
import { memo, useRef, useState } from "react";

interface ChatFormProps {
  author: string;
  onMessageSent?: (message: Message) => void;
}

const ChatInput = memo(
  function ChatInput({ onSubmit }: { onSubmit: (message: string) => void }) {
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.SubmitEvent) => {
      e.preventDefault();
      if (!message.trim()) return;
      onSubmit(message);
      setMessage("");
    };

    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          className="flex-1 bg-white"
          aria-label="Message"
          autoFocus
        />
        <Button
          type="submit"
          variant="destructive"
          disabled={!message.trim()}
          aria-label="Send message"
        >
          Send
        </Button>
      </form>
    );
  },
  () => true
);

export function ChatForm({ author, onMessageSent }: ChatFormProps) {
  const [error, setError] = useState<string | null>(null);
  const isPendingRef = useRef(false);

  async function handleMessageSubmit(message: string) {
    if (isPendingRef.current) return;

    isPendingRef.current = true;
    setError(null);

    const formData = new FormData();
    formData.set("message", message);
    formData.set("author", author);

    const result = await submitMessage(formData);
    isPendingRef.current = false;

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.message) {
      onMessageSent?.(result.message);
    }
  }

  return (
    <div className="flex flex-col gap-2 bg-blue-600 p-4">
      <ChatInput onSubmit={handleMessageSubmit} />
      {error && (
        <p className="text-sm text-red-200" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
