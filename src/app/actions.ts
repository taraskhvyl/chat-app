"use server";

import { sendMessage } from "@/lib/api";
import { sendMessageSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

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
    await sendMessage(parsed.data);
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to send message",
    };
  }
}
