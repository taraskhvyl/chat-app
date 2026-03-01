"use client";

import { useRef, useCallback, useEffect } from "react";
import { MessageList } from "./MessageList";
import { ChatForm } from "./ChatForm";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { useChatAuthor } from "@/hooks/useChatAuthor";
import { useScrollOnMessagesChange } from "@/hooks/useScrollOnMessagesChange";
import type { Message } from "@/types/message";

interface ChatContainerProps {
  initialMessages: Message[];
}

export function ChatContainer({ initialMessages }: ChatContainerProps) {
  const currentAuthor = useChatAuthor();
  const {
    messages,
    loadMore,
    hasMore,
    isLoadingMore,
    isLoadingInitial,
    addMessage,
  } = useRealtimeMessages(initialMessages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const handleLoadMore = useScrollOnMessagesChange(
    scrollRef,
    messages,
    loadMore
  );

  const addMessageRef = useRef(addMessage);

  useEffect(() => {
    addMessageRef.current = addMessage;
  }, [addMessage]);

  const handleMessageSent = useCallback((message: Message) => {
    addMessageRef.current(message);
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    });
  }, []);

  return (
    <div className="chat-bg mx-auto flex h-screen max-w-2xl flex-col bg-zinc-100/95">
      <div
        ref={scrollRef}
        className="flex min-h-0 flex-1 flex-col-reverse overflow-y-auto"
        role="log"
        aria-live="polite"
      >
        <MessageList
          messages={messages}
          currentAuthor={currentAuthor}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          isLoadingInitial={isLoadingInitial}
          scrollContainerRef={scrollRef}
        />
      </div>
      <ChatForm author={currentAuthor} onMessageSent={handleMessageSent} />
    </div>
  );
}
