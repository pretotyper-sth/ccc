"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BG = "#f4f1ec";
const BORDER = "#e8e3da";
const ACCENT = "#b8920e";
const ACCENT_SUB = "rgba(184,146,14,0.10)";
const TEXT_SEC = "#6b5f54";
const TEXT_TER = "#9e9189";

type User = { name: string; email: string; nation: string; gender?: string; ageGroup?: string };

export default function JpMyPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("ccc_user");
    if (saved) setUser(JSON.parse(saved));
    const wl = localStorage.getItem("ccc_wishlist");
    if (wl) setWishlist(JSON.parse(wl));
  }, []);

  const logout = () => {
    localStorage.removeItem("ccc_user");
    localStorage.removeItem("ccc_wishlist");
    localStorage.removeItem("ccc_applied");
    router.push("/jp");
  };

  if (!mounted) return null;

  if (!user) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: BG, display: "flex", flexDirection: "column" }}>
        <header style={{ padding: "14px 20px 12px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: "#111" }}>CCC</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: TEXT_SEC, letterSpacing: "0.12em" }}>CROSS CULTURAL CLUB</span>
          </div>
          <Link href="/jp" style={{ fontSize: 12, color: TEXT_SEC }}>← ホーム</Link>
        </header>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", textAlign: "center" }}>
          <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: "#111" }}>ログインが必要です</p>
          <p style={{ margin: "0 0 28px", fontSize: 13, color: TEXT_TER, lineHeight: 1.7 }}>CCCメンバー専用のページです。</p>
          <Link href="/signup/jp" style={{
            display: "block", padding: "14px 32px", background: "#111", color: "#fff",
            borderRadius: 12, fontSize: 14, fontWeight: 800, letterSpacing: "-0.01em",
          }}>無料でメンバー登録する</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: BG, display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "14px 20px 12px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: "#111" }}>CCC</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: TEXT_SEC, letterSpacing: "0.12em" }}>CROSS CULTURAL CLUB</span>
        </div>
        <Link href="/jp" style={{ fontSize: 12, color: TEXT_SEC }}>← ホーム</Link>
      </header>

      <main style={{ flex: 1, padding: "24px 16px 120px" }}>

        {/* 멤버십 카드 */}
        <div style={{
          background: "#1c1814",
          borderRadius: 20, padding: "24px 22px 22px",
          marginBottom: 20, position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, ${ACCENT} 0%, #f2d57b 50%, ${ACCENT} 100%)`,
          }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.18em" }}>CROSS CULTURAL CLUB</p>
              <p style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>{user.name}</p>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{user.email}</p>
            </div>
            <span style={{
              fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
              color: ACCENT, background: "rgba(184,146,14,0.15)",
              border: `1px solid rgba(184,146,14,0.3)`,
              padding: "5px 12px", borderRadius: 20, whiteSpace: "nowrap",
            }}>MEMBER</span>
          </div>
          <div style={{ display: "flex", gap: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {[
              { label: "国籍", value: user.nation },
              ...(user.ageGroup ? [{ label: "年代", value: user.ageGroup }] : []),
              ...(user.gender ? [{ label: "性別", value: user.gender }] : []),
            ].map((r) => (
              <div key={r.label}>
                <p style={{ margin: "0 0 3px", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>{r.label}</p>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.75)" }}>{r.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 관심 세션 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: "#111", letterSpacing: "-0.01em" }}>気になるセッション</p>
            {wishlist.length > 0 && (
              <span style={{ fontSize: 12, color: TEXT_TER }}>{wishlist.length}件</span>
            )}
          </div>

          {wishlist.length === 0 ? (
            <div style={{
              background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 16,
              padding: "32px 20px", textAlign: "center",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: ACCENT_SUB, margin: "0 auto 14px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, color: ACCENT,
              }}>♡</div>
              <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 800, color: "#111" }}>気になるセッションをお気に入りに</p>
              <p style={{ margin: "0 0 20px", fontSize: 13, color: TEXT_TER, lineHeight: 1.65 }}>
                セッションのハートを押すと<br />こちらで確認できます
              </p>
              <Link href="/jp" style={{
                display: "inline-block", padding: "12px 24px",
                background: "#111", color: "#fff", borderRadius: 12,
                fontSize: 13, fontWeight: 800,
              }}>セッションを見る</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {wishlist.map((q, i) => (
                <div key={i} style={{
                  background: "#fff", borderRadius: 14,
                  border: `1px solid ${BORDER}`,
                  borderLeft: `3px solid ${ACCENT}`,
                  padding: "14px 16px",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <span style={{ fontSize: 14, color: ACCENT, flexShrink: 0 }}>♥</span>
                  <p style={{
                    margin: 0, fontSize: 13, fontWeight: 600, color: "#222", lineHeight: 1.5,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>{q}</p>
                </div>
              ))}
              <Link href="/jp" style={{
                display: "block", textAlign: "center",
                padding: "13px", marginTop: 4,
                border: `1.5px solid ${BORDER}`, borderRadius: 12,
                fontSize: 13, fontWeight: 700, color: TEXT_SEC, background: "#fff",
              }}>セッションをもっと見る</Link>
            </div>
          )}
        </div>

        {/* 구분 */}
        <div style={{ height: 1, background: BORDER, margin: "4px 0 20px" }} />

        {/* 로그아웃 */}
        <button onClick={logout} style={{
          width: "100%", padding: 0, border: "none", background: "transparent",
          color: TEXT_TER, fontSize: 12, cursor: "pointer", textAlign: "center",
          textDecoration: "underline", textDecorationColor: BORDER,
        }}>ログアウト</button>
      </main>

      {/* 바텀 네비 */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto",
        background: "#fff", boxShadow: "0 -2px 20px rgba(100,80,60,0.10)",
        display: "flex", zIndex: 100,
      }}>
        {[
          { label: "ホーム", href: "/jp" },
          { label: "マイページ", href: "/jp/mypage", active: true },
        ].map((item) => (
          <Link key={item.label} href={item.href} style={{
            flex: 1, position: "relative", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: `12px 0 calc(12px + env(safe-area-inset-bottom, 0px))`,
            textDecoration: "none",
          }}>
            {"active" in item && item.active && (
              <span style={{ position: "absolute", top: 0, left: "35%", right: "35%", height: 2.5, borderRadius: 2, background: ACCENT }} />
            )}
            <span style={{ fontSize: 13, fontWeight: "active" in item && item.active ? 800 : 600, color: "active" in item && item.active ? ACCENT : TEXT_SEC }}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
