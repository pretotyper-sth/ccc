/* ─────────────────────────────────────────────
   CCC Analytics — GA4 커스텀 이벤트 (챗 퍼널 전용)
   목적: 이탈 구간·최종 전환율 분석
───────────────────────────────────────────── */

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: (...args: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any[];
  }
}

export type ChatStepId =
  | "welcome"
  | "purpose"
  | "topic"
  | "gender"
  | "age"
  | "job"
  | "interpreter"
  | "location"
  | "time"
  | "when_join"
  | "email";

function logEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined") return;

  const path = window.location.pathname;
  const lang = path.startsWith("/jp") ? "jp" : "kr";
  const payload = { page_lang: lang, page_path: path, ...params };

  console.log(
    `%c[CCC Event] %c${eventName}`,
    "color:#b8920e;font-weight:900;",
    "color:#333;font-weight:700;",
    payload
  );

  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, payload);
}

export const Analytics = {
  /** 챗 퍼널 진입 (환영 단계 노출 시 1회) */
  chatFunnelStart: () =>
    logEvent("chat_funnel_start"),

  /** 단계 노출 (해당 단계 봇 메시지가 보일 때) — 이탈 구간 분석용 */
  chatStepView: (step: ChatStepId, step_index: number) =>
    logEvent("chat_step_view", { step, step_index }),

  /** 선택지 선택 (단계 + 선택값) */
  chatStepChoice: (step: ChatStepId, value: string) =>
    logEvent("chat_step_choice", { step, value }),

  /** ‘기타’ 직접 입력 후 다음 클릭 */
  chatStepOtherConfirm: (step: ChatStepId) =>
    logEvent("chat_step_other_confirm", { step }),

  /** ‘기타’ 입력 화면에서 취소 클릭 */
  chatStepOtherCancel: (step: ChatStepId) =>
    logEvent("chat_step_other_cancel", { step }),

  /** 이전 답변 수정 클릭 */
  chatStepEdit: (step: ChatStepId) =>
    logEvent("chat_step_edit", { step }),

  /** 참여 신청 버튼 클릭 */
  chatSubmitClick: () =>
    logEvent("chat_submit_click"),

  /** 참여 신청 성공 (Formspree 200) — 최종 전환 */
  chatSubmitSuccess: () =>
    logEvent("chat_submit_success"),

  /** 참여 신청 실패 */
  chatSubmitError: (type: "email_required" | "email_invalid" | "server" | "network") =>
    logEvent("chat_submit_error", { type }),

  /** 완료 화면 노출 */
  chatDoneView: () =>
    logEvent("chat_done_view"),

  /** 완료 화면에서 ‘처음으로’ / ‘最初に戻る’ 클릭 */
  chatDoneCtaClick: () =>
    logEvent("chat_done_cta_click"),

  /** GNB 언어 전환 링크 클릭 */
  chatLangSwitch: (from: "kr" | "jp", to: "kr" | "jp") =>
    logEvent("chat_lang_switch", { from, to }),
};
