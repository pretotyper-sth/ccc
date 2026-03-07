"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { ChatCopy, StepId } from "./chat-copy";
import { STEPS } from "./chat-copy";
import { Analytics } from "@/lib/analytics";

const BG = "#f4f1ec";
const BORDER = "#e8e3da";
const ACCENT = "#b8920e";
const ACCENT_SUB = "rgba(184,146,14,0.10)";
const TEXT = "#1a1a1a";
const TEXT_SEC = "#6b5f54";
const TEXT_TER = "#7a6e64";
const ERROR = "#e54d4d";
const FORMSPREE = "https://formspree.io/f/maqdzjby";
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

type Answers = {
  purpose: string;
  topic: string;
  topicOther: string;
  gender: string;
  age: string;
  job: string;
  jobOther: string;
  interpreter: string;
  location: string;
  locationOther: string;
  time: string;
  whenJoin: string;
  email: string;
};

const DEFAULT_ANSWERS: Answers = {
  purpose: "",
  topic: "",
  topicOther: "",
  gender: "",
  age: "",
  job: "",
  jobOther: "",
  interpreter: "",
  location: "",
  locationOther: "",
  time: "",
  whenJoin: "",
  email: "",
};

type ChatMessage =
  | { type: "bot"; text: string; stepId: StepId }
  | { type: "user"; text: string; stepId: StepId; payload: Partial<Answers> };

