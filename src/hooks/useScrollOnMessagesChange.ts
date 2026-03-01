"use client";

import { useEffect, useRef, useCallback } from "react";
import type { Message } from "@/types/message";

export function useScrollOnMessagesChange(
  scrollRef: React.RefObject<HTMLDivElement | null>,
  messages: Message[],
  loadMore: () => void
) {
  const scrollHeightBeforeLoadRef = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (scrollHeightBeforeLoadRef.current > 0) {
      const prevHeight = scrollHeightBeforeLoadRef.current;
      scrollHeightBeforeLoadRef.current = 0;
      requestAnimationFrame(() => {
        el.scrollTop += el.scrollHeight - prevHeight;
      });
    }
  }, [messages, scrollRef]);

  const handleLoadMore = useCallback(() => {
    if (scrollRef.current) {
      scrollHeightBeforeLoadRef.current = scrollRef.current.scrollHeight;
    }
    loadMore();
  }, [loadMore, scrollRef]);

  return handleLoadMore;
}
