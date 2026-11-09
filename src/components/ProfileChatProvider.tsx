"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  PROFILE_CHAT_STORAGE_KEY,
  emptyProfileChatSession,
  profileChatQuestions,
  type ProfileChatSession,
} from "@/data/profile-chat";
import {
  HOME_INTRO_COMPLETE_EVENT,
  homeIntroCompleteAlreadyFired,
} from "@/lib/home-intro";
import { ProfileChatFloatingLauncher } from "@/components/ProfileChatFloatingLauncher";
import { syncProfileChatOpenClass } from "@/hooks/useProfileChatOpen";
import { useHomeIntroActive } from "@/hooks/useHomeIntroActive";

function readSession(): ProfileChatSession {
  if (typeof window === "undefined") return emptyProfileChatSession();
  try {
    const raw = sessionStorage.getItem(PROFILE_CHAT_STORAGE_KEY);
    if (!raw) return emptyProfileChatSession();
    const parsed = JSON.parse(raw) as ProfileChatSession;
    if (!Array.isArray(parsed.askedIds)) return emptyProfileChatSession();
    return {
      isOpen: Boolean(parsed.isOpen),
      askedIds: parsed.askedIds.filter((id) =>
        profileChatQuestions.some((q) => q.id === id),
      ),
    };
  } catch {
    return emptyProfileChatSession();
  }
}

function writeSession(session: ProfileChatSession) {
  sessionStorage.setItem(PROFILE_CHAT_STORAGE_KEY, JSON.stringify(session));
}

type ProfileChatContextValue = {
  session: ProfileChatSession;
  openChat: () => void;
  closeChat: () => void;
  askQuestion: (id: string) => void;
  isOpen: boolean;
};

const ProfileChatContext = createContext<ProfileChatContextValue | null>(null);

export function useProfileChat() {
  const ctx = useContext(ProfileChatContext);
  if (!ctx) {
    throw new Error("useProfileChat must be used within ProfileChatProvider");
  }
  return ctx;
}

function ProfileChatOverlay() {
  const { session, closeChat, askQuestion } = useProfileChat();
  const homeIntroActive = useHomeIntroActive();
  const bodyRef = useRef<HTMLDivElement>(null);

  const messages = useMemo(() => {
    return session.askedIds.flatMap((id) => {
      const item = profileChatQuestions.find((q) => q.id === id);
      if (!item) return [];
      return [
        { role: "user" as const, text: item.question, id: `${id}-q` },
        { role: "assistant" as const, text: item.answer, id: `${id}-a` },
      ];
    });
  }, [session.askedIds]);

  const remainingQuestions = useMemo(
    () => profileChatQuestions.filter((q) => !session.askedIds.includes(q.id)),
    [session.askedIds],
  );

  useEffect(() => {
    const el = bodyRef.current;
    if (!el || !session.isOpen) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, session.isOpen, remainingQuestions.length]);

  useEffect(() => {
    if (!session.isOpen || homeIntroActive) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeChat();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [session.isOpen, homeIntroActive, closeChat]);

  if (!session.isOpen || homeIntroActive) return null;

  return (
    <div className="profile-chat profile-chat--open" aria-live="polite">
      <button
        type="button"
        className="profile-chat__scrim"
        aria-label="Close quick guide"
        onClick={closeChat}
      />
      <div
        className={`profile-chat__panel${
          session.askedIds.length > 0 ? " profile-chat__panel--has-messages" : ""
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Portfolio guide chat"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="profile-chat__header">
          <p className="profile-chat__title">Quick guide</p>
          <button
            type="button"
            className="profile-chat__icon-btn"
            onClick={closeChat}
            aria-label="Close chat"
          >
            ×
          </button>
        </header>

        <div ref={bodyRef} className="profile-chat__body">
          <p className="profile-chat__hint">
            Choose a question below to learn more about this portfolio — no
            typing needed
          </p>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`profile-chat__bubble profile-chat__bubble--${msg.role}`}
            >
              {msg.text}
            </div>
          ))}

          {remainingQuestions.length > 0 && (
            <div className="profile-chat__questions">
              {remainingQuestions.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  className="profile-chat__question"
                  onClick={() => askQuestion(q.id)}
                >
                  {q.question}
                </button>
              ))}
            </div>
          )}

          {remainingQuestions.length === 0 && (
            <p className="profile-chat__done label-caps">
              You&apos;ve explored all topics — close anytime
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProfileChatProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [session, setSession] = useState<ProfileChatSession>(
    emptyProfileChatSession,
  );
  const pendingReopenAfterIntro = useRef(false);
  const reopenDone = useRef(false);

  useEffect(() => {
    const loaded = readSession();
    pendingReopenAfterIntro.current = loaded.isOpen;
    const next: ProfileChatSession = { ...loaded, isOpen: false };
    writeSession(next);
    setSession(next);
  }, []);

  useEffect(() => {
    const hideForIntro =
      typeof document !== "undefined" &&
      document.body.classList.contains("home-intro-active");
    syncProfileChatOpenClass(session.isOpen && !hideForIntro);
    return () => syncProfileChatOpenClass(false);
  }, [session.isOpen]);

  const persist = useCallback((next: ProfileChatSession) => {
    setSession(next);
    writeSession(next);
  }, []);

  const openChat = useCallback(() => {
    setSession((prev) => {
      const next = { ...prev, isOpen: true };
      writeSession(next);
      return next;
    });
  }, []);

  const closeChat = useCallback(() => {
    setSession((prev) => {
      const next = { ...prev, isOpen: false };
      writeSession(next);
      return next;
    });
    pendingReopenAfterIntro.current = false;
  }, []);

  const askQuestion = useCallback(
    (id: string) => {
      setSession((prev) => {
        if (prev.askedIds.includes(id)) return prev;
        const next = {
          ...prev,
          isOpen: true,
          askedIds: [...prev.askedIds, id],
        };
        writeSession(next);
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    if (!pendingReopenAfterIntro.current) return;

    const completeReopen = () => {
      if (reopenDone.current || !pendingReopenAfterIntro.current) return;
      reopenDone.current = true;
      pendingReopenAfterIntro.current = false;
      openChat();
    };

    if (pathname !== "/") {
      completeReopen();
      return;
    }

    const onIntroComplete = () => completeReopen();
    window.addEventListener(HOME_INTRO_COMPLETE_EVENT, onIntroComplete);
    if (homeIntroCompleteAlreadyFired()) {
      onIntroComplete();
    }

    return () => {
      window.removeEventListener(HOME_INTRO_COMPLETE_EVENT, onIntroComplete);
    };
  }, [openChat, pathname]);

  const value = useMemo(
    () => ({
      session,
      openChat,
      closeChat,
      askQuestion,
      isOpen: session.isOpen,
    }),
    [session, openChat, closeChat, askQuestion],
  );

  return (
    <ProfileChatContext.Provider value={value}>
      {children}
      <ProfileChatFloatingLauncher />
      <ProfileChatOverlay />
    </ProfileChatContext.Provider>
  );
}
