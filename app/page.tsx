"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { Analytics } from "@/lib/analytics";

const BG = "#f4f1ec";
const BORDER = "#e8e3da";
const ACCENT = "#b8920e";
const ACCENT_SUB = "rgba(184,146,14,0.10)";
const TEXT_SEC = "#6b5f54";
const TEXT_TER = "#7a6e64";

const TABS = ["전체", "일·커리어", "사회·가치관", "연애·관계", "돈·라이프"];

type Profile = { gender: string; age: string; job: string };
type Session = {
  tabs: string[];
  topic: string;
  questions: string;
  date: string;
  location: string;
  price: string;
  koreans: Profile[];
  koreanEmpty: number;
  japanese: Profile[];
  japaneseEmpty: number;
  closed: boolean;
};

const SESSIONS: Session[] = [
  {
    tabs: ["전체", "연애·관계"],
    topic: "연애와 고백",
    questions: "국제 연애, 두 나라의 사랑 방식을 이야기합니다.",
    date: "3월 9일(일) 15:00–17:00",
    location: "성수",
    price: "32,000원",
    koreans: [
      { gender: "남", age: "30대", job: "스타트업" },
      { gender: "여", age: "20대", job: "디자이너" },
      { gender: "남", age: "20대", job: "대학원생" },
    ],
    koreanEmpty: 0,
    japanese: [
      { gender: "여", age: "20대", job: "회사원" },
      { gender: "남", age: "30대", job: "프리랜서" },
      { gender: "여", age: "30대", job: "크리에이터" },
    ],
    japaneseEmpty: 0,
    closed: true,
  },
  {
    tabs: ["전체", "일·커리어"],
    topic: "AI와 일의 미래",
    questions: "AI가 바꿀 우리의 일과 커리어에 대해 이야기합니다.",
    date: "3월 16일(일) 14:00–16:00",
    location: "강남",
    price: "32,000원",
    koreans: [
      { gender: "여", age: "30대", job: "컨설턴트" },
      { gender: "남", age: "30대", job: "금융" },
    ],
    koreanEmpty: 1,
    japanese: [
      { gender: "남", age: "30대", job: "IT 엔지니어" },
    ],
    japaneseEmpty: 2,
    closed: false,
  },
  {
    tabs: ["전체", "돈·라이프"],
    topic: "집과 돈",
    questions: "서울과 도쿄, 집과 돈의 현실에 대해 이야기합니다.",
    date: "3월 22일(토) 15:00–17:00",
    location: "한남",
    price: "32,000원",
    koreans: [
      { gender: "남", age: "30대", job: "부동산" },
      { gender: "여", age: "30대", job: "마케터" },
    ],
    koreanEmpty: 1,
    japanese: [
      { gender: "여", age: "20대", job: "회사원" },
    ],
    japaneseEmpty: 2,
    closed: false,
  },
  {
    tabs: ["전체", "사회·가치관"],
    topic: "혼자 사는 삶",
    questions: "혼자 사는 삶의 자유와 고독에 대해 이야기합니다.",
    date: "3월 23일(일) 14:00–16:00",
    location: "성수",
    price: "32,000원",
    koreans: [
      { gender: "여", age: "30대", job: "건축가" },
      { gender: "남", age: "20대", job: "연구원" },
    ],
    koreanEmpty: 1,
    japanese: [
      { gender: "여", age: "20대", job: "크리에이터" },
    ],
    japaneseEmpty: 2,
    closed: false,
  },
  {
    tabs: ["전체", "돈·라이프"],
    topic: "소비와 욕망",
    questions: "소비와 욕망, 우리가 사는 이유를 이야기합니다.",
    date: "3월 30일(일) 15:00–17:00",
    location: "강남",
    price: "32,000원",
    koreans: [
      { gender: "여", age: "20대", job: "콘텐츠 디렉터" },
    ],
    koreanEmpty: 2,
    japanese: [],
    japaneseEmpty: 3,
    closed: false,
  },
  {
    tabs: ["전체", "연애·관계"],
    topic: "결혼과 행복",
    questions: "결혼과 행복, 두 나라의 삶의 조건을 이야기합니다.",
    date: "4월 6일(일) 14:00–16:00",
    location: "한남",
    price: "32,000원",
    koreans: [
      { gender: "여", age: "30대", job: "의사" },
    ],
    koreanEmpty: 2,
    japanese: [],
    japaneseEmpty: 3,
    closed: false,
  },
  {
    tabs: ["전체", "일·커리어"],
    topic: "번아웃과 쉬는 법",
    questions: "번아웃, 우리가 진짜 쉬는 방법을 이야기합니다.",
    date: "4월 12일(토) 15:00–17:00",
    location: "성수",
    price: "32,000원",
    koreans: [
      { gender: "남", age: "30대", job: "창업가" },
    ],
    koreanEmpty: 2,
    japanese: [],
    japaneseEmpty: 3,
    closed: false,
  },
  {
    tabs: ["전체", "사회·가치관"],
    topic: "우리 세대의 불안",
    questions: "우리 세대의 불안과 기대에 대해 이야기합니다.",
    date: "4월 13일(일) 14:00–16:00",
    location: "강남",
    price: "32,000원",
    koreans: [{ gender: "여", age: "20대", job: "대학원생" }],
    koreanEmpty: 2,
    japanese: [{ gender: "남", age: "20대", job: "여행자" }],
    japaneseEmpty: 2,
    closed: false,
  },
  {
    tabs: ["전체", "일·커리어"],
    topic: "이직과 퇴사",
    questions: "이직과 퇴사, 직장을 떠나는 이유를 이야기합니다.",
    date: "4월 19일(토) 15:00–17:00",
    location: "강남",
    price: "32,000원",
    koreans: [{ gender: "남", age: "30대", job: "개발자" }],
    koreanEmpty: 2,
    japanese: [{ gender: "여", age: "30대", job: "회사원" }],
    japaneseEmpty: 2,
    closed: false,
  },
  {
    tabs: ["전체", "연애·관계"],
    topic: "첫사랑과 감정 표현",
    questions: "첫사랑과 짝사랑, 두 나라의 감정 표현을 이야기합니다.",
    date: "4월 20일(일) 14:00–16:00",
    location: "한남",
    price: "32,000원",
    koreans: [{ gender: "여", age: "20대", job: "작가" }],
    koreanEmpty: 2,
    japanese: [{ gender: "남", age: "20대", job: "대학생" }],
    japaneseEmpty: 2,
    closed: false,
  },
  {
    tabs: ["전체", "돈·라이프"],
    topic: "절약과 투자",
    questions: "절약과 투자, 두 나라의 돈 대하는 방식을 이야기합니다.",
    date: "4월 26일(토) 15:00–17:00",
    location: "성수",
    price: "32,000원",
    koreans: [{ gender: "남", age: "30대", job: "금융" }],
    koreanEmpty: 2,
    japanese: [{ gender: "여", age: "30대", job: "프리랜서" }],
    japaneseEmpty: 2,
    closed: false,
  },
  {
    tabs: ["전체", "사회·가치관"],
    topic: "SNS와 비교",
    questions: "SNS와 비교, 타인의 삶을 보는 우리 시선을 이야기합니다.",
    date: "4월 27일(일) 14:00–16:00",
    location: "강남",
    price: "32,000원",
    koreans: [{ gender: "여", age: "20대", job: "콘텐츠 크리에이터" }],
    koreanEmpty: 2,
    japanese: [{ gender: "남", age: "30대", job: "마케터" }],
    japaneseEmpty: 2,
    closed: false,
  },
];

