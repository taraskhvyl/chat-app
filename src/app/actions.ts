"use server";

import { sendMessage } from "@/lib/api";
import { sendMessageSchema } from "@/lib/validation";

export async function submitMessage(formData: FormData) {
  const raw = {
    message: formData.get("message") as string,
    author: formData.get("author") as string,
  };

  const parsed = sendMessageSchema.safeParse(raw);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { error: firstIssue?.message ?? "Invalid input" };
  }

  try {
    const created = await sendMessage(parsed.data);
    return { success: true, message: created };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to send message",
    };
  }
}
