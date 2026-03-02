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

const TABS = ["すべて", "仕事・キャリア", "社会・価値観", "恋愛・関係", "お金・暮らし"];

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
    tabs: ["すべて", "恋愛・関係"],
    topic: "恋愛と告白",
    questions: "両国の恋愛スタイルについて話します。",
    date: "3月9日(日) 15:00–17:00",
    location: "ソンス",
    price: "¥3,200",
    koreans: [
      { gender: "男", age: "30代", job: "スタートアップ" },
      { gender: "女", age: "20代", job: "デザイナー" },
      { gender: "男", age: "20代", job: "大学院生" },
    ],
    koreanEmpty: 0,
    japanese: [
      { gender: "女", age: "20代", job: "会社員" },
      { gender: "男", age: "30代", job: "フリーランス" },
      { gender: "女", age: "30代", job: "クリエイター" },
    ],
    japaneseEmpty: 0,
    closed: true,
  },
  {
    tabs: ["すべて", "仕事・キャリア"],
    topic: "仕事とキャリア",
    questions: "AIと仕事の変化について話します。",
    date: "3月16日(日) 14:00–16:00",
    location: "カンナム",
    price: "¥3,200",
    koreans: [
      { gender: "女", age: "30代", job: "コンサルタント" },
      { gender: "男", age: "30代", job: "金融" },
    ],
    koreanEmpty: 1,
    japanese: [
      { gender: "男", age: "30代", job: "ITエンジニア" },
    ],
    japaneseEmpty: 2,
    closed: false,
  },
  {
    tabs: ["すべて", "お金・暮らし"],
    topic: "お金と家",
    questions: "両国のお金と暮らしについて話します。",
    date: "3月22日(土) 15:00–17:00",
    location: "ハンナム",
    price: "¥3,200",
    koreans: [
      { gender: "男", age: "30代", job: "不動産" },
      { gender: "女", age: "30代", job: "マーケター" },
    ],
    koreanEmpty: 1,
    japanese: [
      { gender: "女", age: "20代", job: "会社員" },
    ],
    japaneseEmpty: 2,
    closed: false,
  },
  {
    tabs: ["すべて", "社会・価値観"],
    topic: "一人暮らしと孤独",
    questions: "一人暮らしの孤独と自由について話します。",
    date: "3月23日(日) 14:00–16:00",
    location: "ソンス",
    price: "¥3,200",
    koreans: [
      { gender: "女", age: "30代", job: "建築家" },
      { gender: "男", age: "20代", job: "研究者" },
    ],
    koreanEmpty: 1,
    japanese: [
      { gender: "女", age: "20代", job: "クリエイター" },
    ],
    japaneseEmpty: 2,
    closed: false,
  },
  {
    tabs: ["すべて", "お金・暮らし"],
    topic: "消費と欲望",
    questions: "消費と欲望、買う理由について話します。",
    date: "3月30日(日) 15:00–17:00",
    location: "カンナム",
    price: "¥3,200",
    koreans: [
      { gender: "女", age: "20代", job: "コンテンツD" },
    ],
    koreanEmpty: 2,
    japanese: [],
    japaneseEmpty: 3,
    closed: false,
  },
  {
    tabs: ["すべて", "恋愛・関係"],
    topic: "結婚と幸せ",
    questions: "結婚と幸せ、生き方の条件について話します。",
    date: "4月6日(日) 14:00–16:00",
    location: "ハンナム",
    price: "¥3,200",
    koreans: [
      { gender: "女", age: "30代", job: "医師" },
    ],
    koreanEmpty: 2,
    japanese: [],
    japaneseEmpty: 3,
    closed: false,
  },
  {
    tabs: ["すべて", "仕事・キャリア"],
    topic: "休息とバーンアウト",
    questions: "バーンアウトと休息について話します。",
    date: "4月12日(土) 15:00–17:00",
    location: "ソンス",
    price: "¥3,200",
    koreans: [
      { gender: "男", age: "30代", job: "起業家" },
    ],
    koreanEmpty: 2,
    japanese: [],
    japaneseEmpty: 3,
    closed: false,
  },
  {
    tabs: ["すべて", "社会・価値観"],
    topic: "未来と不安",
    questions: "私たちの不安と期待について話します。",
    date: "4月13日(日) 14:00–16:00",
    location: "カンナム",
    price: "¥3,200",
    koreans: [{ gender: "女", age: "20代", job: "大学院生" }],
    koreanEmpty: 2,
    japanese: [{ gender: "男", age: "20代", job: "旅行者" }],
    japaneseEmpty: 2,
    closed: false,
  },
  {
    tabs: ["すべて", "仕事・キャリア"],
    topic: "転職と退職",
    questions: "転職と退職の理由について話します。",
    date: "4月19日(土) 15:00–17:00",
    location: "カンナム",
    price: "¥3,200",
    koreans: [{ gender: "男", age: "30代", job: "エンジニア" }],
    koreanEmpty: 2,
    japanese: [{ gender: "女", age: "30代", job: "会社員" }],
    japaneseEmpty: 2,
    closed: false,
  },
  {
    tabs: ["すべて", "恋愛・関係"],
    topic: "初恋と感情表現",
    questions: "初恋と感情の表し方について話します。",
    date: "4月20日(日) 14:00–16:00",
    location: "ハンナム",
    price: "¥3,200",
    koreans: [{ gender: "女", age: "20代", job: "作家" }],
    koreanEmpty: 2,
    japanese: [{ gender: "男", age: "20代", job: "学生" }],
    japaneseEmpty: 2,
    closed: false,
  },
  {
    tabs: ["すべて", "お金・暮らし"],
    topic: "節約と投資",
    questions: "節約と投資、お金の向き合い方について話します。",
    date: "4月26日(土) 15:00–17:00",
    location: "ソンス",
    price: "¥3,200",
    koreans: [{ gender: "男", age: "30代", job: "金融" }],
    koreanEmpty: 2,
    japanese: [{ gender: "女", age: "30代", job: "フリーランス" }],
    japaneseEmpty: 2,
    closed: false,
  },
  {
    tabs: ["すべて", "社会・価値観"],
    topic: "SNSと比較",
    questions: "SNSと比較、他者の生き方について話します。",
    date: "4月27日(日) 14:00–16:00",
    location: "カンナム",
    price: "¥3,200",
    koreans: [{ gender: "女", age: "20代", job: "クリエイター" }],
    koreanEmpty: 2,
    japanese: [{ gender: "男", age: "30代", job: "マーケター" }],
    japaneseEmpty: 2,
    closed: false,
  },
];

