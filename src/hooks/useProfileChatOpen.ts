"use client";

import { useEffect, useState } from "react";

export const PROFILE_CHAT_OPEN_CLASS = "profile-chat-open";

export function useProfileChatOpen(): boolean {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sync = () => {
      setOpen(document.body.classList.contains(PROFILE_CHAT_OPEN_CLASS));
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return open;
}

export function syncProfileChatOpenClass(isOpen: boolean) {
  document.body.classList.toggle(PROFILE_CHAT_OPEN_CLASS, isOpen);
}
