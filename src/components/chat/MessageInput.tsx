"use client";

import { useState, useEffect } from "react";
import { submitMessage } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageInputProps {
  defaultAuthor?: string;
  onAuthorChange?: (author: string) => void;
}

export function MessageInput({
  defaultAuthor = "",
  onAuthorChange,
}: MessageInputProps) {
  const [author, setAuthor] = useState(defaultAuthor);

  useEffect(() => {
    setAuthor(defaultAuthor);
  }, [defaultAuthor]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData();
    formData.set("message", message);
    formData.set("author", author);

    const result = await submitMessage(formData);
    setIsPending(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setMessage("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 bg-blue-600 p-4"
      aria-label="Send message"
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="text"
          name="author"
          value={author}
          onChange={(e) => {
            const v = e.target.value;
            setAuthor(v);
            onAuthorChange?.(v);
          }}
          placeholder="Your name"
          className="flex-1 bg-white"
          aria-label="Your name"
          disabled={isPending}
        />
        <Input
          type="text"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          className="flex-[3] bg-white"
          aria-label="Message"
          disabled={isPending}
        />
        <Button
          type="submit"
          variant="destructive"
          disabled={isPending || !message.trim() || !author.trim()}
          aria-label="Send message"
        >
          {isPending ? "Sending..." : "Send"}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-red-200" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
