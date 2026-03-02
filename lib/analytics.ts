/* ─────────────────────────────────────────────
   CCC Analytics — GA4 Custom Event Logger
   페이지: /jp (일본어 랜딩) + /signup/jp
   목적: CTR↑ 전환율↓ 문제 진단용 이벤트 로깅
───────────────────────────────────────────── */

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: (...args: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any[];
  }
}

/** GA4에 커스텀 이벤트 전송 + 콘솔 실시간 출력 */
export function logEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined") return;

  const payload = { page_lang: "jp", ...params };

  // 개발/검증용 콘솔 로그
  console.log(
    `%c[CCC Event] %c${eventName}`,
    "color:#b8920e;font-weight:900;",
    "color:#333;font-weight:700;",
    payload
  );

  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, payload);
}

// ─── 1. 페이지 뷰 ──────────────────────────────
export const Analytics = {
  /** 랜딩 페이지 최초 진입 */
  pageView: () =>
    logEvent("lp_page_view", { page: "/jp" }),

  // ─── 2. 스크롤 깊이 ───────────────────────────
  /** 스크롤 도달 구간 (섹션명 기반) */
  scrollReach: (section: "stats" | "sessions" | "why_ccc" | "reviews" | "faq" | "footer") =>
    logEvent("lp_scroll_reach", { section }),

  // ─── 3. 체류 시간 ─────────────────────────────
  /** 페이지 체류 시간 마일스톤 */
  timeOnPage: (seconds: 15 | 30 | 60 | 120) =>
    logEvent("lp_time_on_page", { seconds }),

  // ─── 4. 탭 필터 ───────────────────────────────
  /** 카테고리 탭 클릭 */
  tabClick: (tab: string) =>
    logEvent("lp_tab_click", { tab }),

  // ─── 5. 세션 카드 ─────────────────────────────
  /** 세션 카드 클릭 (본문 영역) */
  sessionCardClick: (topic: string, date: string) =>
    logEvent("lp_session_card_click", { topic, date }),

  /** 気になる (찜) 버튼 클릭 */
  wishlistClick: (topic: string, added: boolean) =>
    logEvent("lp_wishlist_click", { topic, action: added ? "add" : "remove" }),

  /** 申し込む / キャンセル待ち 버튼 클릭 */
  applyBtnClick: (topic: string, is_closed: boolean) =>
    logEvent("lp_apply_btn_click", { topic, session_status: is_closed ? "closed" : "open" }),

  // ─── 6. 더보기 ────────────────────────────────
  /** セッションをもっと見る 버튼 클릭 */
  showMoreClick: (visible_count: number) =>
    logEvent("lp_show_more_click", { visible_count }),

  /** 세션 끝 알림 카드 클릭 */
  notifyCardClick: () =>
    logEvent("lp_notify_card_click"),

  // ─── 7. 申込確認 모달 (1단계) ────────────────
  /** 신청 확인 모달 열림 */
  applyConfirmOpen: (topic: string) =>
    logEvent("modal_apply_confirm_open", { topic }),

  /** 확인 모달에서 '신청' 진행 */
  applyConfirmProceed: (topic: string) =>
    logEvent("modal_apply_confirm_proceed", { topic }),

  /** 확인 모달에서 '취소' */
  applyConfirmCancel: (topic: string) =>
    logEvent("modal_apply_confirm_cancel", { topic }),

  // ─── 8. 申込受付 모달 (2단계 완료) ──────────
  /** 신청 수락 완료 모달 노출 */
  applyReceiptView: (topic: string) =>
    logEvent("modal_apply_receipt_view", { topic }),

  /** 신청 완료 모달 닫기 */
  applyReceiptClose: (topic: string) =>
    logEvent("modal_apply_receipt_close", { topic }),

  // ─── 9. 회원가입/로그인 모달 ─────────────────
  /** 모달 오픈 (트리거 위치) */
  signupModalOpen: (trigger: "card_click" | "apply_btn" | "wishlist_btn" | "mypage_btn" | "notify_card") =>
    logEvent("modal_signup_open", { trigger }),

  /** 모달 내 탭 전환 */
  signupModalTabSwitch: (to: "signup" | "login") =>
    logEvent("modal_signup_tab_switch", { to }),

  /** 모달에서 '無料で始める' 클릭 → signup 페이지로 이동 */
  signupModalCtaClick: () =>
    logEvent("modal_signup_cta_click"),

  /** 모달에서 로그인 시도 */
  loginAttempt: () =>
    logEvent("modal_login_attempt"),

  /** 로그인 성공 */
  loginSuccess: () =>
    logEvent("modal_login_success"),

  /** 로그인 실패 (이메일 불일치 등) */
  loginFail: (reason: "no_account" | "email_mismatch") =>
    logEvent("modal_login_fail", { reason }),

  /** 모달 '또 다음에' / 닫기 */
  signupModalDismiss: (action: "later_btn" | "backdrop" | "close_btn") =>
    logEvent("modal_signup_dismiss", { action }),

  // ─── 10. 네비게이션 ───────────────────────────
  /** 언어 전환 (한국어로) */
  langSwitch: () =>
    logEvent("lp_lang_switch", { to: "kr" }),

  /** 마이페이지 탭 클릭 */
  mypageNavClick: () =>
    logEvent("lp_mypage_nav_click"),

  // ─── 11. 회원가입 페이지 ─────────────────────
  /** /signup/jp 페이지 진입 */
  signupPageView: () =>
    logEvent("signup_page_view", { page: "/signup/jp" }),

  /** 국적 선택 */
  signupNationSelect: (nation: string) =>
    logEvent("signup_nation_select", { nation }),

  /** 폼 유효성 오류 */
  signupValidationError: (fields: string) =>
    logEvent("signup_validation_error", { fields }),

  /** 기존 유저 감지 (이메일 중복) */
  signupExistingUser: () =>
    logEvent("signup_existing_user_detected"),

  /** 제출 버튼 클릭 */
  signupSubmitAttempt: () =>
    logEvent("signup_submit_attempt"),

  /** 회원가입 완료 (Formspree 응답 ok) */
  signupComplete: (nation: string, gender: string, age_group: string) =>
    logEvent("signup_complete", { nation, gender, age_group }),

  /** 회원가입 오류 */
  signupError: (type: "server" | "network") =>
    logEvent("signup_error", { type }),

  /** 완료 후 '세션 보기' 클릭 */
  signupDoneCtaClick: () =>
    logEvent("signup_done_cta_click"),
};
