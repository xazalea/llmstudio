import { ChatInterface } from "@/components/chat/chat-interface";

export const metadata = {
  title: "AI Chat - AI Creative Suite",
  description: "Chat with powerful AI models like Qwen, Llama, and Mistral. Free and unlimited.",
};

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <ChatInterface />
    </div>
  );
}