const REVIEWS = [
  {
    text: "통역 덕분에 하고 싶은 말을 다 전할 수 있었어요. 이런 경험은 처음이었습니다.",
    meta: "2025년 12월 성수 세션 · 20대 · 일본 · 프리랜서",
  },
  {
    text: "처음 만나는 사람인데 주제가 있으니 깊은 이야기가 자연스러웠어요. 형식이 오히려 편했어요.",
    meta: "2026년 1월 성수 세션 · 30대 · 일본 · 회사원",
  },
  {
    text: "연애·결혼에 대한 생각이 이렇게 다를 줄 몰랐어요. 솔직히 말할 수 있는 분위기가 좋았어요.",
    meta: "2026년 2월 한남 세션 · 20대 · 일본 · 대학원생",
  },
  {
    text: "일본 스타트업 씬을 현지인에게 직접 들었어요. 아티클과는 완전히 달랐습니다.",
    meta: "2026년 2월 강남 세션 · 30대 · 한국 · IT 기획",
  },
];

function Chip({ p, empty }: { p?: Profile; empty?: boolean }) {
  if (empty) return (
    <span style={{
      display: "inline-block", fontSize: 11, fontWeight: 600,
      padding: "3px 9px", borderRadius: 6,
      border: `1.5px dashed ${BORDER}`, color: "#999", background: BG,
      whiteSpace: "nowrap",
    }}>공석</span>
  );
  if (!p) return null;
  return (
    <span style={{
      display: "inline-block", fontSize: 11, fontWeight: 700,
      padding: "3px 9px", borderRadius: 6,
      background: ACCENT_SUB, color: ACCENT, whiteSpace: "nowrap",
    }}>
      {p.age} · {p.job}
    </span>
  );
}

