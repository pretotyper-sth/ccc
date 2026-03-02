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

const INTERESTS = ["일·커리어", "사회·가치관", "연애·관계", "돈·라이프"];
const FORMSPREE = "https://formspree.io/f/maqdzjby";

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nation, setNation] = useState("");
  const [gender, setGender] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingUser, setExistingUser] = useState(false);

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
    if (!name.trim()) { setNameErr("이름을 입력해주세요."); ok = false; } else setNameErr("");
    if (!email.trim()) { setEmailErr("이메일을 입력해주세요."); ok = false; }
    else if (!isValidEmail(email)) { setEmailErr("올바른 이메일 형식이 아니에요."); ok = false; }
    else setEmailErr("");
    if (!nation) { setNationErr("국적을 선택해주세요."); ok = false; } else setNationErr("");
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
        body: JSON.stringify({ 이름: name, 이메일: email, 국적: nation, 성별: gender || "미입력", 연령대: ageGroup || "미입력", 관심사: interests.join(", ") || "미입력" }),
      });
      if (res.ok) {
        localStorage.setItem("ccc_user", JSON.stringify({ name, email, nation, gender, ageGroup, interests }));
        setDone(true);
      } else {
        setEmailErr("제출 중 오류가 발생했어요. 다시 시도해주세요.");
      }
    } catch {
      setEmailErr("네트워크 오류가 발생했어요. 다시 시도해주세요.");
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
          <h1 style={{ margin: "0 0 10px", fontSize: 24, fontWeight: 900, color: "#111", letterSpacing: "-0.02em" }}>가입 완료!</h1>
          <p style={{ margin: "0 0 32px", fontSize: 14, color: TEXT_TER, lineHeight: 1.75 }}>
            이제 원하는 세션에 언제든 신청할 수 있어요.<br />
            새 세션 오픈 소식도 메일로 먼저 알려드릴게요.
          </p>
          <Link href="/" style={{
            display: "block", width: "100%", maxWidth: 320,
            padding: "16px", background: "#111", color: "#fff",
            borderRadius: 12, fontSize: 15, fontWeight: 800, textAlign: "center",
          }}>세션 보러 가기 →</Link>
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
        <Link href="/" style={{ fontSize: 12, color: TEXT_SEC }}>← 돌아가기</Link>
      </header>

      <main style={{ flex: 1, padding: "32px 20px 48px" }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: TEXT_SEC, letterSpacing: "0.08em" }}>JOIN CCC</p>
          <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 900, color: "#111", letterSpacing: "-0.02em", lineHeight: 1.2 }}>멤버 가입</h1>
          <p style={{ margin: 0, fontSize: 13, color: TEXT_TER }}>가입 무료 · 카드 등록 불필요 · 언제든 원하는 세션에 참여</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* 이름 */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: TEXT_SEC, marginBottom: 6 }}>
              이름 <span style={{ color: ERROR }}>*</span>
            </label>
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => { setName(e.target.value); if (nameErr) setNameErr(""); }}
              placeholder="홍길동"
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
              이메일 <span style={{ color: ERROR }}>*</span>
            </label>
            <input
              ref={emailRef}
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (emailErr) setEmailErr(""); setExistingUser(false); }}
              onBlur={(e) => {
                const stored = localStorage.getItem("ccc_user");
                if (stored && isValidEmail(e.target.value)) {
                  const u = JSON.parse(stored);
                  if (u.email.trim().toLowerCase() === e.target.value.trim().toLowerCase()) setExistingUser(true);
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
                <p style={{ margin: 0, fontSize: 12, color: ACCENT, fontWeight: 600 }}>이미 가입된 이메일이에요.</p>
                <button onClick={() => { window.location.href = "/"; }} style={{ padding: "5px 12px", background: ACCENT, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                  바로 시작하기 →
                </button>
              </div>
            )}
            {emailErr && <p style={{ margin: "5px 0 0", fontSize: 11, color: ERROR }}>{emailErr}</p>}
          </div>

          {/* 국적 */}
          <div ref={nationRef}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: TEXT_SEC, marginBottom: 6 }}>
              국적 <span style={{ color: ERROR }}>*</span>
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {["한국", "일본", "기타"].map((n) => (
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
            <span style={{ fontSize: 11, fontWeight: 700, color: TEXT_TER, whiteSpace: "nowrap" }}>선택 입력</span>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
          </div>

          {/* 성별 */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: TEXT_SEC, marginBottom: 6 }}>
              성별 <span style={{ fontWeight: 400, color: TEXT_TER }}>(선택)</span>
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {["남성", "여성", "선택 안함"].map((g) => (
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
              연령대 <span style={{ fontWeight: 400, color: TEXT_TER }}>(선택)</span>
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {["20대", "30대", "40대+"].map((a) => (
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
              주요 관심사 <span style={{ fontWeight: 400, color: TEXT_TER }}>(선택 · 복수 가능)</span>
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
          >{loading ? "처리 중..." : "무료로 시작하기"}</button>

          <p style={{ margin: "4px 0 0", fontSize: 11, color: TEXT_TER, textAlign: "center", lineHeight: 1.7 }}>
            가입 후 원하는 세션에 자유롭게 신청할 수 있어요.
          </p>
        </div>

        {/* 가입 혜택 */}
        <div style={{ marginTop: 32, padding: "14px 16px", border: `1px solid ${BORDER}`, borderRadius: 12, background: "#fff" }}>
          <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: TEXT_SEC }}>가입하면 할 수 있어요</p>
          {["찜한 세션, 나중에 신청 가능", "새 세션 오픈 알림 먼저 받기", "참여 후 커뮤니티 접근"].map((t) => (
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
