"use client";

import { useEffect, useRef, useCallback, useState } from "react";

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
  const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    setSentinel(node);
  }, []);

  useEffect(() => {
    if (!onLoadMore || !hasMore || isLoadingMore || !sentinel) {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    const root = scrollContainerRef?.current ?? null;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { root: root ?? undefined, rootMargin, threshold: 0 }
    );

    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [
    onLoadMore,
    hasMore,
    isLoadingMore,
    scrollContainerRef,
    rootMargin,
    sentinel,
  ]);

  return sentinelRef;
}
