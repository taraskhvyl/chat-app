import { env } from "./env";
import type { Message, SendMessagePayload } from "@/types/message";

export function normalizeMessage(raw: Record<string, unknown>): Message {
  return {
    id: String(raw.id ?? raw._id ?? ""),
    message: String(raw.message ?? ""),
    author: String(raw.author ?? ""),
    createdAt: String(raw.createdAt ?? raw.created_at ?? ""),
  };
}

const getHeaders = () => ({
  Authorization: `Bearer ${env.AUTH_TOKEN}`,
  "Content-Type": "application/json",
});

export async function fetchMessages(params?: {
  after?: string;
  before?: string;
  limit?: number;
}): Promise<Message[]> {
  const url = new URL(`${env.API_URL}/api/v1/messages`);
  if (params?.after) url.searchParams.set("after", params.after);
  if (params?.before) url.searchParams.set("before", params.before);
  url.searchParams.set("limit", String(params?.limit ?? 20));

  const response = await fetch(url.toString(), {
    headers: getHeaders(),
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch messages: ${response.statusText}`);
  }

  const data = await response.json();
  const arr = Array.isArray(data) ? data : (data?.messages ?? []);
  return arr.map((raw: Record<string, unknown>) => normalizeMessage(raw));
}

export async function sendMessage(
  payload: SendMessagePayload
): Promise<Message> {
  const response = await fetch(`${env.API_URL}/api/v1/messages`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }

  const data = await response.json();
  return normalizeMessage(data as Record<string, unknown>);
}
