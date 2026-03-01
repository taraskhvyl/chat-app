import { Suspense } from "react";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { MessageInput } from "@/components/chat/MessageInput";
import { fetchMessages } from "@/lib/api";

function ChatLoading() {
  return (
    <ChatLayout
      messagesArea={
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="animate-pulse text-zinc-500">Loading messages...</div>
        </div>
      }
      input={<MessageInput />}
    />
  );
}

async function ChatPage() {
  const messages = await fetchMessages();
  return <ChatContainer initialMessages={messages} />;
}

export default function Home() {
  return (
    <Suspense fallback={<ChatLoading />}>
      <ChatPage />
    </Suspense>
  );
}