export default function ChatPage({ copy }: { copy: ChatCopy }) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { type: "bot", text: copy.getBotMessage("welcome"), stepId: "welcome" },
  ]);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(DEFAULT_ANSWERS);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const step = STEPS[stepIndex];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, stepIndex, answers]);

  useEffect(() => {
    Analytics.chatFunnelStart();
    Analytics.chatStepView("welcome", 0);
  }, []);

  useEffect(() => {
    if (done) Analytics.chatDoneView();
  }, [done]);

  const setAnswer = (key: keyof Answers, value: string) => {
    setAnswers((p) => ({ ...p, [key]: value }));
    setError("");
  };

  const pushUserAndNextBot = (userText: string, payload: Partial<Answers>) => {
    const nextIndex = stepIndex + 1;
    setMessages((m) => [
      ...m,
      { type: "user", text: userText, stepId: step, payload },
      { type: "bot", text: copy.getBotMessage(STEPS[nextIndex]), stepId: STEPS[nextIndex] },
    ]);
    setAnswers((p) => ({ ...p, ...payload }));
    setStepIndex((i) => i + 1);
    Analytics.chatStepView(STEPS[nextIndex] as StepId, nextIndex);
  };

  const handleChoice = (key: keyof Answers, value: string) => {
    setAnswer(key, value);
    Analytics.chatStepChoice(step as StepId, value);
    pushUserAndNextBot(value, { [key]: value });
  };

  const handleTopicChoice = (value: string) => {
    setAnswer("topic", value);
    if (value !== copy.otherLabel) {
      Analytics.chatStepChoice("topic", value);
      pushUserAndNextBot(value, { topic: value });
    }
  };

  const handleTopicOtherNext = () => {
    const display = answers.topicOther.trim();
    if (!display) return;
    Analytics.chatStepOtherConfirm("topic");
    pushUserAndNextBot(display, { topic: copy.otherLabel, topicOther: display });
  };

  const handleJobChoice = (value: string) => {
    setAnswer("job", value);
    if (value !== copy.otherLabel) {
      Analytics.chatStepChoice("job", value);
      pushUserAndNextBot(value, { job: value });
    }
  };

  const handleJobOtherNext = () => {
    const display = answers.jobOther.trim();
    if (!display) return;
    Analytics.chatStepOtherConfirm("job");
    pushUserAndNextBot(display, { job: copy.otherLabel, jobOther: display });
  };

  const handleLocationChoice = (value: string) => {
    setAnswer("location", value);
    if (value !== copy.otherLabel) {
      Analytics.chatStepChoice("location", value);
      pushUserAndNextBot(value, { location: value });
    }
  };

  const handleLocationOtherNext = () => {
    const display = answers.locationOther.trim();
    if (!display) return;
    Analytics.chatStepOtherConfirm("location");
    pushUserAndNextBot(display, { location: copy.otherLabel, locationOther: display });
  };

  const handleSubmit = async () => {
    Analytics.chatSubmitClick();
    if (!answers.email.trim()) {
      setError(copy.errorEmailRequired);
      Analytics.chatSubmitError("email_required");
      return;
    }
    if (!isValidEmail(answers.email)) {
      setError(copy.errorEmailInvalid);
      Analytics.chatSubmitError("email_invalid");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const locationDisplay =
        answers.location === copy.otherLabel ? answers.locationOther : answers.location;
      const topicDisplay =
        answers.topic === copy.otherLabel ? answers.topicOther : answers.topic;
      const jobDisplay =
        answers.job === copy.otherLabel ? answers.jobOther : answers.job;
      const res = await fetch(FORMSPREE, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          이메일: answers.email,
          방문목적: answers.purpose,
          관심주제: topicDisplay || "미입력",
          성별: answers.gender,
          연령대: answers.age,
          직업: jobDisplay || "미입력",
          통역필요: answers.interpreter,
          선호장소: locationDisplay || "미입력",
          선호시간대: answers.time,
          참여예정시기: answers.whenJoin,
          _source: copy.formSource,
        }),
      });
      if (res.ok) {
        Analytics.chatSubmitSuccess();
        setDone(true);
      } else {
        setError(copy.errorSubmit);
        Analytics.chatSubmitError("server");
      }
    } catch {
      setError(copy.errorNetwork);
      Analytics.chatSubmitError("network");
    } finally {
      setLoading(false);
    }
  };

  const handleEditStep = (stepId: StepId) => {
    Analytics.chatStepEdit(stepId);
    const targetIndex = STEPS.indexOf(stepId);
    const lastBotIndex = messages.findLastIndex(
      (msg) => msg.type === "bot" && msg.stepId === stepId
    );
    if (lastBotIndex === -1) return;
    const userMsg = messages.find(
      (m, i) => i > lastBotIndex && m.type === "user" && m.stepId === stepId
    );
    const payload = userMsg?.type === "user" ? userMsg.payload : {};
    setMessages((m) => m.slice(0, lastBotIndex + 1));
    setStepIndex(targetIndex);
    setAnswers((p) => {
      const next = { ...DEFAULT_ANSWERS };
      (Object.keys(next) as (keyof Answers)[]).forEach((k) => {
        const stepForKey =
          k === "locationOther" ? "location"
          : k === "topicOther" ? "topic"
          : k === "jobOther" ? "job"
          : k === "whenJoin" ? "when_join" : k;
        const idx = STEPS.indexOf(stepForKey as StepId);
        if (idx < targetIndex) next[k] = p[k];
      });
      return { ...next, ...payload };
    });
  };

  if (done) {
    return (
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          minHeight: "100vh",
          background: BG,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: BG,
            borderBottom: `1px solid ${BORDER}`,
            padding: "14px 20px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: "#111" }}>CCC</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: TEXT_SEC, letterSpacing: "0.12em" }}>
                CROSS CULTURAL CLUB
              </span>
            </div>
            <Link
              href={copy.langLinkHref}
              onClick={() => Analytics.chatLangSwitch(copy.langLinkHref === "/" ? "jp" : "kr", copy.langLinkHref === "/" ? "kr" : "jp")}
              style={{ fontSize: 12, color: TEXT_SEC }}
            >
              {copy.langLinkLabel}
            </Link>
          </div>
          <p style={{ margin: 0, fontSize: 11, color: TEXT_TER }}>
            {copy.gnbTagline}
          </p>
        </header>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: ACCENT_SUB,
              border: `2px solid ${ACCENT}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              color: ACCENT,
              fontWeight: 900,
              marginBottom: 24,
            }}
          >
            ✓
          </div>
          <h1 style={{ margin: "0 0 10px", fontSize: 24, fontWeight: 900, color: "#111", letterSpacing: "-0.02em" }}>
            {copy.doneTitle}
          </h1>
          <p style={{ margin: "0 0 32px", fontSize: 14, color: TEXT_TER, lineHeight: 1.75, whiteSpace: "pre-line" }}>
            {copy.doneDesc}
          </p>
          <Link
            href={copy.doneLinkHref}
            onClick={() => Analytics.chatDoneCtaClick()}
            style={{
              display: "block",
              width: "100%",
              maxWidth: 320,
              padding: "16px",
              background: "#111",
              color: "#fff",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 800,
              textAlign: "center",
            }}
          >
            {copy.doneBtn}
          </Link>
        </div>
      </div>
    );
  }

  const showTopicOther = step === "topic" && answers.topic === copy.otherLabel;
  const showJobOther = step === "job" && answers.job === copy.otherLabel;
  const showLocationOther = step === "location" && answers.location === copy.otherLabel;

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        minHeight: "100vh",
        background: BG,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: BG,
          borderBottom: `1px solid ${BORDER}`,
          padding: "14px 20px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: "#111" }}>CCC</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: TEXT_SEC, letterSpacing: "0.12em" }}>
              CROSS CULTURAL CLUB
            </span>
          </div>
          <Link
            href={copy.langLinkHref}
            onClick={() => Analytics.chatLangSwitch(copy.langLinkHref === "/" ? "jp" : "kr", copy.langLinkHref === "/" ? "kr" : "jp")}
            style={{ fontSize: 12, color: TEXT_SEC }}
          >
            {copy.langLinkLabel}
          </Link>
        </div>
        <p style={{ margin: 0, fontSize: 11, color: TEXT_TER }}>
          {copy.gnbTagline}
        </p>
      </header>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flex: 1, overflow: "auto", padding: "16px 20px 24px" }}>
          {messages.map((msg, i) =>
            msg.type === "bot" ? (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    maxWidth: "82%",
                    padding: "12px 16px",
                    background: "#fff",
                    borderRadius: 16,
                    borderTopLeftRadius: 4,
                    border: `1px solid ${BORDER}`,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  }}
                >
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: TEXT, whiteSpace: "pre-line" }}>
                    {msg.text}
                  </p>
                </div>
              </div>
            ) : (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    maxWidth: "82%",
                  }}
                >
                  <div
                    style={{
                      padding: "10px 14px",
                      background: ACCENT_SUB,
                      border: `1px solid ${ACCENT}`,
                      borderRadius: 16,
                      borderTopRightRadius: 4,
                    }}
                  >
                    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45, color: TEXT, fontWeight: 600 }}>
                      {msg.text}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleEditStep(msg.stepId)}
                    style={{
                      flexShrink: 0,
                      padding: "4px 8px",
                      fontSize: 11,
                      color: TEXT_TER,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    {copy.btnEdit}
                  </button>
                </div>
              </div>
            )
          )}

          <div style={{ marginTop: 8 }}>
            {step === "welcome" && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => {
                    Analytics.chatStepChoice("welcome", copy.btnStart);
                    Analytics.chatStepView("purpose", 1);
                    setMessages((m) => [
                      ...m,
                      { type: "user", text: copy.btnStart, stepId: "welcome", payload: {} },
                      { type: "bot", text: copy.getBotMessage("purpose"), stepId: "purpose" },
                    ]);
                    setStepIndex(1);
                  }}
                  style={{
                    padding: "14px 24px",
                    background: "linear-gradient(180deg, #f0d050 0%, #d4a817 100%)",
                    color: "#1a1a1a",
                    border: "none",
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 3px 12px rgba(212,168,23,0.4)",
                  }}
                >
                  {copy.btnStart}
                </button>
              </div>
            )}

            {step === "purpose" &&
              copy.purposeOptions.map((opt) => (
                <div key={opt} style={{ marginBottom: 8, display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => handleChoice("purpose", opt)}
                    style={{
                      padding: "14px 20px",
                      background: "#fff",
                      color: TEXT,
                      border: `2px solid ${ACCENT}`,
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(184,146,14,0.12)",
                    }}
                  >
                    {opt}
                  </button>
                </div>
              ))}

            {step === "topic" && (
              <>
                {!showTopicOther &&
                  copy.topicOptions.map((opt) => (
                    <div key={opt} style={{ marginBottom: 8, display: "flex", justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        onClick={() => handleTopicChoice(opt)}
                        style={{
                          padding: "14px 20px",
                          background: answers.topic === opt ? ACCENT_SUB : "#fff",
                          color: TEXT,
                          border: `2px solid ${answers.topic === opt ? ACCENT : ACCENT}`,
                          borderRadius: 12,
                          fontSize: 14,
                          fontWeight: 700,
                          cursor: "pointer",
                          boxShadow: answers.topic === opt ? "0 3px 12px rgba(184,146,14,0.25)" : "0 2px 8px rgba(184,146,14,0.12)",
                        }}
                      >
                        {opt}
                      </button>
                    </div>
                  ))}
                {showTopicOther && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                    <input
                      type="text"
                      placeholder={copy.placeholderTopicOther}
                      value={answers.topicOther}
                      onChange={(e) => setAnswer("topicOther", e.target.value)}
                      style={{
                        width: "100%",
                        maxWidth: 280,
                        padding: "12px 14px",
                        border: `2px solid ${BORDER}`,
                        borderRadius: 12,
                        fontSize: 14,
                        background: "#fff",
                      }}
                    />
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button
                        type="button"
                        onClick={() => { Analytics.chatStepOtherCancel("topic"); setAnswer("topic", ""); setAnswer("topicOther", ""); }}
                        style={{
                          padding: "14px 24px",
                          background: "#fff",
                          color: TEXT_SEC,
                          border: `2px solid ${BORDER}`,
                          borderRadius: 12,
                          fontSize: 14,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {copy.btnCancel}
                      </button>
                      <button
                        type="button"
                        onClick={handleTopicOtherNext}
                        disabled={!answers.topicOther.trim()}
                        style={{
                          padding: "14px 24px",
                          background: answers.topicOther.trim() ? "linear-gradient(180deg, #d4a817 0%, #b8920e 100%)" : BORDER,
                          color: answers.topicOther.trim() ? "#1a1a1a" : TEXT_TER,
                          border: "none",
                          borderRadius: 12,
                          fontSize: 14,
                          fontWeight: 800,
                          cursor: answers.topicOther.trim() ? "pointer" : "not-allowed",
                          boxShadow: answers.topicOther.trim() ? "0 3px 12px rgba(184,146,14,0.35)" : "none",
                        }}
                      >
                        {copy.btnNext}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {step === "gender" &&
              copy.genderOptions.map((opt) => (
                <div key={opt} style={{ marginBottom: 8, display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => handleChoice("gender", opt)}
                    style={{
                      padding: "14px 20px",
                      background: "#fff",
                      color: TEXT,
                      border: `2px solid ${ACCENT}`,
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(184,146,14,0.12)",
                    }}
                  >
                    {opt}
                  </button>
                </div>
              ))}

            {step === "age" &&
              copy.ageOptions.map((opt) => (
                <div key={opt} style={{ marginBottom: 8, display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => handleChoice("age", opt)}
                    style={{
                      padding: "14px 20px",
                      background: "#fff",
                      color: TEXT,
                      border: `2px solid ${ACCENT}`,
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(184,146,14,0.12)",
                    }}
                  >
                    {opt}
                  </button>
                </div>
              ))}

            {step === "job" && (
              <>
                {!showJobOther &&
                  copy.jobOptions.map((opt) => (
                    <div key={opt} style={{ marginBottom: 8, display: "flex", justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        onClick={() => handleJobChoice(opt)}
                        style={{
                          padding: "14px 20px",
                          background: answers.job === opt ? ACCENT_SUB : "#fff",
                          color: TEXT,
                          border: `2px solid ${answers.job === opt ? ACCENT : ACCENT}`,
                          borderRadius: 12,
                          fontSize: 14,
                          fontWeight: 700,
                          cursor: "pointer",
                          boxShadow: answers.job === opt ? "0 3px 12px rgba(184,146,14,0.25)" : "0 2px 8px rgba(184,146,14,0.12)",
                        }}
                      >
                        {opt}
                      </button>
                    </div>
                  ))}
                {showJobOther && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                    <input
                      type="text"
                      placeholder={copy.placeholderJobOther}
                      value={answers.jobOther}
                      onChange={(e) => setAnswer("jobOther", e.target.value)}
                      style={{
                        width: "100%",
                        maxWidth: 280,
                        padding: "12px 14px",
                        border: `2px solid ${BORDER}`,
                        borderRadius: 12,
                        fontSize: 14,
                        background: "#fff",
                      }}
                    />
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button
                        type="button"
                        onClick={() => { Analytics.chatStepOtherCancel("job"); setAnswer("job", ""); setAnswer("jobOther", ""); }}
                        style={{
                          padding: "14px 24px",
                          background: "#fff",
                          color: TEXT_SEC,
                          border: `2px solid ${BORDER}`,
                          borderRadius: 12,
                          fontSize: 14,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {copy.btnCancel}
                      </button>
                      <button
                        type="button"
                        onClick={handleJobOtherNext}
                        disabled={!answers.jobOther.trim()}
                        style={{
                          padding: "14px 24px",
                          background: answers.jobOther.trim() ? "linear-gradient(180deg, #f0d050 0%, #d4a817 100%)" : BORDER,
                          color: answers.jobOther.trim() ? "#1a1a1a" : TEXT_TER,
                          border: "none",
                          borderRadius: 12,
                          fontSize: 14,
                          fontWeight: 800,
                          cursor: answers.jobOther.trim() ? "pointer" : "not-allowed",
                          boxShadow: answers.jobOther.trim() ? "0 3px 12px rgba(212,168,23,0.4)" : "none",
                        }}
                      >
                        {copy.btnNext}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {step === "interpreter" &&
              copy.interpreterOptions.map((opt) => (
                <div key={opt} style={{ marginBottom: 8, display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => handleChoice("interpreter", opt)}
                    style={{
                      padding: "14px 20px",
                      background: "#fff",
                      color: TEXT,
                      border: `2px solid ${ACCENT}`,
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(184,146,14,0.12)",
                    }}
                  >
                    {opt}
                  </button>
                </div>
              ))}

            {step === "location" && (
              <>
                {!showLocationOther &&
                  copy.locationOptions.map((opt) => (
                    <div key={opt} style={{ marginBottom: 8, display: "flex", justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        onClick={() => handleLocationChoice(opt)}
                        style={{
                          padding: "14px 20px",
                          background: answers.location === opt ? ACCENT_SUB : "#fff",
                          color: TEXT,
                          border: `2px solid ${answers.location === opt ? ACCENT : ACCENT}`,
                          borderRadius: 12,
                          fontSize: 14,
                          fontWeight: 700,
                          cursor: "pointer",
                          boxShadow: answers.location === opt ? "0 3px 12px rgba(184,146,14,0.25)" : "0 2px 8px rgba(184,146,14,0.12)",
                        }}
                      >
                        {opt}
                      </button>
                    </div>
                  ))}
                {showLocationOther && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                    <input
                      type="text"
                      placeholder={copy.placeholderLocationOther}
                      value={answers.locationOther}
                      onChange={(e) => setAnswer("locationOther", e.target.value)}
                      style={{
                        width: "100%",
                        maxWidth: 280,
                        padding: "12px 14px",
                        border: `2px solid ${BORDER}`,
                        borderRadius: 12,
                        fontSize: 14,
                        background: "#fff",
                      }}
                    />
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button
                        type="button"
                        onClick={() => { Analytics.chatStepOtherCancel("location"); setAnswer("location", ""); setAnswer("locationOther", ""); }}
                        style={{
                          padding: "14px 24px",
                          background: "#fff",
                          color: TEXT_SEC,
                          border: `2px solid ${BORDER}`,
                          borderRadius: 12,
                          fontSize: 14,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {copy.btnCancel}
                      </button>
                      <button
                        type="button"
                        onClick={handleLocationOtherNext}
                        disabled={!answers.locationOther.trim()}
                        style={{
                          padding: "14px 24px",
                          background: answers.locationOther.trim() ? "linear-gradient(180deg, #d4a817 0%, #b8920e 100%)" : BORDER,
                          color: answers.locationOther.trim() ? "#1a1a1a" : TEXT_TER,
                          border: "none",
                          borderRadius: 12,
                          fontSize: 14,
                          fontWeight: 800,
                          cursor: answers.locationOther.trim() ? "pointer" : "not-allowed",
                          boxShadow: answers.locationOther.trim() ? "0 3px 12px rgba(184,146,14,0.35)" : "none",
                        }}
                      >
                        {copy.btnNext}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {step === "time" &&
              copy.timeOptions.map((opt) => (
                <div key={opt} style={{ marginBottom: 8, display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => handleChoice("time", opt)}
                    style={{
                      padding: "14px 20px",
                      background: "#fff",
                      color: TEXT,
                      border: `2px solid ${ACCENT}`,
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(184,146,14,0.12)",
                    }}
                  >
                    {opt}
                  </button>
                </div>
              ))}

            {step === "when_join" &&
              copy.whenJoinOptions.map((opt) => (
                <div key={opt} style={{ marginBottom: 8, display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => handleChoice("whenJoin", opt)}
                    style={{
                      padding: "14px 20px",
                      background: "#fff",
                      color: TEXT,
                      border: `2px solid ${ACCENT}`,
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(184,146,14,0.12)",
                    }}
                  >
                    {opt}
                  </button>
                </div>
              ))}

            {step === "email" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" }}>
                <div style={{ width: "100%", maxWidth: 320 }}>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginBottom: 10,
                    }}
                  >
                    {copy.reviews.map((r, idx) => (
                      <div
                        key={idx}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          minHeight: 56,
                          display: "flex",
                          flexDirection: "column",
                          padding: "10px 10px",
                          background: "rgba(255,255,255,0.7)",
                          borderRadius: 12,
                          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                        }}
                      >
                        <p style={{ margin: 0, flex: 1, fontSize: 11, color: TEXT, lineHeight: 1.45, fontWeight: 500 }}>
                          &ldquo;{r.q}&rdquo;
                        </p>
                        <p style={{ margin: "6px 0 0", fontSize: 10, color: TEXT_TER }}>— {r.who}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: TEXT_SEC, lineHeight: 1.5, whiteSpace: "pre-line", textAlign: "right" }}>
                    {copy.reviewNote}
                  </p>
                </div>
                <input
                  type="email"
                  placeholder={copy.placeholderEmail}
                  value={answers.email}
                  onChange={(e) => setAnswer("email", e.target.value)}
                  style={{
                    width: "100%",
                    maxWidth: 280,
                    padding: "12px 14px",
                    border: `2px solid ${BORDER}`,
                    borderRadius: 12,
                    fontSize: 14,
                    background: "#fff",
                  }}
                />
                {error && (
                  <p style={{ margin: 0, fontSize: 12, color: ERROR, fontWeight: 600, alignSelf: "flex-start" }}>
                    {error}
                  </p>
                )}
                <p style={{ margin: 0, fontSize: 11, color: TEXT_TER, lineHeight: 1.5 }}>
                  {copy.consentNote}
                </p>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    padding: "14px 24px",
                    background: loading ? BORDER : "linear-gradient(180deg, #f0d050 0%, #d4a817 100%)",
                    color: loading ? TEXT_TER : "#1a1a1a",
                    border: "none",
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: loading ? "wait" : "pointer",
                    boxShadow: loading ? "none" : "0 3px 12px rgba(212,168,23,0.4)",
                  }}
                >
                  {loading ? copy.btnSubmitting : copy.btnSubmit}
                </button>
              </div>
            )}
          </div>

          <div ref={bottomRef} />
        </div>
      </main>
    </div>
  );
}
