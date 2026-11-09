"use client";

import { QuickGuideInfoMark } from "@/components/QuickGuideInfoMark";
import { useProfileChat } from "@/components/ProfileChatProvider";

function LauncherContent() {
  return (
    <>
      <span className="profile-chat__launcher-icon profile-chat__launcher-icon--info">
        <QuickGuideInfoMark className="profile-chat__guide-mark" />
      </span>
      <span className="profile-chat__launcher-text">Quick guide</span>
    </>
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
        <LauncherContent />
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
      <LauncherContent />
    </button>
  );
}
