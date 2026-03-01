"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { apiClient } from "@/lib/apiClient";
import type { Message } from "@/types/message";

const POLL_INTERVAL = 4000;
const POLL_INTERVAL_BACKGROUND = 15000;

function sortMessages(msgs: Message[]) {
  return [...msgs].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export function useRealtimeMessages(initialMessages: Message[]) {
  const [messages, setMessages] = useState<Message[]>(
    sortMessages(initialMessages)
  );
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  useEffect(() => {
    setMessages(sortMessages(initialMessages));
  }, [initialMessages]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const currentCount = messagesRef.current.length;
      const data = await apiClient.getMessages({
        limit: currentCount + apiClient.PAGE_SIZE,
      });

      if (data.length <= currentCount) {
        setHasMore(false);
      }

      if (data.length > 0) {
        setMessages(sortMessages(data));
      }
    } catch {
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore]);

  useEffect(() => {
    const poll = async () => {
      try {
        const limit = Math.max(messagesRef.current.length, apiClient.PAGE_SIZE);
        const data = await apiClient.getMessages({ limit });
        setMessages((prev) => {
          const sorted = sortMessages(data);
          if (
            prev.length === sorted.length &&
            prev.every((p, i) => p.id === sorted[i]?.id)
          )
            return prev;
          return sorted;
        });
      } catch {
        // Ignore poll errors
      }
    };

    let interval = POLL_INTERVAL;
    let timeoutId: ReturnType<typeof setTimeout>;

    const schedulePoll = () => {
      timeoutId = setTimeout(() => {
        poll();
        schedulePoll();
      }, interval);
    };

    const handleVisibility = () => {
      clearTimeout(timeoutId);
      interval =
        document.visibilityState === "visible"
          ? POLL_INTERVAL
          : POLL_INTERVAL_BACKGROUND;
      schedulePoll();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    poll();
    schedulePoll();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      clearTimeout(timeoutId);
    };
  }, []);

  return { messages, loadMore, hasMore, isLoadingMore };
}
