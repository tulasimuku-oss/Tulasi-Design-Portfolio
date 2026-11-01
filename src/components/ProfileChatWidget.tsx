"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PROFILE_CHAT_STORAGE_KEY,
  emptyProfileChatSession,
  profileChatQuestions,
  type ProfileChatSession,
} from "@/data/profile-chat";
import { syncProfileChatOpenClass } from "@/hooks/useProfileChatOpen";

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

export function ProfileChatWidget() {
  const [session, setSession] = useState<ProfileChatSession>(
    emptyProfileChatSession,
  );
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSession(readSession());
  }, []);

  useEffect(() => {
    syncProfileChatOpenClass(session.isOpen);
    return () => syncProfileChatOpenClass(false);
  }, [session.isOpen]);

  const persist = useCallback((next: ProfileChatSession) => {
    setSession(next);
    writeSession(next);
  }, []);

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
    const el = threadRef.current;
    if (!el || !session.isOpen) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, session.isOpen]);

  const askQuestion = (id: string) => {
    if (session.askedIds.includes(id)) return;
    persist({
      ...session,
      isOpen: true,
      askedIds: [...session.askedIds, id],
    });
  };

  return (
    <div
      className={`profile-chat${session.isOpen ? " profile-chat--open" : ""}`}
      aria-live="polite"
    >
      {session.isOpen ? (
        <>
          <div className="profile-chat__scrim" aria-hidden />
          <div
            className={`profile-chat__panel${
              session.askedIds.length > 0
                ? " profile-chat__panel--has-messages"
                : ""
            }`}
            role="dialog"
            aria-label="Portfolio guide chat"
          >
          <header className="profile-chat__header">
            <p className="profile-chat__title">Quick guide</p>
            <button
              type="button"
              className="profile-chat__icon-btn"
              onClick={() => persist({ ...session, isOpen: false })}
              aria-label="Close chat"
            >
              ×
            </button>
          </header>

          <div ref={threadRef} className="profile-chat__thread">
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
          </div>

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
        </>
      ) : (
        <button
          type="button"
          className="profile-chat__launcher"
          onClick={() => persist({ ...session, isOpen: true })}
          aria-label="Open portfolio guide chat"
        >
          <span className="profile-chat__launcher-icon" aria-hidden>
            ?
          </span>
          <span className="profile-chat__launcher-text">Ask about Tulasi</span>
        </button>
      )}
    </div>
  );
}
