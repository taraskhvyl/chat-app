import type { Message } from "@/types/message";

const getBaseUrl = () =>
  typeof window === "undefined" ? "" : window.location.origin;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${getBaseUrl()}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

const PAGE_SIZE = 50;

export const apiClient = {
  PAGE_SIZE,

  getMessages: (params?: {
    after?: string;
    before?: string;
    limit?: number;
  }) => {
    const search = new URLSearchParams();
    if (params?.after) search.set("after", params.after);
    if (params?.before) search.set("before", params.before);
    if (params?.limit) search.set("limit", String(params.limit));
    const query = search.toString();
    return request<Message[]>(`/api/messages${query ? `?${query}` : ""}`);
  },
};
