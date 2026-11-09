"use client";

import { usePathname } from "next/navigation";
import { QuickGuideInfoMark } from "@/components/QuickGuideInfoMark";
import { useProfileChat } from "@/components/ProfileChatProvider";
import { useHomeIntroActive } from "@/hooks/useHomeIntroActive";

export function ProfileChatFloatingLauncher() {
  const pathname = usePathname();
  const { openChat, isOpen } = useProfileChat();
  const homeIntroActive = useHomeIntroActive();

  const onHome = pathname === "/";
  if (onHome || isOpen || homeIntroActive) return null;

  return (
    <div className="profile-chat__floating" aria-hidden={false}>
      <button
        type="button"
        className="profile-chat__launcher profile-chat__launcher--floating"
        onClick={openChat}
        aria-label="Ask about Tulasi — open quick guide"
      >
        <span className="profile-chat__launcher-icon profile-chat__launcher-icon--info">
          <QuickGuideInfoMark className="profile-chat__guide-mark profile-chat__guide-mark--floating" />
        </span>
        <span className="profile-chat__launcher-text">Quick guide</span>
      </button>
    </div>
  );
}
