'use client';

import { cn } from "@/lib/utils";
import { Message } from "@/types";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
        {isUser ? (
          <p className="leading-relaxed">{message.content}</p>
        ) : (
          <div className="leading-relaxed markdown-content">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-[#333333]">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base font-bold mb-2 text-[#333333]">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-bold mb-1 text-[#333333]">{children}</h3>,
                strong: ({ children }) => <strong className="font-semibold text-[#333333]">{children}</strong>,
                em: ({ children }) => <em className="italic text-[#333333]">{children}</em>,
                code: ({ children, className, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  const isInline = !className;
                  
                  return isInline ? (
                    <code className="bg-gray-100 text-[#333333] px-1 py-0.5 rounded text-xs" {...props}>
                      {children}
                    </code>
                  ) : (
                    <SyntaxHighlighter
                      style={oneLight}
                      language={language}
                      PreTag="div"
                      className="rounded text-xs mb-2"
                      customStyle={{
                        margin: 0,
                        padding: '8px',
                        fontSize: '12px',
                        backgroundColor: '#f8f9fa'
                      }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  );
                },
                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-[#333333]">{children}</li>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-3 italic text-gray-600 mb-2">{children}</blockquote>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}