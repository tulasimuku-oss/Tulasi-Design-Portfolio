"use client";

import { useId } from "react";
import { useProfileChat } from "@/components/ProfileChatProvider";

function QuickGuideMark({ className }: { className?: string }) {
  const gradientId = useId();

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      role="img"
    >
      <defs>
        <linearGradient id={gradientId} x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--peri-deep)" />
          <stop offset="100%" stopColor="var(--peri)" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="11" fill={`url(#${gradientId})`} />
      <circle cx="12" cy="7.35" r="1.45" fill="#ffffff" />
      <path
        d="M12 10.75v6.75"
        stroke="#ffffff"
        strokeWidth="2.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ProfileChatLauncher() {
  const { openChat, isOpen } = useProfileChat();

  if (isOpen) {
    return (
      <span
        className="profile-chat__launcher profile-chat__launcher--hero-slot pointer-events-none invisible"
        aria-hidden
      >
        <span className="profile-chat__launcher-icon">
          <QuickGuideMark className="profile-chat__guide-mark" />
        </span>
      </span>
    );
  }

  return (
    <button
      type="button"
      className="profile-chat__launcher profile-chat__launcher--hero-slot"
      onClick={openChat}
      aria-label="Ask about Tulasi — open quick guide"
    >
      <span className="profile-chat__launcher-icon">
        <QuickGuideMark className="profile-chat__guide-mark" />
      </span>
    </button>
  );
}
