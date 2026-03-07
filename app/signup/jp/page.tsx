"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const BG = "#f4f1ec";
const BORDER = "#e8e3da";
const ACCENT = "#b8920e";
const ACCENT_SUB = "rgba(184,146,14,0.10)";
const TEXT_SEC = "#6b5f54";
const TEXT_TER = "#7a6e64";
const ERROR = "#e54d4d";

const INTERESTS = ["仕事・キャリア", "社会・価値観", "恋愛・関係", "お金・暮らし"];
const FORMSPREE = "https://formspree.io/f/maqdzjby";

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export default function SignupJpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nation, setNation] = useState("");
  const [gender, setGender] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [existingUser, setExistingUser] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nameErr, setNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [nationErr, setNationErr] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const nationRef = useRef<HTMLDivElement>(null);

  const toggleInterest = (t: string) =>
    setInterests((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  const validate = () => {
    let ok = true;
    const errorFields: string[] = [];
    if (!name.trim()) { setNameErr("お名前を入力してください。"); ok = false; errorFields.push("name"); } else setNameErr("");
    if (!email.trim()) { setEmailErr("メールアドレスを入力してください。"); ok = false; errorFields.push("email"); }
    else if (!isValidEmail(email)) { setEmailErr("正しいメール形式で入力してください。"); ok = false; errorFields.push("email_format"); }
    else setEmailErr("");
    if (!nation) { setNationErr("国籍を選択してください。"); ok = false; errorFields.push("nation"); } else setNationErr("");
    return ok;
  };

  const handleSubmit = async () => {
    const ok = validate();
    if (!ok) {
      if (!name.trim() && nameRef.current) {
        nameRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        nameRef.current.focus();
      } else if ((!email.trim() || !isValidEmail(email)) && emailRef.current) {
        emailRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        emailRef.current.focus();
      } else if (!nation && nationRef.current) {
        nationRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(FORMSPREE, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ 名前: name, メール: email, 国籍: nation, 性別: gender || "未入力", 年代: ageGroup || "未入力", 興味テーマ: interests.join(", ") || "未入力", _lang: "jp" }),
      });
      if (res.ok) {
        localStorage.setItem("ccc_user", JSON.stringify({ name, email, nation, gender, ageGroup, interests }));
        setDone(true);
      } else {
        setEmailErr("送信中にエラーが発生しました。もう一度お試しください。");
      }
    } catch {
      setEmailErr("ネットワークエラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: BG, display: "flex", flexDirection: "column" }}>
        <header style={{ padding: "14px 20px 12px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: "#111" }}>CCC</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: TEXT_SEC, letterSpacing: "0.12em" }}>CROSS CULTURAL CLUB</span>
        </header>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", textAlign: "center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: ACCENT_SUB, border: `2px solid ${ACCENT}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, color: ACCENT, fontWeight: 900, marginBottom: 24,
          }}>✓</div>
          <h1 style={{ margin: "0 0 10px", fontSize: 24, fontWeight: 900, color: "#111", letterSpacing: "-0.02em" }}>登録完了！</h1>
          <p style={{ margin: "0 0 32px", fontSize: 14, color: TEXT_TER, lineHeight: 1.75 }}>
            好きなセッションにいつでも申し込めます。<br />
            新着セッションの通知もメールでお届けします。
          </p>
          <Link href="/jp" style={{
            display: "block", width: "100%", maxWidth: 320,
            padding: "16px", background: "#111", color: "#fff",
            borderRadius: 12, fontSize: 15, fontWeight: 800, textAlign: "center",
          }}>セッションを見る →</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: BG, display: "flex", flexDirection: "column" }}>
      <header style={{
        padding: "14px 20px 12px", borderBottom: `1px solid ${BORDER}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: "#111" }}>CCC</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: TEXT_SEC, letterSpacing: "0.12em" }}>CROSS CULTURAL CLUB</span>
        </div>
        <Link href="/jp" style={{ fontSize: 12, color: TEXT_SEC }}>← 戻る</Link>
      </header>

      <main style={{ flex: 1, padding: "32px 20px 48px" }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: TEXT_SEC, letterSpacing: "0.08em" }}>JOIN CCC</p>
          <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 900, color: "#111", letterSpacing: "-0.02em", lineHeight: 1.2 }}>メンバー登録</h1>
          <p style={{ margin: 0, fontSize: 13, color: TEXT_TER }}>登録無料 · カード不要 · 好きなセッションにいつでも参加</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* 이름 */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: TEXT_SEC, marginBottom: 6 }}>
              お名前 <span style={{ color: ERROR }}>*</span>
            </label>
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => { setName(e.target.value); if (nameErr) setNameErr(""); }}
              placeholder="山田 花子"
              style={{
                width: "100%", padding: "13px 14px", boxSizing: "border-box",
                border: `1.5px solid ${nameErr ? ERROR : BORDER}`, borderRadius: 10,
                background: "#fff", fontSize: 14, color: "#111", outline: "none",
              }}
            />
            {nameErr && <p style={{ margin: "5px 0 0", fontSize: 11, color: ERROR }}>{nameErr}</p>}
          </div>

          {/* 이메일 */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: TEXT_SEC, marginBottom: 6 }}>
              メールアドレス <span style={{ color: ERROR }}>*</span>
            </label>
            <input
              ref={emailRef}
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (emailErr) setEmailErr(""); setExistingUser(false); }}
              onBlur={(e) => {
                const stored = localStorage.getItem("ccc_user");
                if (stored && isValidEmail(e.target.value)) {
                  const u = JSON.parse(stored);
                  if (u.email.trim().toLowerCase() === e.target.value.trim().toLowerCase()) {
                    setExistingUser(true);
                  }
                }
              }}
              placeholder="hello@example.com"
              type="email"
              style={{
                width: "100%", padding: "13px 14px", boxSizing: "border-box",
                border: `1.5px solid ${emailErr ? ERROR : existingUser ? ACCENT : BORDER}`, borderRadius: 10,
                background: "#fff", fontSize: 14, color: "#111", outline: "none",
              }}
            />
            {existingUser && (
              <div style={{ marginTop: 8, padding: "10px 14px", background: ACCENT_SUB, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <p style={{ margin: 0, fontSize: 12, color: ACCENT, fontWeight: 600 }}>登録済みのメールアドレスです。</p>
                <button onClick={() => { window.location.href = "/jp"; }} style={{ padding: "5px 12px", background: ACCENT, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                  はじめる →
                </button>
              </div>
            )}
            {emailErr && <p style={{ margin: "5px 0 0", fontSize: 11, color: ERROR }}>{emailErr}</p>}
          </div>

          {/* 국적 */}
          <div ref={nationRef}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: TEXT_SEC, marginBottom: 6 }}>
              国籍 <span style={{ color: ERROR }}>*</span>
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {["日本", "韓国", "その他"].map((n) => (
                <button key={n} onClick={() => { setNation(n); if (nationErr) setNationErr(""); }} style={{
                  flex: 1, padding: "12px 0",
                  border: `1.5px solid ${nationErr && !nation ? ERROR : nation === n ? ACCENT : BORDER}`,
                  borderRadius: 10,
                  background: nation === n ? ACCENT_SUB : "#fff",
                  color: nation === n ? ACCENT : TEXT_SEC,
                  fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                }}>{n}</button>
              ))}
            </div>
            {nationErr && <p style={{ margin: "5px 0 0", fontSize: 11, color: ERROR }}>{nationErr}</p>}
          </div>

          {/* 구분선 */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0" }}>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: TEXT_TER, whiteSpace: "nowrap" }}>任意入力</span>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
          </div>

          {/* 성별 */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: TEXT_SEC, marginBottom: 6 }}>
              性別 <span style={{ fontWeight: 400, color: TEXT_TER }}>(任意)</span>
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {["男性", "女性", "回答しない"].map((g) => (
                <button key={g} onClick={() => setGender(gender === g ? "" : g)} style={{
                  flex: 1, padding: "11px 0",
                  border: `1.5px solid ${gender === g ? ACCENT : BORDER}`, borderRadius: 10,
                  background: gender === g ? ACCENT_SUB : "#fff",
                  color: gender === g ? ACCENT : TEXT_SEC,
                  fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                }}>{g}</button>
              ))}
            </div>
          </div>

          {/* 연령대 */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: TEXT_SEC, marginBottom: 6 }}>
              年代 <span style={{ fontWeight: 400, color: TEXT_TER }}>(任意)</span>
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {["20代", "30代", "40代+"].map((a) => (
                <button key={a} onClick={() => setAgeGroup(ageGroup === a ? "" : a)} style={{
                  flex: 1, padding: "11px 0",
                  border: `1.5px solid ${ageGroup === a ? ACCENT : BORDER}`, borderRadius: 10,
                  background: ageGroup === a ? ACCENT_SUB : "#fff",
                  color: ageGroup === a ? ACCENT : TEXT_SEC,
                  fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                }}>{a}</button>
              ))}
            </div>
          </div>

          {/* 관심사 */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: TEXT_SEC, marginBottom: 6 }}>
              興味テーマ <span style={{ fontWeight: 400, color: TEXT_TER }}>(任意・複数選択可)</span>
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {INTERESTS.map((t) => (
                <button key={t} onClick={() => toggleInterest(t)} style={{
                  padding: "8px 14px",
                  border: `1.5px solid ${interests.includes(t) ? ACCENT : BORDER}`, borderRadius: 20,
                  background: interests.includes(t) ? ACCENT_SUB : "#fff",
                  color: interests.includes(t) ? ACCENT : TEXT_SEC,
                  fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                }}>{t}</button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleSubmit}
            disabled={loading || !name.trim() || !email.trim() || !nation}
            style={{
              marginTop: 8, padding: "16px", border: "none", borderRadius: 12,
              background: (loading || !name.trim() || !email.trim() || !nation) ? "#c8c0b4" : "#111",
              color: "#fff", fontSize: 15, fontWeight: 800,
              cursor: (loading || !name.trim() || !email.trim() || !nation) ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >{loading ? "送信中..." : "無料で始める"}</button>

          <p style={{ margin: "4px 0 0", fontSize: 11, color: TEXT_TER, textAlign: "center", lineHeight: 1.7 }}>
            登録後、好きなセッションにいつでも申し込めます。
          </p>
        </div>

        {/* 혜택 */}
        <div style={{ marginTop: 32, padding: "14px 16px", border: `1px solid ${BORDER}`, borderRadius: 12, background: "#fff" }}>
          <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: TEXT_SEC }}>登録後にできること</p>
          {["気になるセッションを保存（あとで申し込み可）", "新着セッションの優先通知", "参加後のコミュニティアクセス"].map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
              <span style={{ color: ACCENT, fontWeight: 900, fontSize: 12, flexShrink: 0, lineHeight: "1.5" }}>✓</span>
              <p style={{ margin: 0, fontSize: 12, color: "#444", lineHeight: 1.5 }}>{t}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
