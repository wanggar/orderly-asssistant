'use client';

import { cn } from "@/lib/utils";
import { Message } from "@/types";

interface MessageBubbleProps {
  message: Message;
  isUser?: boolean;
}

export function MessageBubble({ message, isUser }: MessageBubbleProps) {
  // System messages (轻反馈)
  if (message.type === 'system') {
    return (
      <div className="flex w-full justify-center mb-2">
        <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  // Regular user and AI messages
  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
        isUser 
          ? "bg-white text-[#333333] ml-auto" 
          : "bg-[#FFF5EB] text-[#333333]"
      )}>
        <p className="leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
}