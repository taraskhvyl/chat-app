"use client";

import { forwardRef } from "react";

interface ChatLayoutProps {
  messagesArea: React.ReactNode;
  input: React.ReactNode;
}

export const ChatLayout = forwardRef<HTMLDivElement, ChatLayoutProps>(
  ({ messagesArea, input }, ref) => (
    <div className="chat-bg mx-auto flex h-screen max-w-2xl flex-col bg-zinc-100/95">
      <div
        ref={ref}
        className="flex min-h-0 flex-1 flex-col-reverse overflow-y-auto"
        role="log"
        aria-live="polite"
      >
        {messagesArea}
      </div>
      {input}
    </div>
  )
);

ChatLayout.displayName = "ChatLayout";
