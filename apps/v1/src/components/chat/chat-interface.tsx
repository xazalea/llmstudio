"use client";

import { useState, useRef, useEffect } from "react";
import { useChat, type Message } from "@/hooks/use-chat";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SendIcon,
  StopCircleIcon,
  Trash2Icon,
  BotIcon,
  UserIcon,
  SparklesIcon,
  CopyIcon,
  CheckIcon,
  RefreshCwIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CHAT_MODELS = [
  { id: "qwen-72b", name: "Qwen 2.5 72B", description: "Most capable" },
  { id: "qwen-32b", name: "Qwen 2.5 32B", description: "Fast & capable" },
  { id: "llama-3-70b", name: "Llama 3.1 70B", description: "Meta's best" },
  { id: "mistral-nemo", name: "Mistral Nemo", description: "Efficient" },
  { id: "gemma-2-27b", name: "Gemma 2 27B", description: "Google's model" },
];

function MessageBubble({
  message,
  onCopy,
}: {
  message: Message;
  onCopy: (content: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    onCopy(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-xl transition-colors",
        isUser ? "bg-purple-500/10" : "bg-white/5"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
          isUser
            ? "bg-gradient-to-br from-purple-500 to-pink-500"
            : "bg-gradient-to-br from-blue-500 to-cyan-500"
        )}
      >
        {isUser ? (
          <UserIcon className="w-4 h-4 text-white" />
        ) : (
          <BotIcon className="w-4 h-4 text-white" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-muted-foreground">
            {isUser ? "You" : "AI Assistant"}
          </span>
          <span className="text-xs text-muted-foreground/60">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>

        <div className="prose prose-invert prose-sm max-w-none">
          <p className="whitespace-pre-wrap break-words text-foreground/90">
            {message.content || (
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <SparklesIcon className="w-3 h-3 animate-pulse" />
                Thinking...
              </span>
            )}
          </p>
        </div>

        {!isUser && message.content && (
          <div className="flex gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={handleCopy}
            >
              {copied ? (
                <CheckIcon className="w-3 h-3 mr-1" />
              ) : (
                <CopyIcon className="w-3 h-3 mr-1" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ChatInterface() {
  const {
    messages,
    isLoading,
    error,
    currentModel,
    sendMessage,
    stopGeneration,
    clearMessages,
    setModel,
  } = useChat();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
            <BotIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">AI Chat</h2>
            <p className="text-xs text-muted-foreground">
              Powered by free Hugging Face models
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={currentModel} onValueChange={setModel}>
            <SelectTrigger className="w-[180px] bg-white/5 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHAT_MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex flex-col">
                    <span>{model.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {model.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            onClick={clearMessages}
            disabled={messages.length === 0}
            className="text-muted-foreground hover:text-foreground"
          >
            <Trash2Icon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-4 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mb-4">
              <SparklesIcon className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Chat with powerful AI models like Qwen 72B, Llama 3, and more.
              Completely free, no limits.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-6 max-w-md">
              {[
                "Explain quantum computing",
                "Write a Python function",
                "Help me brainstorm ideas",
                "Summarize a topic",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="p-3 text-sm text-left rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onCopy={copyToClipboard}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mb-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <span className="flex-1">{error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => sendMessage(messages[messages.length - 2]?.content || "")}
            className="text-red-400 hover:text-red-300"
          >
            <RefreshCwIcon className="w-3 h-3 mr-1" />
            Retry
          </Button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
              className="min-h-[52px] max-h-[200px] resize-none bg-white/5 border-white/10 pr-12"
              disabled={isLoading}
            />
            <div className="absolute right-2 bottom-2">
              {isLoading ? (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={stopGeneration}
                  className="h-8 w-8 text-red-400 hover:text-red-300"
                >
                  <StopCircleIcon className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim()}
                  className="h-8 w-8 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <SendIcon className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Free AI chat powered by Hugging Face Spaces • No account required
        </p>
      </div>
    </div>
  );
}
