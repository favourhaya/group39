"use-client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { TranscriptItem } from "@/app/types";
import Image from "next/image";
import { useTranscript } from "@/app/contexts/TranscriptContext";
import { v4 as uuidv4 } from "uuid";

export interface TranscriptProps {
  userText: string;
  setUserText: (val: string) => void;
  onSendMessage: () => void;
  canSend: boolean;
  sendClientEvent: (event: any, description?: string) => void;
  isPTTActive: boolean;
  setIsPTTActive: (active: boolean) => void;
}

function Transcript({
  userText,
  setUserText,
  onSendMessage,
  canSend,
  sendClientEvent,
  isPTTActive,
  setIsPTTActive,
}: TranscriptProps) {
  const { transcriptItems, toggleTranscriptItemExpand, addTranscriptMessage } = useTranscript();
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const [prevLogs, setPrevLogs] = useState<TranscriptItem[]>([]);
  const [justCopied, setJustCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function scrollToBottom() {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    const hasNewMessage = transcriptItems.length > prevLogs.length;
    const hasUpdatedMessage = transcriptItems.some((newItem, index) => {
      const oldItem = prevLogs[index];
      return (
        oldItem &&
        (newItem.title !== oldItem.title || newItem.data !== oldItem.data)
      );
    });

    if (hasNewMessage || hasUpdatedMessage) {
      scrollToBottom();
    }

    setPrevLogs(transcriptItems);
  }, [transcriptItems]);

  // Autofocus on text box input on load
  useEffect(() => {
    if (canSend && inputRef.current) {
      inputRef.current.focus();
    }
  }, [canSend]);

  const handleCopyTranscript = async () => {
    if (!transcriptRef.current) return;
    try {
      await navigator.clipboard.writeText(transcriptRef.current.innerText);
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy transcript:", error);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 rounded-xl gradient-background">
    <div className="flex flex-col flex-1 bg-white/65 min-h-0 rounded-xl">
      <div className="relative flex-1 min-h-0">
        <div className="absolute top-3 right-24 z-10 flex gap-2">
          <button
            onClick={async () => {
              try {
                if (!transcriptRef.current) return;
                
                const transcriptText = transcriptRef.current.innerText;
                
                const analysisRequestId = uuidv4().slice(0, 32);
                addTranscriptMessage(analysisRequestId, "user", "Please analyze this conversation.");
                
                // Send the analysis request
                sendClientEvent({
                  type: "conversation.item.create",
                  item: {
                    id: analysisRequestId,
                    type: "message",
                    role: "user",
                    content: [{ 
                      type: "input_text",
                      text: `analyze_transcript ${JSON.stringify({ transcript: transcriptText })}`
                    }],
                  },
                });
                sendClientEvent({ type: "response.create" });
              } catch (error) {
                console.error("Analysis request failed:", error);
                addTranscriptMessage(
                  uuidv4().slice(0, 32),
                  "assistant",
                  "Sorry, I couldn't analyze the conversation due to a technical error."
                );
              }
            }}
            className="text-sm px-3 py-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            Analyze
          </button>
        </div>

        <div
          ref={transcriptRef}
          className="overflow-auto p-4 flex flex-col gap-y-4 h-full"
        >
          {transcriptItems.map((item) => {
            const { itemId, type, role, data, expanded, timestamp, title = "", isHidden } = item;

            if (isHidden) {
              return null;
            }

            if (type === "MESSAGE") {
              const isUser = role === "user";
              const baseContainer = "flex justify-end flex-col";
              const containerClasses = `${baseContainer} ${isUser ? "items-end" : "items-start"}`;
              const bubbleBase = `max-w-lg p-3 rounded-xl ${isUser ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-black"}`;
              const isBracketedMessage = title.startsWith("[") && title.endsWith("]");
              const messageStyle = isBracketedMessage ? "italic text-gray-400" : "";
              const displayTitle = isBracketedMessage ? title.slice(1, -1) : title;

              return (
                <div key={itemId} className={containerClasses}>
                  <div className={bubbleBase}>
                    <div className={`text-xs ${isUser ? "text-gray-400" : "text-gray-500"} font-mono`}>
                      {timestamp}
                    </div>
                    <div className={`whitespace-pre-wrap ${messageStyle}`}>
                      <ReactMarkdown>{displayTitle}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              );
            // } else {
            //   // Fallback if type is neither MESSAGE nor BREADCRUMB
            //   return (
            //     <div
            //       key={itemId}
            //       className="flex justify-center text-gray-500 text-sm italic font-mono"
            //     >
            //       Unknown item type: {type}{" "}
            //       <span className="ml-2 text-xs">{timestamp}</span>
            //     </div>
            //   );
            }
          })}
        </div>
      </div>

      <div className="p-4 flex items-center bg-white gap-x-2 flex-shrink-0 border-t border-white rounded-b-xl">
        <button
          onClick={() => setIsPTTActive(!isPTTActive)}
          className={`px-3 py-2 rounded-lg ${
            isPTTActive 
              ? "bg-gray-100 hover:bg-gray-200 text-gray-700" 
              : "bg-gray-600 hover:bg-gray-700 text-white"
          }`}
        >
          <Image 
            src={isPTTActive ? "/mic-off.svg" : "/mic.svg"}
            alt={isPTTActive ? "Muted" : "Unmuted"}
            width={20}
            height={20}
          />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canSend) {
              onSendMessage();
            }
          }}
          className="flex-1 px-4 py-2 focus:outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={onSendMessage}
          disabled={!canSend || !userText.trim()}
          className="bg-gray-900 text-white rounded-full px-2 py-2 disabled:opacity-50"
        >
          <Image src="arrow.svg" alt="Send" width={24} height={24} />
        </button>
      </div>
    </div>
    </div>
  );
}

export default Transcript;
