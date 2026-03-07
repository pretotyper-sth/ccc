# 챗 퍼널 이벤트 로그 정의

GA4에 전송되는 커스텀 이벤트 목록. **이탈 구간**과 **최종 전환율** 분석용.

---

## 공통 파라미터 (모든 이벤트에 자동 포함)

| 파라미터 | 설명 |
|----------|------|
| `page_lang` | `kr` \| `jp` (경로 기준) |
| `page_path` | 현재 경로 (예: `/`, `/jp`) |

---

## 이벤트 테이블

| # | 이벤트명 | 발화 시점 | 파라미터 | 용도 |
|---|----------|-----------|----------|------|
| 1 | `chat_funnel_start` | 챗 페이지 진입 시 (환영 단계 노출 직후, 1회) | 없음 | 퍼널 진입 수 = 분모 |
| 2 | `chat_step_view` | 해당 단계 봇 메시지가 화면에 보일 때 | `step`: 단계 ID (welcome \| purpose \| topic \| gender \| age \| job \| interpreter \| location \| time \| when_join \| email), `step_index`: 0~10 | **이탈 구간**: step_index별 도달 수. 마지막 step_view 이후 submit 없으면 이탈로 간주 |
| 3 | `chat_step_choice` | 선택지 버튼 클릭 시 (목적/주제/성별/연령/직업/통역/장소/시간/참여시기, + 환영 시작 버튼) | `step`, `value`: 선택한 값 | 어떤 선택이 많이 나오는지 |
| 4 | `chat_step_other_confirm` | 주제/직업/장소에서 ‘기타’ 입력 후 **다음** 클릭 | `step`: topic \| job \| location | 기타 직접입력 완료 |
| 5 | `chat_step_other_cancel` | 주제/직업/장소 ‘기타’ 입력 화면에서 **취소** 클릭 | `step`: topic \| job \| location | 기타 포기 후 선택지로 복귀 |
| 6 | `chat_step_edit` | 이전 답변 **수정** 버튼 클릭 | `step`: 수정 대상 단계 | 수정 행동 |
| 7 | `chat_submit_click` | **참여 신청하기** 버튼 클릭 | 없음 | 신청 시도 수 |
| 8 | `chat_submit_success` | Formspree 200 응답 시 | 없음 | **최종 전환** = 분자. 전환율 = chat_submit_success / chat_funnel_start |
| 9 | `chat_submit_error` | 이메일 미입력/형식 오류, 또는 서버/네트워크 오류 | `type`: email_required \| email_invalid \| server \| network | 실패 사유별 집계 |
| 10 | `chat_done_view` | 참여 신청 완료 화면 노출 시 | 없음 | 완료 화면 도달 수 |
| 11 | `chat_done_cta_click` | 완료 화면에서 **처음으로** / **最初に戻る** 클릭 | 없음 | 완료 후 액션 |
| 12 | `chat_lang_switch` | GNB에서 언어 전환 링크 클릭 (한국어↔일본어) | `from`: kr \| jp, `to`: kr \| jp | 언어 전환 빈도 |

---

## 지표 계산 예시

- **퍼널 진입**: `chat_funnel_start` 수
- **단계별 도달**: `chat_step_view` 에서 `step` / `step_index` 별 카운트
- **이탈 구간**: `chat_step_view(step_index=N)` 은 있으나 `chat_step_view(step_index=N+1)` 또는 `chat_submit_success` 가 없는 세션
- **최종 전환율**: `chat_submit_success` / `chat_funnel_start`
- **신청 시도 대비 성공**: `chat_submit_success` / `chat_submit_click`
