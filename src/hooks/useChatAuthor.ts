"use client";

import { useSyncExternalStore, useCallback, useState } from "react";

const STORAGE_KEY = "chat-author";

function getSnapshot() {
  return typeof window === "undefined"
    ? ""
    : (sessionStorage.getItem(STORAGE_KEY) ?? "");
}

function getServerSnapshot() {
  return "";
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function useChatAuthor() {
  const author = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const [, forceUpdate] = useState({});

  const setAuthorAndPersist = useCallback((value: string) => {
    sessionStorage.setItem(STORAGE_KEY, value);
    forceUpdate({});
  }, []);

  return [author, setAuthorAndPersist] as const;
}