const PAGE_SIZE = 4;

type User = { name: string; email: string; nation: string };

function useSectionTracking() {
  const trackedSections = useRef<Set<string>>(new Set());

  const observeSection = useCallback((el: HTMLElement | null, section: Parameters<typeof Analytics.scrollReach>[0]) => {
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !trackedSections.current.has(section)) {
          trackedSections.current.add(section);
          Analytics.scrollReach(section);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return observeSection;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("전체");
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState<"signup" | "login">("signup");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [user, setUser] = useState<User | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [applyingTo, setApplyingTo] = useState<Session | null>(null);
  const [confirmingApply, setConfirmingApply] = useState<Session | null>(null);

  const statsRef = useRef<HTMLDivElement>(null);
  const sessionsRef = useRef<HTMLDivElement>(null);
  const whyCccRef = useRef<HTMLElement>(null);
  const reviewsRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  const observeSection = useSectionTracking();

  const filtered = SESSIONS.filter((s) => s.tabs.includes(activeTab));
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // 페이지 진입 + 체류 시간
  useEffect(() => {
    Analytics.pageView();
    const timers = [
      setTimeout(() => Analytics.timeOnPage(15), 15_000),
      setTimeout(() => Analytics.timeOnPage(30), 30_000),
      setTimeout(() => Analytics.timeOnPage(60), 60_000),
      setTimeout(() => Analytics.timeOnPage(120), 120_000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // 섹션 스크롤 추적
  useEffect(() => {
    const cleanups = [
      observeSection(statsRef.current, "stats"),
      observeSection(sessionsRef.current, "sessions"),
      observeSection(whyCccRef.current, "why_ccc"),
      observeSection(reviewsRef.current, "reviews"),
      observeSection(faqRef.current, "faq"),
      observeSection(footerRef.current, "footer"),
    ];
    return () => cleanups.forEach((c) => c?.());
  }, [observeSection]);

  useEffect(() => {
    const saved = localStorage.getItem("ccc_user");
    if (saved) setUser(JSON.parse(saved));
    const wl = localStorage.getItem("ccc_wishlist");
    if (wl) setWishlist(new Set(JSON.parse(wl)));
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const toggleWishlist = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      Analytics.signupModalOpen("wishlist_btn");
      setShowModal(true);
      return;
    }
    setWishlist((prev) => {
      const next = new Set(prev);
      const adding = !next.has(sessionId);
      if (next.has(sessionId)) {
        next.delete(sessionId);
        showToast("찜 목록에서 제거했어요");
      } else {
        next.add(sessionId);
        showToast("찜 목록에 추가했어요");
      }
      Analytics.wishlistClick(sessionId, adding);
      localStorage.setItem("ccc_wishlist", JSON.stringify([...next]));
      return next;
    });
  };

  const handleApply = (s: Session, e: React.MouseEvent) => {
    e.stopPropagation();
    Analytics.applyBtnClick(s.topic, s.closed);
    if (!user) {
      Analytics.signupModalOpen("apply_btn");
      setShowModal(true);
      return;
    }
    Analytics.applyConfirmOpen(s.topic);
    setConfirmingApply(s);
  };

  const openModal = (trigger: Parameters<typeof Analytics.signupModalOpen>[0]) => {
    Analytics.signupModalOpen(trigger);
    setShowModal(true);
  };

  const closeModal = (action: Parameters<typeof Analytics.signupModalDismiss>[0]) => {
    Analytics.signupModalDismiss(action);
    setShowModal(false);
    setModalTab("signup");
    setLoginEmail("");
    setLoginErr("");
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: BG, display: "flex", flexDirection: "column" }}>

      {/* ─── GNB ─── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: BG, borderBottom: `1px solid ${BORDER}`,
        padding: "14px 20px 12px",
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: "#111" }}>CCC</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: TEXT_SEC, letterSpacing: "0.12em" }}>CROSS CULTURAL CLUB</span>
          </div>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: TEXT_TER }}>
            통역 있는 현지인·여행자 3:3 글로벌 토크 클럽
          </p>
        </div>
        <Link href="/jp" style={{ fontSize: 12, color: TEXT_SEC, marginTop: 2 }} onClick={() => Analytics.langSwitch()}>
          🇯🇵 日本語
        </Link>
      </header>

      <main style={{ flex: 1, padding: "24px 16px 24px" }}>

        {/* 히어로 */}
        <section style={{ marginBottom: 20, padding: "0 4px" }}>
          <h1 style={{ margin: "0 0 10px", fontSize: 27, fontWeight: 900, lineHeight: 1.26, letterSpacing: "-0.03em", color: "#111" }}>
            통역사 끼고,<br />여행온 일본인과 3:3 깊은 대화.
          </h1>
          <p style={{ margin: "0 0 14px", fontSize: 14, color: "#7a7067", lineHeight: 1.65 }}>
            일본인 여행자 3명과 한국 거주자 3명이<br />통역사와 함께 2시간 동안 솔직하게 대화합니다.
          </p>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "nowrap", gap: 0, marginTop: 6 }}>
            {["가입", "세션 선택", "신청", "확정", "참여"].map((step, i) => (
              <span key={step} style={{ display: "inline-flex", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: TEXT_SEC }}>{step}</span>
                {i < 4 && <span style={{ fontSize: 11, color: TEXT_TER, margin: "0 4px" }}>→</span>}
              </span>
            ))}
          </div>
        </section>

        {/* 통계 바 */}
        <div ref={statsRef} style={{
          display: "flex", background: "rgba(255,255,255,0.85)",
          border: `1px solid ${BORDER}`, borderRadius: 12, padding: "12px 0", marginBottom: 22,
        }}>
          {[
            { n: "매일", label: "정기 개최" },
            { n: "247명", label: "누적 참가" },
            { n: "100%", label: "통역사 동행" },
          ].map((s, i) => (
            <div key={s.label} style={{ flex: 1, textAlign: "center", borderRight: i < 2 ? `1px solid ${BORDER}` : "none" }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: ACCENT }}>{s.n}</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: TEXT_SEC }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* 탭 */}
        <div style={{ display: "flex", gap: 7, marginBottom: 18, overflowX: "auto", scrollbarWidth: "none" }}>
          {TABS.map((tab) => (
            <button key={tab} onClick={() => {
              Analytics.tabClick(tab);
              setActiveTab(tab);
              setVisibleCount(PAGE_SIZE);
            }} style={{
              padding: "7px 13px", borderRadius: 20,
              fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", cursor: "pointer",
              border: activeTab === tab ? `1.5px solid ${ACCENT}` : `1.5px solid ${BORDER}`,
              background: activeTab === tab ? ACCENT_SUB : "rgba(255,255,255,0.7)",
              color: activeTab === tab ? ACCENT : TEXT_SEC, transition: "all 0.15s",
            }}>{tab}</button>
          ))}
        </div>

        {/* 세션 카드 */}
        <div ref={sessionsRef} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {visible.map((s) => {
            const category = s.tabs.find(t => t !== "전체") ?? s.tabs[0];
            return (
              <article key={s.questions} onClick={() => {
                Analytics.sessionCardClick(s.topic, s.date);
                openModal("card_click");
              }} style={{
                border: `1px solid ${BORDER}`, borderRadius: 16,
                padding: "18px", background: "#fff", cursor: "pointer",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: ACCENT,
                    background: ACCENT_SUB, padding: "2px 8px", borderRadius: 4,
                    whiteSpace: "nowrap",
                  }}>{category}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: s.closed ? TEXT_SEC : "#16a34a",
                    background: s.closed ? "rgba(107,95,84,0.08)" : "rgba(22,163,74,0.09)",
                    padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap",
                  }}>{s.closed ? "모집 완료" : "모집 중"}</span>
                </div>

                <p style={{
                  margin: "0 0 14px", fontSize: 15, fontWeight: 800,
                  lineHeight: 1.45, letterSpacing: "-0.02em", color: "#111",
                  display: "-webkit-box", WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical", overflow: "hidden",
                } as React.CSSProperties}>{s.questions}</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
                  {[
                    { label: "일시", value: s.date },
                    { label: "장소", value: `${s.location} 아지트` },
                    { label: "가격", value: `${s.price} (정가 40,000원)` },
                  ].map((r) => (
                    <div key={r.label} style={{ display: "flex", gap: 10, fontSize: 13 }}>
                      <span style={{ color: TEXT_SEC, minWidth: 32, flexShrink: 0 }}>{r.label}</span>
                      <span style={{ fontWeight: 600, color: "#333" }}>{r.value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 13, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: TEXT_SEC }}>한국 측</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {s.koreans.map((p, i) => <Chip key={i} p={p} />)}
                      {Array.from({ length: s.koreanEmpty }).map((_, i) => <Chip key={`ke-${i}`} empty />)}
                    </div>
                  </div>
                  <div>
                    <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: TEXT_SEC }}>일본 측</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {s.japanese.map((p, i) => <Chip key={i} p={p} />)}
                      {Array.from({ length: s.japaneseEmpty }).map((_, i) => <Chip key={`je-${i}`} empty />)}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                    <button onClick={(e) => toggleWishlist(s.questions, e)} style={{
                      padding: "9px 14px",
                      border: `1.5px solid ${wishlist.has(s.questions) ? ACCENT : BORDER}`,
                      borderRadius: 10,
                      background: wishlist.has(s.questions) ? ACCENT_SUB : "#fff",
                      color: wishlist.has(s.questions) ? ACCENT : TEXT_SEC,
                      fontSize: 12, fontWeight: 700, cursor: "pointer",
                      whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4,
                      transition: "all 0.15s",
                    }}>
                      {wishlist.has(s.questions) ? "♥ 찜완료" : "♡ 찜하기"}
                    </button>
                    <button onClick={(e) => handleApply(s, e)} style={{
                      flex: 1, padding: "9px 0", border: "none", borderRadius: 10,
                      background: s.closed ? TEXT_SEC : "#111",
                      color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer",
                    }}>{s.closed ? "대기 신청 →" : "신청하기 →"}</button>
                  </div>
                </div>
              </article>
            );
          })}

          {hasMore ? (
            <button
              onClick={() => {
                Analytics.showMoreClick(visibleCount);
                setVisibleCount((c) => c + PAGE_SIZE);
              }}
              style={{
                width: "100%", padding: "14px 0",
                border: `1.5px solid ${BORDER}`, borderRadius: 14,
                background: "#fff", color: TEXT_SEC,
                fontSize: 13, fontWeight: 700, cursor: "pointer",
              }}
            >
              세션 더보기 ({filtered.length - visibleCount}개 남음)
            </button>
          ) : (
            <div onClick={() => {
              Analytics.notifyCardClick();
              openModal("notify_card");
            }} style={{
              border: `1.5px dashed ${BORDER}`, borderRadius: 16,
              padding: "20px", textAlign: "center", cursor: "pointer",
              background: "rgba(255,255,255,0.9)",
            }}>
              <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 800, color: TEXT_SEC }}>세션은 계속 추가되고 있어요</p>
              <p style={{ margin: "0 0 12px", fontSize: 12, color: TEXT_TER }}>가입하면 새 세션 알림을 먼저 받아요</p>
              <span style={{ fontSize: 13, fontWeight: 800, color: ACCENT, background: ACCENT_SUB, padding: "7px 16px", borderRadius: 20 }}>
                알림 받기 →
              </span>
            </div>
          )}
        </div>

        {/* ─── 안심 포인트 ─── */}
        <section ref={whyCccRef} style={{ marginTop: 40 }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: TEXT_SEC, letterSpacing: "0.08em" }}>WHY CCC</p>
          <h2 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.02em" }}>
            걱정 없이 참여할 수 있어요
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: "1", title: "장소도 사람도, CCC가 모두 준비합니다", desc: "낯선 곳에 혼자 가는 게 아니에요. 공간 섭외, 참가자 매칭, 현장 진행까지 CCC가 직접 관리합니다." },
              { icon: "2", title: "한일 전문 통역사 100% 동석", desc: "평균 경력 5년 이상의 전문 통역사가 세션 주제에 맞춰 배정됩니다. 언어 걱정 없이 하고 싶은 말을 전하세요." },
              { icon: "3", title: "진행자가 대화 흐름 조율", desc: "어색해져도 진행자가 자연스럽게 이어줍니다." },
              { icon: "4", title: "가입 후 원하는 세션 자유 참여", desc: "가입만 해두고, 원할 때 원하는 세션에 신청하면 됩니다." },
              { icon: "5", title: "뒷풀이도 선택 가능", desc: "원하는 사람들끼리 뒷풀이를 이어갈 수도 있어요. (선택)" },
              { icon: "6", title: "전액 환불 보장", desc: "여행 일정이 바뀌어도 걱정 없어요. 전날까지 취소 시 전액 환불, 참여 후 불만족해도 전액 환불해드려요." },
            ].map((item) => (
              <div key={item.title} style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                background: "#fff", border: `1px solid ${BORDER}`,
                borderRadius: 14, padding: "14px 16px",
              }}>
                <span style={{
                  width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                  background: ACCENT_SUB, color: ACCENT,
                  fontSize: 12, fontWeight: 900,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginTop: 1,
                }}>{item.icon}</span>
                <div>
                  <p style={{ margin: "0 0 3px", fontSize: 14, fontWeight: 800, color: "#111" }}>{item.title}</p>
                  <p style={{ margin: 0, fontSize: 12, color: TEXT_TER, lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 후기 ─── */}
        <section ref={reviewsRef} style={{ marginTop: 40 }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: TEXT_SEC, letterSpacing: "0.08em" }}>REVIEWS</p>
          <h2 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.02em" }}>
            직접 경험한 분들의 이야기
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{
                background: "#fff", border: `1px solid ${BORDER}`,
                borderRadius: 14, padding: "18px",
              }}>
                <p style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 500, lineHeight: 1.7, color: "#222" }}>
                  &ldquo;{r.text}&rdquo;
                </p>
                <p style={{ margin: 0, fontSize: 11, color: TEXT_TER, fontWeight: 600 }}>{r.meta}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section ref={faqRef} style={{ marginTop: 40 }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: TEXT_SEC, letterSpacing: "0.08em" }}>FAQ</p>
          <h2 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.02em" }}>
            자주 묻는 질문
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { q: "신청하면 어떻게 진행되나요?", a: "세션을 신청하시면 결제가 함께 진행됩니다. 24시간 이내에 참여 확정 안내를 이메일로 드리며, 인원 구성이 어려운 경우에는 전액을 돌려드립니다." },
              { q: "결제는 어떻게 이루어지나요?", a: "세션 신청과 동시에 결제가 진행됩니다. 확정 이후 당일 장소와 준비사항을 별도로 안내해 드립니다." },
              { q: "세션은 어디서 진행되나요?", a: "강남·성수·한남 등 CCC 전용 공간에서 진행됩니다. 정확한 장소는 참여 확정 후 안내드립니다." },
              { q: "일본어를 전혀 못해도 괜찮을까요?", a: "한국어만으로도 충분히 참여하실 수 있습니다. 평균 경력 5년 이상의 전문 한일 통역사가 대화 전반을 함께합니다." },
              { q: "가입 후 바로 신청해야 하나요?", a: "그렇지 않습니다. 가입 후 원하시는 시점에 언제든 세션을 살펴보고 신청하실 수 있으며, 새로운 세션 알림도 받아보실 수 있습니다." },
            ].map((item, i) => (
              <div key={i} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 18px" }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: ACCENT, flexShrink: 0, lineHeight: 1.9 }}>Q</span>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: "#111", lineHeight: 1.6 }}>{item.q}</p>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: TEXT_TER, flexShrink: 0, lineHeight: 1.9 }}>A</span>
                  <p style={{ margin: 0, fontSize: 13, color: TEXT_SEC, lineHeight: 1.75 }}>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ─── 푸터 ─── */}
      <footer ref={footerRef} style={{
        background: BG, borderTop: `1px solid ${BORDER}`,
        padding: `12px 20px calc(68px + env(safe-area-inset-bottom, 0px))`,
        textAlign: "center",
      }}>
        <p style={{ margin: "0 0 4px", fontSize: 14, color: TEXT_TER, fontStyle: "italic" }}>Think Globally.</p>
        <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, color: TEXT_SEC, letterSpacing: "0.1em" }}>CROSS CULTURAL CLUB</p>
        <p style={{ margin: 0, fontSize: 11, color: TEXT_TER }}>© 2026 CROSS CULTURAL CLUB. All rights reserved.</p>
      </footer>

      {/* ─── 바텀 네비 ─── */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto",
        background: "#fff", boxShadow: "0 -2px 20px rgba(100,80,60,0.10)",
        display: "flex", zIndex: 100,
      }}>
        <button style={{
          flex: 1, position: "relative", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: `12px 0 calc(12px + env(safe-area-inset-bottom, 0px))`,
          background: "none", border: "none", cursor: "default",
        }}>
          <span style={{ position: "absolute", top: 0, left: "35%", right: "35%", height: 2.5, borderRadius: 2, background: ACCENT }} />
          <span style={{ fontSize: 13, fontWeight: 800, color: ACCENT }}>홈</span>
        </button>
        {user ? (
          <a href="/mypage" onClick={() => Analytics.mypageNavClick()} style={{
            flex: 1, position: "relative", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: `12px 0 calc(12px + env(safe-area-inset-bottom, 0px))`,
            textDecoration: "none",
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_SEC }}>마이페이지</span>
          </a>
        ) : (
          <button onClick={() => {
            Analytics.mypageNavClick();
            openModal("mypage_btn");
          }} style={{
            flex: 1, position: "relative", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: `12px 0 calc(12px + env(safe-area-inset-bottom, 0px))`,
            background: "none", border: "none", cursor: "pointer",
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_SEC }}>마이페이지</span>
          </button>
        )}
      </nav>

      {/* ─── 토스트 ─── */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 88, left: "50%", transform: "translateX(-50%)",
          background: "#1a1a1a", color: "#fff",
          padding: "10px 20px", borderRadius: 20,
          fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
          zIndex: 400, boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          pointerEvents: "none",
        }}>{toast}</div>
      )}

      {/* ─── 신청 확인 모달 (1단계) ─── */}
      {confirmingApply && (
        <div onClick={() => {
          Analytics.applyConfirmCancel(confirmingApply.topic);
          setConfirmingApply(null);
        }} style={{
          position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(6px)", display: "flex", alignItems: "center",
          justifyContent: "center", padding: 24,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: "100%", maxWidth: 360, background: "#fff",
            borderRadius: 28, padding: "32px 24px 24px", textAlign: "center",
            boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
          }}>
            <p style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 900, color: "#111" }}>신청하시겠습니까?</p>
            <div style={{
              background: BG, border: `1px solid ${BORDER}`,
              borderRadius: 12, padding: "12px 16px", margin: "16px 0", textAlign: "left",
            }}>
              <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 800, color: "#111", lineHeight: 1.4 }}>
                {confirmingApply.questions}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: TEXT_TER }}>
                {confirmingApply.date} · {confirmingApply.location} 아지트
              </p>
            </div>
            <p style={{ margin: "0 0 20px", fontSize: 12, color: TEXT_TER, lineHeight: 1.7 }}>
              최종 인원 확정 시 이메일로 알려드립니다.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => {
                Analytics.applyConfirmCancel(confirmingApply.topic);
                setConfirmingApply(null);
              }} style={{
                flex: 1, padding: "13px 0", border: `1.5px solid ${BORDER}`, borderRadius: 12,
                background: "#fff", color: TEXT_SEC, fontSize: 14, fontWeight: 700, cursor: "pointer",
              }}>취소</button>
              <button onClick={() => {
                Analytics.applyConfirmProceed(confirmingApply.topic);
                Analytics.applyReceiptView(confirmingApply.topic);
                setApplyingTo(confirmingApply);
                setConfirmingApply(null);
              }} style={{
                flex: 2, padding: "13px 0", border: "none", borderRadius: 12,
                background: "#111", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer",
              }}>신청하기</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 신청 접수 모달 (2단계) ─── */}
      {applyingTo && (
        <div onClick={() => {
          Analytics.applyReceiptClose(applyingTo.topic);
          setApplyingTo(null);
        }} style={{
          position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(6px)", display: "flex", alignItems: "center",
          justifyContent: "center", padding: 24,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: "100%", maxWidth: 360, background: "#fff",
            borderRadius: 28, padding: "36px 24px 28px", textAlign: "center",
            boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: ACCENT_SUB, border: `2px solid ${ACCENT}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, color: ACCENT, fontWeight: 900,
              margin: "0 auto 16px",
            }}>✓</div>
            <p style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 900, color: "#111" }}>
              신청이 접수되었어요
            </p>
            <p style={{ margin: "0 0 20px", fontSize: 12, color: TEXT_TER }}>
              담당자가 참가자 구성을 확인 후<br />24시간 내 이메일로 확정 안내 드릴게요.
            </p>
            <div style={{
              background: BG, border: `1px solid ${BORDER}`,
              borderRadius: 12, padding: "12px 16px", marginBottom: 20, textAlign: "left",
            }}>
              <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 800, color: "#111", lineHeight: 1.4 }}>
                {applyingTo.questions}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: TEXT_TER }}>
                {applyingTo.date} · {applyingTo.location} 아지트
              </p>
            </div>
            <button onClick={() => {
              Analytics.applyReceiptClose(applyingTo.topic);
              setApplyingTo(null);
            }} style={{
              width: "100%", padding: "14px", border: "none", borderRadius: 12,
              background: "#111", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer",
            }}>확인</button>
          </div>
        </div>
      )}

      {/* ─── 모달 ─── */}
      {showModal && (
        <div onClick={() => closeModal("backdrop")} style={{
          position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(6px)", display: "flex", alignItems: "center",
          justifyContent: "center", padding: 24,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: "100%", maxWidth: 360, background: "#fff",
            borderRadius: 28, padding: "28px 24px 24px", textAlign: "center",
            boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
          }}>
            <div style={{ display: "flex", background: BG, borderRadius: 12, padding: 4, marginBottom: 24 }}>
              {(["signup", "login"] as const).map((tab) => (
                <button key={tab} onClick={() => {
                  Analytics.signupModalTabSwitch(tab);
                  setModalTab(tab);
                  setLoginErr("");
                }} style={{
                  flex: 1, padding: "9px 0", borderRadius: 9, border: "none", cursor: "pointer",
                  background: modalTab === tab ? "#fff" : "transparent",
                  color: modalTab === tab ? "#111" : TEXT_TER,
                  fontSize: 13, fontWeight: modalTab === tab ? 800 : 600,
                  boxShadow: modalTab === tab ? "0 1px 6px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s",
                }}>
                  {tab === "signup" ? "멤버 가입" : "로그인"}
                </button>
              ))}
            </div>

            {modalTab === "signup" ? (
              <>
                <p style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 900, letterSpacing: "-0.02em" }}>CCC 멤버 가입</p>
                <p style={{ margin: "0 0 18px", fontSize: 13, color: TEXT_TER }}>가입 무료 · 카드 등록 불필요</p>
                <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "14px 16px", marginBottom: 18, textAlign: "left" }}>
                  <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 800, color: TEXT_SEC }}>가입하면 할 수 있어요</p>
                  {["마음에 드는 세션 찜하기 (나중에 신청 가능)", "새 세션 오픈 알림 먼저 받기", "참여 후 커뮤니티 접근"].map((t) => (
                    <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                      <span style={{ color: ACCENT, fontWeight: 800, fontSize: 13, lineHeight: "1.5", flexShrink: 0 }}>✓</span>
                      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: "#333" }}>{t}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/signup"
                  onClick={() => Analytics.signupModalCtaClick()}
                  style={{ display: "block", padding: "15px", background: "#111", color: "#fff", borderRadius: 12, fontSize: 14, fontWeight: 800, marginBottom: 10 }}
                >
                  무료로 시작하기
                </Link>
                <button onClick={() => closeModal("later_btn")} style={{ display: "block", width: "100%", padding: "10px", background: "none", border: "none", fontSize: 13, color: "#aaa", fontWeight: 700, cursor: "pointer" }}>
                  다음에 하기
                </button>
              </>
            ) : (
              <>
                <p style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 900, color: "#111", letterSpacing: "-0.02em" }}>멤버 로그인</p>
                <p style={{ margin: "0 0 20px", fontSize: 12, color: TEXT_TER, whiteSpace: "nowrap" }}>가입 시 사용한 이메일로 로그인할 수 있어요</p>
                <input
                  value={loginEmail}
                  onChange={(e) => { setLoginEmail(e.target.value); setLoginErr(""); }}
                  placeholder="hello@example.com"
                  type="email"
                  style={{
                    width: "100%", padding: "13px 14px", boxSizing: "border-box",
                    border: `1.5px solid ${loginErr ? "#e54d4d" : BORDER}`, borderRadius: 10,
                    background: BG, fontSize: 14, color: "#111", outline: "none", marginBottom: 8,
                  }}
                />
                {loginErr && <p style={{ margin: "0 0 12px", fontSize: 12, color: "#e54d4d", textAlign: "left" }}>{loginErr}</p>}
                <button onClick={() => {
                  Analytics.loginAttempt();
                  const stored = localStorage.getItem("ccc_user");
                  if (!stored) {
                    Analytics.loginFail("no_account");
                    setLoginErr("등록된 계정을 찾을 수 없어요. 먼저 가입해주세요.");
                    return;
                  }
                  const u = JSON.parse(stored);
                  if (u.email.trim().toLowerCase() !== loginEmail.trim().toLowerCase()) {
                    Analytics.loginFail("email_mismatch");
                    setLoginErr("이메일이 일치하지 않아요.");
                    return;
                  }
                  Analytics.loginSuccess();
                  setUser(u);
                  closeModal("backdrop");
                }} style={{
                  width: "100%", padding: "14px", border: "none", borderRadius: 12,
                  background: loginEmail.trim() ? "#111" : "#ccc",
                  color: "#fff", fontSize: 14, fontWeight: 800,
                  cursor: loginEmail.trim() ? "pointer" : "not-allowed", marginBottom: 10,
                }}>로그인</button>
                <button onClick={() => closeModal("close_btn")} style={{ display: "block", width: "100%", padding: "8px", background: "none", border: "none", fontSize: 13, color: "#aaa", fontWeight: 700, cursor: "pointer" }}>
                  닫기
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
