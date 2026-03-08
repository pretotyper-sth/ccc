/* ─────────────────────────────────────────────
   CCC Analytics — GA4 커스텀 이벤트 (챗 퍼널 전용)
   목적: 단계·선택지별 이탈 구간·전환율 분석
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
  | "visitor_type"
  | "travel_period"
  | "purpose"
  | "topic"
  | "gender"
  | "age"
  | "job"
  | "job_preference"
  | "interpreter"
  | "location"
  | "time"
  | "when_join"
  | "email";

/** 단계 이벤트 공통 컨텍스트 (이탈·선택지별 집계용) */
export type StepEventContext = {
  form_source?: string;
  steps_total?: number;
  visitor_type?: "resident" | "traveler";
};

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

function withContext(
  base: Record<string, string | number | boolean>,
  ctx?: StepEventContext | null
): Record<string, string | number | boolean> {
  if (!ctx) return base;
  const out = { ...base };
  if (ctx.form_source) out.form_source = ctx.form_source;
  if (ctx.steps_total !== undefined) out.steps_total = ctx.steps_total;
  if (ctx.visitor_type) out.visitor_type = ctx.visitor_type;
  return out;
}

/** Looker Studio 등에서 파라미터 없이 '이벤트 이름'만으로 단계·선택 구분 가능하도록 이벤트명에 step/type 포함 */
export const Analytics = {
  /** 챗 퍼널 진입 (환영 단계 노출 시 1회) */
  chatFunnelStart: (ctx?: StepEventContext | null) =>
    logEvent("chat_funnel_start", withContext({}, ctx)),

  /** 단계 노출 — 이벤트명: chat_step_view_welcome, chat_step_view_purpose, ... (이탈 구간별 카운트) */
  chatStepView: (
    step: ChatStepId,
    step_index: number,
    ctx?: StepEventContext | null
  ) =>
    logEvent(
      `chat_step_view_${step}`,
      withContext({ step_index }, ctx)
    ),

  /** 선택지 선택 — 이벤트명: chat_step_choice_purpose, chat_step_choice_topic, ... (선택지별 카운트) */
  chatStepChoice: (
    step: ChatStepId,
    value: string,
    step_index: number,
    ctx?: StepEventContext | null
  ) =>
    logEvent(
      `chat_step_choice_${step}`,
      withContext({ step_index, choice_value: value }, ctx)
    ),

  /** ‘기타’ 직접 입력 후 다음 — 이벤트명: chat_step_other_confirm_topic, _job, _location */
  chatStepOtherConfirm: (
    step: ChatStepId,
    step_index: number,
    ctx?: StepEventContext | null
  ) =>
    logEvent(
      `chat_step_other_confirm_${step}`,
      withContext({ step_index }, ctx)
    ),

  /** ‘기타’ 취소 — 이벤트명: chat_step_other_cancel_topic, _job, _location */
  chatStepOtherCancel: (
    step: ChatStepId,
    step_index: number,
    ctx?: StepEventContext | null
  ) =>
    logEvent(
      `chat_step_other_cancel_${step}`,
      withContext({ step_index }, ctx)
    ),

  /** 수정 클릭 — 이벤트명: chat_step_edit_purpose, chat_step_edit_topic, ... */
  chatStepEdit: (
    step: ChatStepId,
    step_index: number,
    ctx?: StepEventContext | null
  ) =>
    logEvent(`chat_step_edit_${step}`, withContext({ step_index }, ctx)),

  /** 참여 신청 버튼 클릭 */
  chatSubmitClick: (form_source?: string) =>
    logEvent("chat_submit_click", form_source ? { form_source } : undefined),

  /** 참여 신청 성공 */
  chatSubmitSuccess: (form_source?: string) =>
    logEvent("chat_submit_success", form_source ? { form_source } : undefined),

  /** 참여 신청 실패 — 이벤트명: chat_submit_error_email_required, _email_invalid, _server, _network */
  chatSubmitError: (
    type: "email_required" | "email_invalid" | "server" | "network",
    form_source?: string
  ) =>
    logEvent(
      `chat_submit_error_${type}`,
      form_source ? { form_source } : undefined
    ),

  /** 완료 화면 노출 */
  chatDoneView: (ctx?: StepEventContext | null) =>
    logEvent("chat_done_view", withContext({}, ctx)),

  /** 완료 화면에서 처음으로/最初に戻る 클릭 */
  chatDoneCtaClick: () =>
    logEvent("chat_done_cta_click"),

  /** GNB 언어 전환 링크 클릭 */
  chatLangSwitch: (from: "kr" | "jp", to: "kr" | "jp") =>
    logEvent("chat_lang_switch", { from, to }),
};
