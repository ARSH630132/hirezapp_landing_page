"use client";

import Image from "next/image";

type AgentChatPanelProps = {
  agentName: string;
  agentIcon: string;
  agentColor: string;
  onClose: () => void;
  variant?: "mobile" | "desktop";
  className?: string;
};

function formatAgentName(name: string) {
  return name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AgentChatPanel({
  agentName,
  agentIcon,
  agentColor,
  onClose,
  variant = "desktop",
  className = "",
}: AgentChatPanelProps) {
  const isMobile = variant === "mobile";
  const displayName = formatAgentName(agentName);

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[18px] border border-[#1E1E1E] bg-[#111111] ${
        isMobile ? "h-[400px] p-4" : "h-[480px] p-6 md:p-8"
      } ${className}`}
    >
      <div className={`relative flex shrink-0 items-center ${isMobile ? "justify-between" : "gap-3"}`}>
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center rounded-full ${isMobile ? "h-10 w-10" : "h-[46px] w-[46px]"}`}
            style={{ background: `${agentColor}20`, border: `1px solid ${agentColor}` }}
          >
            {isMobile ? (
              <img src={agentIcon} alt={agentName} className="h-[22px] w-[22px]" />
            ) : (
              <Image src={agentIcon} alt={agentName} width={28} height={28} className="h-[28px] w-[28px] object-contain" />
            )}
          </div>
          <div>
            <h3 className={`font-semibold text-white ${isMobile ? "text-[16px]" : "text-[18px]"}`}>{displayName}</h3>
            <p className={`text-[#C1C1C1] ${isMobile ? "text-[12px]" : "text-[13px]"}`}>Online</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className={`text-white/70 transition-colors hover:text-white ${
            isMobile ? "text-2xl leading-none" : "absolute top-0 right-0 text-2xl"
          }`}
          aria-label="Close chat"
        >
          ×
        </button>
      </div>

      <div className={`min-h-0 flex-1 overflow-y-auto ${isMobile ? "mt-4" : "mt-6"}`}>
        <div
          className={`inline-block max-w-[900px] rounded-[10px] bg-[#1B1B1B] text-white/80 ${
            isMobile ? "px-4 py-3 text-[14px]" : "px-4 py-3 text-[15px] leading-[24px]"
          }`}
        >
          Hello! I&apos;m your {displayName}. I can help you craft an AI transformation roadmap tailored to your enterprise goals. What industry are you in?
        </div>
      </div>

      <div className={`flex shrink-0 items-center gap-2 ${isMobile ? "mt-4" : "mt-6 gap-3"}`}>
        <input
          type="text"
          placeholder="Type your message..."
          className={`w-full rounded-[6px] border border-[#1E1E1E] bg-black px-4 text-white outline-none placeholder:text-white/30 ${
            isMobile ? "h-[44px]" : "h-[48px]"
          }`}
        />
        <button
          type="button"
          className={`flex shrink-0 items-center justify-center text-white ${
            isMobile ? "h-[44px] w-[44px] rounded-[10px]" : "h-[48px] w-[48px] rounded-[12px]"
          }`}
          style={{ background: "linear-gradient(135deg, #E4000F 0%, #009DFF 100%)" }}
          aria-label="Send message"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
