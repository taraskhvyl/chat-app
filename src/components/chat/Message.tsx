import { cn } from "@/lib/utils";
import type { Message as MessageType } from "@/types/message";

interface MessageProps {
  message: MessageType;
  isOwn: boolean;
}

function formatDate(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Message({ message, isOwn }: MessageProps) {
  return (
    <div
      className={cn(
        "flex max-w-[80%] flex-col rounded-lg px-4 py-2",
        isOwn ? "self-end bg-amber-200/90" : "self-start bg-white shadow-sm"
      )}
      data-testid="message"
    >
      <span className="text-sm font-semibold text-zinc-700">
        {message.author}
      </span>
      <p className="mt-0.5 break-words text-zinc-800">{message.message}</p>
      <span
        className={cn(
          "mt-1 text-xs text-zinc-500",
          isOwn ? "self-end" : "self-start"
        )}
      >
        {formatDate(message.createdAt)}
      </span>
    </div>
  );
}
