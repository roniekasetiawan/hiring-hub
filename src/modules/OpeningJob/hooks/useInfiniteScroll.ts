"use client";

import { useRef, useCallback } from "react";

interface UseInfiniteScrollProps {
  isLoading: boolean;
  hasNextPage?: boolean;
  onLoadMore: () => void;
}

export const useInfiniteScroll = ({
  isLoading,
  hasNextPage,
  onLoadMore,
}: UseInfiniteScrollProps) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          onLoadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, onLoadMore],
  );

  return { lastElementRef };
};