const REVIEWS = [
  {
    text: "言葉が通じるか心配だったけど、通訳がいるから言いたいことを全部伝えられました。こんな体験は初めてでした。",
    meta: "2025年12月 ソンスセッション · 20代 · 日本 · フリーランス",
  },
  {
    text: "初対面なのに、テーマがあるから自然と深い話になりました。形式があるほうが、むしろ気が楽でした。",
    meta: "2026年1月 ソンスセッション · 30代 · 日本 · 会社員",
  },
  {
    text: "恋愛や結婚についての考え方がこんなに違うとは思わなかったです。本音で話せる雰囲気がよかったです。",
    meta: "2026年2月 ハンナムセッション · 20代 · 日本 · 大学院生",
  },
  {
    text: "日本のスタートアップ事情について、現地で働く人から直接聞けました。記事を読むのとは全然違いました。",
    meta: "2026年2月 カンナムセッション · 30代 · 韓国 · ITプランナー",
  },
];

function Chip({ p, empty }: { p?: Profile; empty?: boolean }) {
  if (empty) return (
    <span style={{
      display: "inline-block", fontSize: 11, fontWeight: 600,
      padding: "3px 9px", borderRadius: 6,
      border: `1.5px dashed ${BORDER}`, color: "#999", background: BG,
      whiteSpace: "nowrap",
    }}>空席</span>
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

// 섹션 IntersectionObserver 훅
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

export default function JpHome() {
  const [activeTab, setActiveTab] = useState("すべて");
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

  // 섹션 ref
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

  // 로컬스토리지 초기화
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
        showToast("気になるリストから削除しました");
      } else {
        next.add(sessionId);
        showToast("気になるリストに追加しました");
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
          <p style={{ margin: "4px 0 0", fontSize: 11, color: TEXT_TER }}>通訳付きの現地人×旅行者 3:3 対話クラブ</p>
        </div>
        <Link
          href="/"
          style={{ fontSize: 12, color: TEXT_SEC, marginTop: 2 }}
          onClick={() => Analytics.langSwitch()}
        >
          🇰🇷 한국어
        </Link>
      </header>

      <main style={{ flex: 1, padding: "24px 16px 24px" }}>

        {/* 히어로 */}
        <section style={{ marginBottom: 20, padding: "0 4px" }}>
          <h1 style={{ margin: "0 0 10px", fontSize: 27, fontWeight: 900, lineHeight: 1.26, letterSpacing: "-0.03em", color: "#111" }}>
            通訳者付きで、<br />韓国人と3:3の深い会話。
          </h1>
          <p style={{ margin: "0 0 14px", fontSize: 14, color: "#7a7067", lineHeight: 1.65 }}>
            韓国在住の現地人3名と旅行者3名が<br />通訳者と共に2時間、本音で語り合います。
          </p>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "nowrap", gap: 0, marginTop: 6 }}>
            {["登録", "セッション選択", "申込", "確定・決済", "参加"].map((step, i) => (
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
            { n: "毎日", label: "定期開催" },
            { n: "247名", label: "累計参加" },
            { n: "100%", label: "通訳者同席" },
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
            const category = s.tabs.find(t => t !== "すべて") ?? s.tabs[0];
            return (
              <article key={s.questions} onClick={() => {
                Analytics.sessionCardClick(s.topic, s.date);
                openModal("card_click");
              }} style={{
                border: `1px solid ${BORDER}`, borderRadius: 16,
                padding: "18px", background: "#fff", cursor: "pointer",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}>
                {/* 카테고리 + 상태 */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: ACCENT,
                    background: ACCENT_SUB, padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap",
                  }}>{category}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: s.closed ? TEXT_SEC : "#16a34a",
                    background: s.closed ? "rgba(107,95,84,0.08)" : "rgba(22,163,74,0.09)",
                    padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap",
                  }}>{s.closed ? "募集終了" : "募集中"}</span>
                </div>

                {/* 주제 */}
                <p style={{
                  margin: "0 0 14px", fontSize: 15, fontWeight: 800,
                  lineHeight: 1.45, color: "#111",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{s.questions}</p>

                {/* 기본 정보 */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
                  {[
                    { label: "日時", value: s.date },
                    { label: "場所", value: `${s.location} 専用会場` },
                    { label: "料金", value: `${s.price}（通常¥4,000）` },
                  ].map((r) => (
                    <div key={r.label} style={{ display: "flex", gap: 10, fontSize: 13 }}>
                      <span style={{ color: TEXT_SEC, minWidth: 32, flexShrink: 0 }}>{r.label}</span>
                      <span style={{ fontWeight: 600, color: "#333" }}>{r.value}</span>
                    </div>
                  ))}
                </div>

                {/* 참가자 + 버튼 */}
                <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 13, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: TEXT_SEC }}>韓国側</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {s.koreans.map((p, i) => <Chip key={i} p={p} />)}
                      {Array.from({ length: s.koreanEmpty }).map((_, i) => <Chip key={`ke-${i}`} empty />)}
                    </div>
                  </div>
                  <div>
                    <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: TEXT_SEC }}>日本側</p>
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
                      {wishlist.has(s.questions) ? "♥ 気になる登録済" : "♡ 気になる"}
                    </button>
                    <button onClick={(e) => handleApply(s, e)} style={{
                      flex: 1, padding: "9px 0", border: "none", borderRadius: 10,
                      background: s.closed ? TEXT_SEC : "#111",
                      color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer",
                    }}>{s.closed ? "キャンセル待ち →" : "申し込む →"}</button>
                  </div>
                </div>
              </article>
            );
          })}

          {/* 더보기 버튼 or 알림 카드 */}
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
              セッションをもっと見る（残り{filtered.length - visibleCount}件）
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
              <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 800, color: TEXT_SEC }}>セッションは続々と追加中</p>
              <p style={{ margin: "0 0 12px", fontSize: 12, color: TEXT_TER }}>登録で新着通知を受け取れます</p>
              <span style={{ fontSize: 13, fontWeight: 800, color: ACCENT, background: ACCENT_SUB, padding: "7px 16px", borderRadius: 20 }}>
                通知を受け取る →
              </span>
            </div>
          )}
        </div>

        {/* ─── 安心ポイント ─── */}
        <section ref={whyCccRef} style={{ marginTop: 40 }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: TEXT_SEC, letterSpacing: "0.08em" }}>WHY CCC</p>
          <h2 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.02em" }}>
            安心して参加できます
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: "1", title: "場所も人も、CCCがすべて準備します", desc: "知らない場所に一人で行くのではありません。会場・参加者・進行まですべてCCCが管理します。" },
              { icon: "2", title: "日韓専門通訳者が100%同席", desc: "平均経験5年以上の専門通訳者がセッションのテーマに合わせて配置されます。言葉の壁を気にせず話せます。" },
              { icon: "3", title: "進行者が会話の流れを調整", desc: "進行者がスムーズに会話をつなぎます。" },
              { icon: "4", title: "登録後、自由にセッション参加", desc: "登録しておいて、参加したい日に申し込むだけ。" },
              { icon: "5", title: "打ち上げも選択可", desc: "希望者同士で打ち上げを続けることもできます。（任意）" },
              { icon: "6", title: "全額返金保証", desc: "旅行の予定が変わっても安心。前日までのキャンセルで全額返金。参加後の不満でも全額返金します。" },
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
          <h2 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.02em" }}>参加者の声</h2>
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
            よくある質問
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { q: "申し込み後はどのように進みますか？", a: "セッションをお申し込みいただくと、同時に決済が進みます。24時間以内に参加確定のご連絡をメールにてお送りします。定員が揃わない場合は全額ご返金いたします。" },
              { q: "決済はどのように行われますか？", a: "セッションの申込と同時に決済が進みます。ご確定後、当日の会場案内および準備事項を別途お送りします。" },
              { q: "どこで開催されますか？", a: "江南・聖水・漢南エリアのCCC専用会場で開催いたします。正確な場所は参加確定後に別途ご案内します。" },
              { q: "韓国語が話せなくても参加できますか？", a: "日本語のみで問題ございません。平均経験5年以上の専門通訳者が会話全体をサポートします。" },
              { q: "登録後すぐに申し込まなければなりませんか？", a: "そのようなことはありません。登録後はご都合の良いタイミングでセッションをご覧いただき、お申し込みいただけます。新着通知もお受け取りいただけます。" },
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
          <span style={{ fontSize: 13, fontWeight: 800, color: ACCENT }}>ホーム</span>
        </button>
        {user ? (
          <a href="/jp/mypage" onClick={() => Analytics.mypageNavClick()} style={{
            flex: 1, position: "relative", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: `12px 0 calc(12px + env(safe-area-inset-bottom, 0px))`,
            textDecoration: "none",
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_SEC }}>マイページ</span>
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
            <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_SEC }}>マイページ</span>
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

      {/* ─── 申込確認モーダル（1단계） ─── */}
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
            <p style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 900, color: "#111" }}>申し込みを確定しますか？</p>
            <div style={{
              background: BG, border: `1px solid ${BORDER}`,
              borderRadius: 12, padding: "12px 16px", margin: "16px 0", textAlign: "left",
            }}>
              <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 800, color: "#111", lineHeight: 1.4,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {confirmingApply.questions}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: TEXT_TER }}>
                {confirmingApply.date} · {confirmingApply.location} 専用会場
              </p>
            </div>
            <p style={{ margin: "0 0 20px", fontSize: 12, color: TEXT_TER, lineHeight: 1.7 }}>
              最終メンバー確定後、メールにてご連絡いたします。
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => {
                Analytics.applyConfirmCancel(confirmingApply.topic);
                setConfirmingApply(null);
              }} style={{
                flex: 1, padding: "13px 0", border: `1.5px solid ${BORDER}`, borderRadius: 12,
                background: "#fff", color: TEXT_SEC, fontSize: 14, fontWeight: 700, cursor: "pointer",
              }}>キャンセル</button>
              <button onClick={() => {
                Analytics.applyConfirmProceed(confirmingApply.topic);
                Analytics.applyReceiptView(confirmingApply.topic);
                setApplyingTo(confirmingApply);
                setConfirmingApply(null);
              }} style={{
                flex: 2, padding: "13px 0", border: "none", borderRadius: 12,
                background: "#111", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer",
              }}>申し込む</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 申込受付モーダル（2단계 완료） ─── */}
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
              申し込みを受け付けました
            </p>
            <p style={{ margin: "0 0 20px", fontSize: 12, color: TEXT_TER }}>
              担当者が参加者構成を確認後<br />24時間以内にメールでご連絡します。
            </p>
            <div style={{
              background: BG, border: `1px solid ${BORDER}`,
              borderRadius: 12, padding: "12px 16px", marginBottom: 20, textAlign: "left",
            }}>
              <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 800, color: "#111", lineHeight: 1.4 }}>
                {applyingTo.questions}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: TEXT_TER }}>
                {applyingTo.date} · {applyingTo.location} 専用会場
              </p>
            </div>
            <button onClick={() => {
              Analytics.applyReceiptClose(applyingTo.topic);
              setApplyingTo(null);
            }} style={{
              width: "100%", padding: "14px", border: "none", borderRadius: 12,
              background: "#111", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer",
            }}>確認</button>
          </div>
        </div>
      )}

      {/* ─── 회원가입/로그인 모달 ─── */}
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
                  {tab === "signup" ? "新規登録" : "ログイン"}
                </button>
              ))}
            </div>

            {modalTab === "signup" ? (
              <>
                <p style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 900, letterSpacing: "-0.02em" }}>CCCメンバー登録</p>
                <p style={{ margin: "0 0 18px", fontSize: 13, color: TEXT_TER }}>登録無料 · カード登録不要</p>
                <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "14px 16px", marginBottom: 18, textAlign: "left" }}>
                  <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 800, color: TEXT_SEC }}>登録後にできること</p>
                  {["セッションをブックマーク（後で申込可）", "新着セッションの優先通知", "参加後のコミュニティアクセス"].map((t) => (
                    <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ color: ACCENT, fontWeight: 800, fontSize: 13, lineHeight: "1.5", flexShrink: 0 }}>✓</span>
                      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: "#333", whiteSpace: "nowrap" }}>{t}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/signup/jp"
                  onClick={() => Analytics.signupModalCtaClick()}
                  style={{ display: "block", padding: "15px", background: "#111", color: "#fff", borderRadius: 12, fontSize: 14, fontWeight: 800, marginBottom: 10 }}
                >
                  無料で始める
                </Link>
                <button onClick={() => closeModal("later_btn")} style={{ display: "block", width: "100%", padding: "10px", background: "none", border: "none", fontSize: 13, color: "#aaa", fontWeight: 700, cursor: "pointer" }}>
                  また今度
                </button>
              </>
            ) : (
              <>
                <p style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 900, color: "#111", letterSpacing: "-0.02em" }}>メンバーログイン</p>
                <p style={{ margin: "0 0 20px", fontSize: 12, color: TEXT_TER, whiteSpace: "nowrap" }}>登録時のメールアドレスでログインできます</p>
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
                    setLoginErr("登録済みのアカウントが見つかりません。まずご登録ください。");
                    return;
                  }
                  const u = JSON.parse(stored);
                  if (u.email.trim().toLowerCase() !== loginEmail.trim().toLowerCase()) {
                    Analytics.loginFail("email_mismatch");
                    setLoginErr("メールアドレスが一致しません。");
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
                }}>ログイン</button>
                <button onClick={() => closeModal("close_btn")} style={{ display: "block", width: "100%", padding: "8px", background: "none", border: "none", fontSize: 13, color: "#aaa", fontWeight: 700, cursor: "pointer" }}>
                  閉じる
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
