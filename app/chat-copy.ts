/* 챗봇 한국어/일본어 문구. 일본어는 문법·자연스러움 검토 반영. */

export type StepId =
  | "welcome"
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

export type ChatCopy = {
  otherLabel: string; // "기타" | "その他"
  getBotMessage: (step: StepId) => string;
  purposeOptions: string[];
  topicOptions: string[];
  genderOptions: string[];
  ageOptions: string[];
  jobOptions: string[];
  jobPreferenceOptions: string[];
  interpreterOptions: string[];
  locationOptions: string[];
  timeOptions: string[];
  whenJoinOptions: string[];
  btnStart: string;
  btnNext: string;
  btnSubmit: string;
  btnSubmitting: string;
  btnEdit: string;
  btnCancel: string;
  gnbTagline: string;
  langLinkLabel: string;
  langLinkHref: string;
  doneTitle: string;
  doneDesc: string;
  doneBtn: string;
  doneLinkHref: string;
  placeholderTopicOther: string;
  placeholderJobOther: string;
  placeholderLocationOther: string;
  placeholderEmail: string;
  consentNote: string;
  reviewNote: string;
  reviews: { q: string; who: string }[];
  errorEmailRequired: string;
  errorEmailInvalid: string;
  errorSubmit: string;
  errorNetwork: string;
  formSource: string;
};

const STEPS: StepId[] = [
  "welcome", "purpose", "topic", "gender", "age", "job", "job_preference",
  "interpreter", "location", "time", "when_join", "email",
];

function getBotMessageKr(step: StepId): string {
  switch (step) {
    case "welcome": return "반가워요. CCC는 통역 있는 현지인·여행자 3:3 글로벌 토크 클럽이에요. 아래 정보를 입력하면 본인에게 적합한 맞춤 세션을 추천해 드려요. (1분 이내) 그럼 시작할까요?";
    case "purpose": return "지금 참여할 계획이 있으신가요? 아니면 먼저 알아보시는 중이신가요?";
    case "topic": return "어떤 주제로 이야기해 보고 싶으세요?";
    case "gender": return "성별을 알려주실 수 있나요?";
    case "age": return "연령대가 어떻게 되시나요?";
    case "job": return "직업을 알려주실 수 있나요?";
    case "job_preference": return "비슷한 직업군과 서로 다른 직업군과의 대화 중 어떤 것을 더 원하시나요?";
    case "interpreter": return "통역 지원이 필요하신가요?";
    case "location": return "어디 근처로 여행(방문) 예정이신가요? 그에 맞춰 가장 잘 맞는 장소를 추천해 드릴게요.";
    case "time": return "어떤 시간대가 좋으세요?";
    case "when_join": return "참여는 언제쯤으로 희망하시나요?";
    case "email": return "이메일을 남겨주시면 맞춤 세션 안내를 보내 드릴게요. 이메일을 받으면 가장 마음에 드는 주제, 인원, 일정, 장소 등의 조합을 선택하시면 돼요!";
    default: return "";
  }
}

/* 일본어: 문법·경어·자연스러움 검토 반영 */
function getBotMessageJp(step: StepId): string {
  switch (step) {
    case "welcome": return "ようこそ。CCCは通訳付きの現地人・旅行者3:3グローバルトーククラブです。情報を入力いただくと、あなたに合ったセッションをご案内します。（1分以内）始めましょうか？";
    case "purpose": return "今、参加のご予定はありますか？それともまずは情報を見てみますか？";
    case "topic": return "どんなテーマで話してみたいですか？";
    case "gender": return "性別を教えていただけますか？";
    case "age": return "年代を教えていただけますか？";
    case "job": return "職業を教えていただけますか？";
    case "job_preference": return "似た職業の方を希望されますか？それとも異なる職業の方との会話を希望されますか？";
    case "interpreter": return "通訳のサポートは必要ですか？";
    case "location": return "どちらの近くに旅行（訪問）のご予定ですか？合わせて最適な場所をご案内します。";
    case "time": return "どの時間帯がよろしいですか？";
    case "when_join": return "参加はいつ頃を希望されますか？";
    case "email": return "メールアドレスを残していただければ、ご希望に合ったセッションをご案内します。メールが届いたら、気になるテーマ・人数・日程・場所の組み合わせを選んでいただくだけです！";
    default: return "";
  }
}

