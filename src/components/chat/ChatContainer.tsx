"use client";

import { useRef } from "react";
import { ChatLayout } from "./ChatLayout";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { useChatAuthor } from "@/hooks/useChatAuthor";
import { useScrollOnMessagesChange } from "@/hooks/useScrollOnMessagesChange";
import type { Message } from "@/types/message";

interface ChatContainerProps {
  initialMessages: Message[];
}

export function ChatContainer({ initialMessages }: ChatContainerProps) {
  const [currentAuthor, setCurrentAuthor] = useChatAuthor();
  const { messages, loadMore, hasMore, isLoadingMore } =
    useRealtimeMessages(initialMessages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const handleLoadMore = useScrollOnMessagesChange(
    scrollRef,
    messages,
    loadMore
  );

  return (
    <ChatLayout
      ref={scrollRef}
      messagesArea={
        <MessageList
          messages={messages}
          currentAuthor={currentAuthor}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          scrollContainerRef={scrollRef}
        />
      }
      input={
        <MessageInput
          defaultAuthor={currentAuthor}
          onAuthorChange={setCurrentAuthor}
        />
      }
    />
  );
}
