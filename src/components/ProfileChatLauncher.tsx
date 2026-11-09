"use client";

import { useProfileChat } from "@/components/ProfileChatProvider";

export function ProfileChatLauncher() {
  const { openChat, isOpen } = useProfileChat();

  if (isOpen) {
    return (
      <span
        className="profile-chat__launcher profile-chat__launcher--hero-slot pointer-events-none invisible"
        aria-hidden
      >
        <span className="profile-chat__launcher-icon">?</span>
        <span className="profile-chat__launcher-text">Quick guide</span>
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
      <span className="profile-chat__launcher-icon" aria-hidden>
        ?
      </span>
      <span className="profile-chat__launcher-text">Quick guide</span>
    </button>
  );
}
