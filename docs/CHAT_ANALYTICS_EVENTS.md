# 챗 퍼널 이벤트 로그 정의

GA4에 전송되는 커스텀 이벤트 목록. **단계·선택지별 이탈**과 **최종 전환율** 분석용.

---

## 공통 파라미터 (모든 이벤트에 자동 포함)

| 파라미터 | 설명 |
|----------|------|
| `page_lang` | `kr` \| `jp` (경로 기준) |
| `page_path` | 현재 경로 (예: `/`, `/jp`) |

---

## 단계 이벤트 공통 컨텍스트 (선택 포함)

다음 파라미터는 단계 관련 이벤트에 포함되어 **이탈·플로우별 집계**를 가능하게 함.

| 파라미터 | 설명 |
|----------|------|
| `form_source` | `chat_kr` \| `chat_jp` — Formspree·언어 구분 |
| `steps_total` | 현재 플로우의 총 단계 수 (2 \| 11 \| 12 등) |
| `visitor_type` | `resident` \| `traveler` — 분기 후에만 포함 |

---

## 이벤트 테이블 (Looker Studio에서 ‘이벤트 이름’만으로 구분)

단계·유형별로 **이벤트 이름이 다르게** 찍혀서, GA4/Looker Studio에서 **파라미터 없이 이벤트 이름으로** 단계별/선택지별 집계 가능.

| 구분 | 이벤트 이름 패턴 | 예시 (이벤트명) |
|------|------------------|------------------|
| 퍼널 진입 | `chat_funnel_start` | 1종 |
| 단계 노출 | `chat_step_view_{step}` | `chat_step_view_welcome`, `chat_step_view_purpose`, `chat_step_view_topic`, `chat_step_view_gender`, `chat_step_view_age`, `chat_step_view_job`, `chat_step_view_job_preference`, `chat_step_view_interpreter`, `chat_step_view_location`, `chat_step_view_time`, `chat_step_view_when_join`, `chat_step_view_email`, `chat_step_view_visitor_type`, `chat_step_view_travel_period` |
| 선택지 선택 | `chat_step_choice_{step}` | `chat_step_choice_welcome`, `chat_step_choice_visitor_type`, `chat_step_choice_purpose`, `chat_step_choice_topic`, … (같은 step 목록). 선택값은 파라미터 `choice_value` |
| 기타 입력 완료 | `chat_step_other_confirm_{step}` | `chat_step_other_confirm_topic`, `_job`, `_location` |
| 기타 취소 | `chat_step_other_cancel_{step}` | `chat_step_other_cancel_topic`, `_job`, `_location` |
| 수정 클릭 | `chat_step_edit_{step}` | `chat_step_edit_purpose`, `chat_step_edit_topic`, … |
| 제출 | `chat_submit_click`, `chat_submit_success` | 각 1종 |
| 제출 실패 | `chat_submit_error_{type}` | `chat_submit_error_email_required`, `chat_submit_error_email_invalid`, `chat_submit_error_server`, `chat_submit_error_network` |
| 완료 | `chat_done_view`, `chat_done_cta_click` | 각 1종 |
| 언어 전환 | `chat_lang_switch` | 1종 (파라미터: from, to) |

---

## 지표 계산 예시

- **퍼널 진입**: `chat_funnel_start` 수 (필터: `form_source` 로 KR/JP 구분)
- **단계별 도달**: `chat_step_view` 에서 `step` / `step_index` / `visitor_type` 별 카운트
- **이탈 구간**: `chat_step_view(step_index=N)` 은 있으나 같은 세션에서 `chat_step_view(step_index=N+1)` 또는 `chat_submit_success` 가 없으면 N 단계에서 이탈
- **선택지별 분포**: `chat_step_choice` 에서 `step` + `choice_value` 로 단계별 선택 비율
- **최종 전환율**: `chat_submit_success` / `chat_funnel_start` (필터: `form_source`, `visitor_type`)
- **신청 시도 대비 성공**: `chat_submit_success` / `chat_submit_click`
