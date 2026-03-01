"use client";

import { Message } from "./Message";
import { useLoadMoreOnScroll } from "@/hooks/useLoadMoreOnScroll";
import type { Message as MessageType } from "@/types/message";

interface MessageListProps {
  messages: MessageType[];
  currentAuthor?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}

export function MessageList({
  messages,
  currentAuthor = "",
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  scrollContainerRef,
}: MessageListProps) {
  const sentinelRef = useLoadMoreOnScroll({
    onLoadMore: onLoadMore ?? (() => {}),
    hasMore,
    isLoadingMore,
    scrollContainerRef,
  });

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-zinc-500">
        No messages yet. Be the first to say hello!
      </div>
    );
  }

  const reversedMessages = [...messages].reverse();

  return (
    <div className="flex flex-col-reverse gap-3 p-4" data-testid="message-list">
      {reversedMessages.map((msg, index) => (
        <Message
          key={msg.id || `msg-${msg.createdAt}-${index}`}
          message={msg}
          isOwn={msg.author.toLowerCase() === currentAuthor.toLowerCase()}
        />
      ))}
      {isLoadingMore && (
        <div className="py-2 text-center text-sm text-zinc-500">Loading...</div>
      )}
      {hasMore && <div ref={sentinelRef} className="h-1" aria-hidden="true" />}
    </div>
  );
}
