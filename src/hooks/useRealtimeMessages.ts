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
  const [isLoadingInitial, setIsLoadingInitial] = useState(
    initialMessages.length === 0
  );
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(sortMessages(initialMessages));
    }
  }, [initialMessages]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const currentMessages = messagesRef.current;
      if (currentMessages.length === 0) {
        setHasMore(false);
        return;
      }

      const oldestMessage = currentMessages[0];
      const beforeTimestamp = new Date(oldestMessage.createdAt).toISOString();

      const olderMessages = await apiClient.getMessages({
        before: beforeTimestamp,
        limit: apiClient.PAGE_SIZE,
      });

      if (olderMessages.length === 0) {
        setHasMore(false);
      } else {
        setMessages((prev) => {
          const combined = [...olderMessages, ...prev];
          const deduped = Array.from(
            new Map(combined.map((m) => [m.id, m])).values()
          );
          return sortMessages(deduped);
        });

        if (olderMessages.length < apiClient.PAGE_SIZE) {
          setHasMore(false);
        }
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
        const currentMessages = messagesRef.current;

        if (currentMessages.length === 0) {
          const now = new Date().toISOString();
          const allMessages = await apiClient.getMessages({
            before: now,
            limit: 50,
          });
          setMessages(sortMessages(allMessages));
          if (allMessages.length < 50) {
            setHasMore(false);
          }
          setIsLoadingInitial(false);
          return;
        }

        const latestMessage = currentMessages[currentMessages.length - 1];
        if (!latestMessage?.createdAt) return;

        const afterTimestamp = new Date(latestMessage.createdAt).toISOString();

        const newMessages = await apiClient.getMessages({
          after: afterTimestamp,
          limit: 50,
        });

        if (newMessages.length > 0) {
          setMessages((prev) => {
            const combined = [...prev, ...newMessages];
            const deduped = Array.from(
              new Map(combined.map((m) => [m.id, m])).values()
            );
            return sortMessages(deduped);
          });
        }
      } catch {
        // Ignore poll errors
      } finally {
        setIsLoadingInitial(false);
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

  const addMessage = useCallback((msg: Message) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return sortMessages([...prev, msg]);
    });
  }, []);

  return {
    messages,
    loadMore,
    hasMore,
    isLoadingMore,
    isLoadingInitial,
    addMessage,
  };
}