export const COPY_KR: ChatCopy = {
  otherLabel: "기타",
  getBotMessage: getBotMessageKr,
  purposeOptions: ["참여할 계획 있어요", "일단 알아보는 중이에요.", "아직 잘 모르겠어요"],
  topicOptions: ["일·커리어", "사회·가치관", "연애·관계", "돈·라이프", "취미·라이프", "기타"],
  genderOptions: ["남성", "여성", "비공개"],
  ageOptions: ["20대", "30대", "40대 이상"],
  jobOptions: ["회사원", "자영업·창업", "프리랜서", "학생", "전문직", "기타", "비공개"],
  jobPreferenceOptions: ["비슷한 직업군", "서로 다른 직업군"],
  interpreterOptions: ["필요해요", "괜찮아요, 한국어나 일본어로 할게요"],
  locationOptions: ["강남", "성수", "한남", "홍대", "기타"],
  timeOptions: ["오전 (09:00~12:00)", "오후 (12:00~18:00)", "저녁 (18:00~)"],
  whenJoinOptions: ["1주일 이내", "1개월 이내", "2~3개월 이내", "미정 (정보 받으면 그때 결정할게요)"],
  btnStart: "네, 시작할게요",
  btnNext: "다음",
  btnSubmit: "참여 신청하기",
  btnSubmitting: "보내는 중...",
  btnEdit: "수정",
  btnCancel: "취소",
  gnbTagline: "통역 있는 현지인·여행자 3:3 글로벌 토크 클럽",
  langLinkLabel: "🇯🇵 日本語",
  langLinkHref: "/jp",
  doneTitle: "등록 완료!",
  doneDesc: "세션 매칭 시 이메일로 연락드릴게요.",
  doneBtn: "처음으로",
  doneLinkHref: "/",
  placeholderTopicOther: "예: 문화, 예술 등",
  placeholderJobOther: "예: 디자이너, 연구원 등",
  placeholderLocationOther: "예: 이태원, 건대 등",
  placeholderEmail: "example@email.com",
  consentNote: "제출 시 개인정보 제공에 동의한 것으로 간주해요.",
  reviewNote: "이미 200명 이상이 세션에 참여했어요.\n편하게 신청해 주세요 :)",
  reviews: [
    { q: "참여 전엔 걱정했는데, 막상 해보니 재밌고 편했어요.", who: "참여자 A" },
    { q: "통역이 있어서 대화가 술술 풀렸어요.", who: "참여자 B" },
    { q: "다른 나라 관점이 신선했고 선입견이 많이 깨졌어요.", who: "참여자 C" },
  ],
  errorEmailRequired: "이메일을 입력해주세요.",
  errorEmailInvalid: "올바른 이메일 형식이 아니에요.",
  errorSubmit: "제출 중 오류가 발생했어요. 다시 시도해주세요.",
  errorNetwork: "네트워크 오류가 발생했어요. 다시 시도해주세요.",
  formSource: "chat_kr",
};

export const COPY_JP: ChatCopy = {
  otherLabel: "その他",
  getBotMessage: getBotMessageJp,
  purposeOptions: ["参加する予定です", "まずは様子を見ます", "まだわかりません"],
  topicOptions: ["仕事・キャリア", "社会・価値観", "恋愛・関係", "お金・暮らし", "趣味・ライフ", "その他"],
  genderOptions: ["男性", "女性", "非公開"],
  ageOptions: ["20代", "30代", "40代以上"],
  jobOptions: ["会社員", "自営業・起業", "フリーランス", "学生", "専門職", "その他", "非公開"],
  jobPreferenceOptions: ["似た職業の方", "異なる職業の方"],
  interpreterOptions: ["必要です", "大丈夫です。韓国語か日本語で話します"],
  locationOptions: ["カンナム", "ソンス", "ハンナム", "ホンデ", "その他"],
  timeOptions: ["午前(09:00~12:00)", "午後(12:00~18:00)", "夕方(18:00~)"],
  whenJoinOptions: ["1週間以内", "1ヶ月以内", "2〜3ヶ月以内", "未定（お知らせを見てから決めます）"],
  btnStart: "はい、始めます",
  btnNext: "次へ",
  btnSubmit: "参加を申し込む",
  btnSubmitting: "送信中...",
  btnEdit: "修正",
  btnCancel: "キャンセル",
  gnbTagline: "通訳付きの現地人・旅行者 3:3 グローバルトーククラブ",
  langLinkLabel: "🇰🇷 한국어",
  langLinkHref: "/",
  doneTitle: "登録完了！",
  doneDesc: "セッションのマッチング結果はメールでお知らせします。",
  doneBtn: "最初に戻る",
  doneLinkHref: "/jp",
  placeholderTopicOther: "例：文化、芸術など",
  placeholderJobOther: "例：デザイナー、研究者など",
  placeholderLocationOther: "例：イテウォン、キョンダなど",
  placeholderEmail: "example@email.com",
  consentNote: "送信により個人情報の提供に同意したものとみなします。",
  reviewNote: "すでに200名以上がセッションに参加しています。\nお気軽に申し込んでください :)",
  reviews: [
    { q: "参加前は心配でしたが、やってみると楽しくて気楽でした。", who: "参加者A" },
    { q: "通訳がいたので会話がスムーズに進みました。", who: "参加者B" },
    { q: "他国の視点が新鮮で、先入観がたくさん壊れました。", who: "参加者C" },
  ],
  errorEmailRequired: "メールアドレスを入力してください。",
  errorEmailInvalid: "正しいメール形式ではありません。",
  errorSubmit: "送信時にエラーが発生しました。もう一度お試しください。",
  errorNetwork: "ネットワークエラーが発生しました。もう一度お試しください。",
  formSource: "chat_jp",
};

export { STEPS };
