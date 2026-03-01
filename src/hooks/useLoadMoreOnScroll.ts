"use client";

import { useEffect, useRef } from "react";

interface UseLoadMoreOnScrollOptions {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  rootMargin?: string;
}

export function useLoadMoreOnScroll({
  onLoadMore,
  hasMore,
  isLoadingMore,
  scrollContainerRef,
  rootMargin = "200px",
}: UseLoadMoreOnScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!onLoadMore || !hasMore || isLoadingMore) return;

    const root = scrollContainerRef?.current ?? null;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { root: root ?? undefined, rootMargin, threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore, isLoadingMore, scrollContainerRef, rootMargin]);

  return sentinelRef;
}
