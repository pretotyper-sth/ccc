# CCC 랜딩(챗 퍼널) 컨텍스트 — 에이전트 인계용

다른 에이전트가 이어서 작업할 때 참고할 프로젝트·구조·규칙 요약.

---

## 1. 프로젝트 개요

- **경로**: `ccc-landing/` (Next.js 16, React 19)
- **배포**: Vercel. **Git**: `https://github.com/pretotyper-sth/ccc.git` 에 연결돼 있으며, **main 브랜치 push 시 자동 배포**
- **GA4**: `NEXT_PUBLIC_GA_ID` (Vercel env). 챗 퍼널 전용 커스텀 이벤트 사용

---

## 2. 페이지 구조

| 경로 | 설명 |
|------|------|
| `/` | 한국어 챗 퍼널 (메인) |
| `/jp` | 일본어 챗 퍼널 (동일 UI, 문구만 일본어) |
| `/chat` | `/` 로 리다이렉트 |
| `/signup`, `/signup/jp` | 별도 회원가입 폼 (챗과 무관, Analytics 제거됨) |
| `/mypage`, `/jp/mypage` | 마이페이지 |

한/일 챗은 **동일한 컴포넌트** `ChatPage`에 `COPY_KR` / `COPY_JP` 만 넘겨서 사용.

---

## 3. 챗 퍼널 플로우 (12단계)

1. **welcome** — 환영 + 시작 버튼  
2. **purpose** — 참여 계획 / 알아보는 중 / 모르겠음  
3. **topic** — 주제 (일·커리어, 사회·가치관 등 + 기타 직접입력)  
4. **gender** — 남성/여성/비공개  
5. **age** — 20대/30대/40대 이상  
6. **job** — 직업 (회사원, 자영업·창업 등 + 기타/비공개)  
7. **job_preference** — 비슷한 직업군 / 서로 다른 직업군  
8. **interpreter** — 통역 필요 / 한국어·일본어로 진행  
9. **location** — 강남, 성수, 한남, 홍대 + 기타  
10. **time** — 오전/오후/저녁  
11. **when_join** — 참여 시기 (1주일 이내, 1개월, 2~3개월, 미정)  
12. **email** — 이메일 입력 + 후기 3개 + 참여 신청하기

**기타** 선택 시: 입력란 + 다음/취소 버튼. 취소 시 선택지로 복귀.  
각 사용자 말풍선 옆 **수정** 버튼으로 해당 단계부터 다시 진행 가능.

---

## 4. 핵심 파일

| 파일 | 역할 |
|------|------|
| `app/page.tsx` | `<ChatPage copy={COPY_KR} />` |
| `app/jp/page.tsx` | `<ChatPage copy={COPY_JP} />` |
| `app/ChatPage.tsx` | 챗 UI 전부 (메시지, 선택지, 기타 입력, 수정, 제출, 완료 화면, **프로그레스 바 + "2 / 12"** 등) |
| `app/chat-copy.ts` | `StepId`, `STEPS`, `ChatCopy` 타입. **COPY_KR**, **COPY_JP** (봇 문구, 선택지, 버튼, GNB, 완료 문구, 플레이스홀더, 에러 메시지, `jobPreferenceOptions` 등) |
| `lib/analytics.ts` | GA4 `logEvent`, **Analytics** 객체 (chat_funnel_start, chat_step_view, chat_step_choice, chat_step_other_confirm/cancel, chat_step_edit, chat_submit_*, chat_done_*, chat_lang_switch) |
| `app/chat/page.tsx` | `redirect("/")` |

문구/다국어 수정은 **chat-copy.ts** 만 보면 됨.  
UI/플로우 수정은 **ChatPage.tsx** + 필요 시 **chat-copy.ts**.

---

## 5. Formspree 전송 필드

- 이메일, 방문목적, 관심주제, 성별, 연령대, 직업, **직업선호**, 통역필요, 선호장소, 선호시간대, 참여예정시기  
- `_source`: `chat_kr` / `chat_jp`  
- **일본 전용**: 참여 시기에서 "韓国に行く予定が決まったら知らせてほしい" 선택 시 `_remind_when_travel`: `1` 추가 (여행 일정 잡히면 연락용)
- 기타 선택 시: 주제/직업/장소는 직접 입력값으로 전송

---

## 6. 이벤트 로그 (GA4)

- **문서**: `docs/CHAT_ANALYTICS_EVENTS.md`  
- **step**: welcome, purpose, topic, gender, age, job, **job_preference**, interpreter, location, time, when_join, email  
- **step_index**: 0~11  
- 이탈/전환 분석: `chat_step_view` 단계별 도달, `chat_submit_success` 로 전환 수 집계

---

## 7. 문서

- `docs/CHAT_COPY_JA_KO.md` — 일본어 노출 문구와 한국어 번역 테이블  
- `docs/CHAT_ANALYTICS_EVENTS.md` — 챗 퍼널 이벤트 정의 및 지표 계산 예시  
- `docs/JP_CONVERSION_AND_TRACKING.md` — 일본 전환율·트래킹 점검, JP 0건 진단 체크리스트, 여행 시 알림 설계  
- `docs/CONTEXT_HANDOFF.md` — 이 파일 (에이전트 인계용 컨텍스트)

---

## 8. 참고 사항

- **프로그레스**: 헤더 하단에 진행 바 + "현재 / 12" 숫자 표시  
- **완료 문구**: 한/일 모두 한 문장 (예: "세션 매칭 시 이메일로 연락드릴게요." / "セッションのマッチング結果はメールでお知らせします。")  
- **직업 단계**: 1) 직업 선택 → 2) 직업선호(비슷한 직업군 / 서로 다른 직업군) 순서  
- 배포: `ccc-landing` 에서 커밋 후 `git push origin main` 하면 Vercel 자동 배포
