# Taglow Survey Participant TDD

## 1. 참여자 TDD v2 요약

참여자 페이지는 다음 흐름을 구현한다.

```text
공개 URL/QR 접속
→ 설문 상태 확인
→ Google 로그인
→ @handong.ac.kr 도메인 검증
→ 중복 제출 여부 확인
→ 설문 안내 화면
→ 섹션별 질문 응답
→ 프론트엔드 캐시 임시 저장
→ 이미지/도면 태깅
→ 제출 전 검토
→ 최종 제출
→ responses + answers 저장
→ 제출 완료 화면
```

현재 자체 서버가 없으므로 Supabase를 직접 사용한다. 하지만 서버 도입 후에도 참여자 View를 변경하지 않도록 API Boundary를 적용한다.

```text
현재 구조:
Participant View
  → Participant Query / Mutation Hook
  → ParticipantApiController
  → ParticipantPayloadMapper
  → SupabaseParticipantApiGateway
  → Supabase Auth / Database / Storage / RPC

서버 구축 후:
Participant View
  → Participant Query / Mutation Hook
  → ParticipantApiController
  → ParticipantPayloadMapper
  → HttpParticipantApiGateway
  → 자체 API 서버
  → Supabase
```

Supabase SDK는 `SupabaseParticipantApiGateway` 내부에만 존재한다.

---

## 2. 공통 기술 스택

| 영역 | 선택 기술 | 적용 방식 |
| --- | --- | --- |
| Frontend | React + TypeScript | 참여자 SPA 구현 |
| Routing | React Router | 공개 설문 URL 라우팅 |
| Server State | TanStack Query | 공개 설문 구조 조회, 중복 제출 조회, 제출 mutation 관리 |
| Client/UI State | Zustand | 현재 섹션, locale, draft 복구 상태, 이미지 태깅 UI 상태 |
| Form State | React Hook Form | 섹션별 질문 입력값 관리 |
| Validation | Zod | 질문 유형별 응답값, 제출 payload 검증 |
| Draft Cache | localStorage 우선, 필요 시 IndexedDB | 서버 부담 없는 프론트엔드 임시 저장 |
| Backend | Supabase | 서버 구축 전 데이터/API 백엔드 |
| Auth | Supabase Auth | Google 로그인, 세션 관리 |
| Storage | Supabase Storage | 이미지 태깅용 이미지 조회 |
| Database | Supabase Postgres | published survey 조회, responses/answers 저장 |
| Test | Vitest + React Testing Library | 단위/컴포넌트 테스트 |
| E2E | Playwright | 로그인, 응답, 임시 저장, 제출 흐름 검증 |

---

## 3. 상태관리 선택

참여자 페이지는 서버 데이터보다 “응답 중인 폼 상태”와 “draft 복구”가 중요하다. 따라서 다음처럼 역할을 나눈다.

```text
공개 설문 구조 데이터
→ TanStack Query

참여자 진행 상태
→ Zustand

질문 입력값
→ React Hook Form

임시 저장 draft
→ localStorage / IndexedDB
```

## 3.1 TanStack Query 사용 범위

- 공개 설문 데이터 조회
- 설문 상태 확인
- 섹션/질문/자산 metadata 조회
- 중복 제출 여부 조회
- 최종 제출 mutation

## 3.2 Zustand 사용 범위

- 현재 선택 locale
- 현재 section index
- 완료된 section id 목록
- draft 복구 여부
- 제출 전 검토 화면 진입 여부
- 이미지 태깅 편집 상태
- 로그인/접근 제한 상태의 화면 전환 상태

## 3.3 React Hook Form 사용 범위

- 질문 입력값 관리
- 섹션 단위 validation
- 제출 전 전체 validation
- dirty/touched 상태 추적
- draft save trigger와 연동

## 3.4 Draft Cache 사용 범위

```text
- 서버에는 최종 제출 전까지 저장하지 않는다.
- draft는 survey_id + participant_user_id 기준으로 구분한다.
- 최종 제출 성공 시 draft를 삭제한다.
- 브라우저/기기 변경 간 draft 동기화는 지원하지 않는다.
- draft에는 access token, refresh token, service key를 저장하지 않는다.
```

---

## 4. 프로젝트 구조

Generalized Project Structure Guide를 기반으로 하되, 참여자 도메인에 맞게 다음 구조를 적용한다.

```text
src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   ├── providers.tsx
│   ├── queryClient.ts
│   └── routeGuards.tsx
│
├── api/
│   └── participant/
│       ├── model/
│       │   ├── auth.ts
│       │   ├── publicSurvey.ts
│       │   ├── section.ts
│       │   ├── question.ts
│       │   ├── asset.ts
│       │   ├── answerDraft.ts
│       │   ├── submission.ts
│       │   └── commands.ts
│       │
│       ├── service/
│       │   ├── gateway/
│       │   │   ├── participantApiGateway.ts
│       │   │   ├── supabaseParticipantApiGateway.ts
│       │   │   ├── httpParticipantApiGateway.ts
│       │   │   └── apiErrors.ts
│       │   │
│       │   ├── mapper/
│       │   │   └── participantPayloadMapper.ts
│       │   │
│       │   ├── draft/
│       │   │   ├── draftStorage.ts
│       │   │   ├── localStorageDraftStorage.ts
│       │   │   └── indexedDbDraftStorage.ts
│       │   │
│       │   └── validation/
│       │       ├── answerSchema.ts
│       │       ├── submissionSchema.ts
│       │       ├── branchEvaluator.ts
│       │       └── attentionCheckValidator.ts
│       │
│       ├── controller/
│       │   ├── participantApiController.ts
│       │   ├── gatewayBackedParticipantApiController.ts
│       │   └── participantApiControllerProvider.tsx
│       │
│       ├── query/
│       │   ├── queryKeys.ts
│       │   ├── usePublicSurveyQuery.ts
│       │   ├── useDuplicateSubmissionQuery.ts
│       │   └── useSubmissionMutation.ts
│       │
│       └── runtime/
│           ├── createParticipantApiRuntime.ts
│           └── participantApiRuntime.tsx
│
├── store/
│   ├── participantProgressStore.ts
│   ├── participantLocaleStore.ts
│   ├── participantDraftStore.ts
│   ├── imageTaggingStore.ts
│   └── uiStore.ts
│
├── components/
│   ├── Button.tsx
│   ├── Select.tsx
│   ├── ProgressBar.tsx
│   ├── StepHeader.tsx
│   ├── Message.tsx
│   └── css/
│
├── utils/
│   ├── envConfig.ts
│   ├── authDomain.ts
│   ├── i18nText.ts
│   ├── imageRatio.ts
│   ├── answerNormalizer.ts
│   ├── draftKey.ts
│   └── dateTime.ts
│
├── view/
│   └── participant/
│       ├── auth/
│       │   ├── ParticipantLoginPage.tsx
│       │   └── components/
│       │
│       ├── survey/
│       │   ├── SurveyEntryPage.tsx
│       │   ├── SurveyIntroPage.tsx
│       │   ├── SurveySectionPage.tsx
│       │   ├── SurveyReviewPage.tsx
│       │   ├── SurveyCompletePage.tsx
│       │   └── components/
│       │       ├── SectionNavigator.tsx
│       │       ├── QuestionRenderer.tsx
│       │       ├── ScaleQuestion.tsx
│       │       ├── SingleChoiceQuestion.tsx
│       │       ├── MultiSelectQuestion.tsx
│       │       ├── RankingQuestion.tsx
│       │       ├── TextQuestion.tsx
│       │       ├── ImageTagQuestion.tsx
│       │       ├── LowScoreFollowUp.tsx
│       │       ├── AttentionCheckQuestion.tsx
│       │       └── DraftRestoreBanner.tsx
│       │
│       └── system/
│           ├── SurveyNotFoundPage.tsx
│           ├── SurveyClosedPage.tsx
│           ├── AlreadySubmittedPage.tsx
│           └── AccessDeniedPage.tsx
│
└── test/
    ├── setup.ts
    ├── renderWithProviders.tsx
    ├── fakeParticipantApiController.ts
    └── fixtures/
```

---

## 5. 라우팅 설계

```text
/survey/:publicSlug
/survey/:publicSlug/login
/survey/:publicSlug/intro
/survey/:publicSlug/sections/:sectionKey
/survey/:publicSlug/review
/survey/:publicSlug/complete
/survey/:publicSlug/closed
/survey/:publicSlug/already-submitted
/survey/:publicSlug/access-denied
```

### 5.1 Route Guard

참여자 라우트는 다음 조건을 처리한다.

```text
1. publicSlug로 survey 조회
2. survey.status = published 확인
3. Google 로그인 확인
4. @handong.ac.kr 도메인 확인
5. responses unique index 기준 중복 제출 여부 확인
```

분기:

```text
비로그인 → /survey/:publicSlug/login
handong 계정 아님 → /survey/:publicSlug/access-denied
설문 없음 → /survey/:publicSlug/not-found
closed/archived → /survey/:publicSlug/closed
이미 제출함 → /survey/:publicSlug/already-submitted
통과 → /survey/:publicSlug/intro
```

---

## 6. 확장된 Supabase Database 구조 중 참여자 관련 영역

참여자 페이지가 직접 사용하는 테이블은 다음이다.

```text
읽기:
- surveys
- survey_sections
- questions
- survey_assets

쓰기:
- responses
- answers

권한 검증:
- auth.users via Supabase Auth
- RLS helper is_handong_user()
```

관리자 권한 테이블 `admin_members`는 참여자 페이지에서 직접 사용하지 않는다.

---

## 6.1 참여자 조회 모델

### `surveys`

참여자는 `public_slug`로 published survey를 조회한다.

필요 필드:

```text
id
title
description
status
public_slug
settings
published_at
closed_at
```

참여자가 볼 수 있는 조건:

```text
status = published
public_slug = route param
@handong.ac.kr authenticated user
```

### `survey_sections`

섹션 단위 진행을 위해 조회한다.

필요 필드:

```text
id
survey_id
section_key
title_ko
title_en
description_ko
description_en
order_index
section_type
settings
```

### `questions`

섹션 안의 질문을 렌더링하기 위해 조회한다.

필요 필드:

```text
id
survey_id
section_id
question_key
question_type
title_ko
title_en
description_ko
description_en
order_index
is_required
metric_type
topic_key
space_key
config
validation
```

### `survey_assets`

이미지 태깅용 공간 이미지를 렌더링하기 위해 조회한다.

필요 필드:

```text
id
survey_id
section_id
question_id
asset_type
storage_bucket
storage_path
metadata
```

---

## 6.2 참여자 제출 모델

### `responses`

한 명의 최종 제출 단위다.

저장 필드:

```text
survey_id
participant_user_id
participant_email
status
locale
gender
semester_group
department
rc
dormitory
room_type
dorm_experience
profile_json
raw_payload
started_at
submitted_at
```

기본 정보는 관리자 필터링을 위해 컬럼으로 저장한다.

```text
- gender
- semester_group
- department
- rc
- dormitory
- room_type
- dorm_experience
```

### `answers`

모든 질문의 응답을 통합 저장한다.

공통 필드:

```text
survey_id
response_id
section_id
question_id
answer_type
metric_type
topic_key
space_key
value_json
```

유형별 필드:

```text
scale:
- score_value

single_choice:
- choice_value

multi_select:
- value_json.selected_options

ranking:
- value_json.ranked_options

text:
- text_value
- severity optional

image_tag:
- asset_id
- x_ratio
- y_ratio
- tag_type
- severity
- text_value

attention_check:
- choice_value or score_value
```

---

## 7. Participant Domain Model

```ts
export type PublicSurvey = Readonly<{
  id: string;
  title: string;
  description?: string;
  publicSlug: string;
  status: 'published' | 'closed' | 'archived';
  settings: PublicSurveySettings;
  sections: PublicSurveySection[];
  assets: SurveyAsset[];
}>;

export type PublicSurveySection = Readonly<{
  id: string;
  surveyId: string;
  sectionKey: string;
  title: LocalizedText;
  description?: LocalizedText;
  orderIndex: number;
  sectionType: string;
  questions: PublicQuestion[];
}>;

export type PublicQuestion = Readonly<{
  id: string;
  surveyId: string;
  sectionId: string;
  questionKey: string;
  questionType: QuestionType;
  title: LocalizedText;
  description?: LocalizedText;
  orderIndex: number;
  isRequired: boolean;
  metricType: MetricType;
  topicKey?: string;
  spaceKey?: string;
  config: QuestionConfig;
  validation: QuestionValidation;
}>;

export type SubmissionCommand = Readonly<{
  surveyId: string;
  participantUserId: string;
  participantEmail: string;
  locale: 'ko' | 'en';
  startedAt?: string;
  profile: RespondentProfile;
  answers: AnswerInput[];
  rawPayload: Record<string, unknown>;
}>;
```

---

## 8. Participant API Gateway Interface

```ts
export interface ParticipantApiGateway {
  getSession(): Promise<RawSession | null>;
  signInWithGoogle(redirectTo: string): Promise<void>;
  signOut(): Promise<void>;

  fetchPublicSurveyBySlug(publicSlug: string): Promise<RawPublicSurveyBundle>;
  checkDuplicateSubmission(args: {
    surveyId: string;
    participantUserId: string;
  }): Promise<RawDuplicateSubmissionResult>;

  createResponse(payload: RawCreateResponsePayload): Promise<RawResponse>;
  createAnswers(payloads: RawCreateAnswerPayload[]): Promise<RawAnswer[]>;

  submitSurveyResponse?(payload: RawSubmitSurveyPayload): Promise<RawSubmitSurveyResult>;

  createSignedAssetUrl(args: {
    bucket: string;
    path: string;
  }): Promise<string>;
}
```

### 8.1 제출 방식

MVP에서 선택 가능한 제출 방식은 2개다.

#### A안. response insert + answers bulk insert

```text
1. responses insert
2. response_id 반환
3. answers bulk insert
4. 성공 시 draft 삭제
```

장점:

```text
- 구현이 빠름
- Supabase table insert만으로 가능
```

주의점:

```text
- answers insert 실패 시 response만 남을 수 있음
- 실패 시 response.status = discarded 처리 필요
```

#### B안. submit_survey_response RPC

```text
1. submitSurveyResponse(payload)
2. DB function 내부에서 response + answers transaction 처리
3. 성공 시 response_id 반환
4. 성공 시 draft 삭제
```

장점:

```text
- transaction 처리 가능
- 중간 실패 상태 최소화
- 서버 구축 전에도 DB function으로 안정성 확보
```

추천:

```text
초기 개발은 A안으로 시작 가능.
정식 런칭 전에는 B안으로 전환 권장.
```

Participant Controller에서는 두 방식을 같은 use case로 감싼다.

```ts
submitSurvey(command: SubmissionCommand): Promise<SubmissionResult>
```

Gateway 구현체만 A/B를 선택한다.

---

## 9. Payload Mapper 설계

Mapper 책임:

```text
- Supabase survey/section/question/assets row를 PublicSurvey domain으로 변환
- title_ko/title_en을 LocalizedText로 변환
- questions.config를 questionType별 config로 parse
- form values를 answers insert payload로 변환
- 기본 정보 문항 값을 responses 컬럼으로 추출
- image_tag form value를 x_ratio/y_ratio/tag_type/text_value로 변환
```

예시:

```ts
export function toAnswerPayload(input: AnswerInput): RawCreateAnswerPayload {
  return {
    survey_id: input.surveyId,
    response_id: input.responseId,
    section_id: input.sectionId,
    question_id: input.questionId,
    asset_id: input.assetId ?? null,
    answer_type: input.answerType,
    metric_type: input.metricType ?? 'none',
    topic_key: input.topicKey ?? null,
    space_key: input.spaceKey ?? null,
    score_value: input.scoreValue ?? null,
    text_value: input.textValue ?? null,
    choice_value: input.choiceValue ?? null,
    x_ratio: input.tagPosition?.xRatio ?? null,
    y_ratio: input.tagPosition?.yRatio ?? null,
    tag_type: input.tagType ?? null,
    severity: input.severity ?? null,
    value_json: input.valueJson ?? {},
  };
}
```

---

## 10. Participant Controller Use Cases

```ts
export interface ParticipantApiController {
  getCurrentSession(): Promise<ParticipantSession | null>;
  signInWithGoogle(command: SignInCommand): Promise<void>;
  signOut(): Promise<void>;

  getPublicSurvey(publicSlug: string): Promise<PublicSurvey>;
  checkAccess(publicSlug: string): Promise<SurveyAccessResult>;
  checkDuplicateSubmission(command: DuplicateSubmissionCommand): Promise<DuplicateSubmissionResult>;

  getAssetUrl(asset: SurveyAsset): Promise<string>;

  submitSurvey(command: SubmissionCommand): Promise<SubmissionResult>;
}
```

---

## 11. Query Key 설계

```ts
export const participantQueryKeys = {
  session: ['participant', 'session'] as const,
  publicSurvey: (publicSlug: string) => ['participant', 'survey', publicSlug] as const,
  duplicateSubmission: (surveyId: string, participantUserId: string) => [
    'participant',
    'survey',
    surveyId,
    'duplicate',
    participantUserId,
  ] as const,
  assetUrl: (assetId: string) => ['participant', 'assetUrl', assetId] as const,
};
```

Mutation:

```text
useSubmissionMutation()
→ controller.submitSurvey(command)
→ 성공 시 draft 삭제
→ complete page 이동
```

---

## 12. Draft Cache 설계

### 12.1 Draft Key

```ts
export function buildDraftKey(args: {
  surveyId: string;
  participantUserId: string;
}) {
  return `taglow-survey-draft:${args.surveyId}:${args.participantUserId}`;
}
```

### 12.2 Draft Shape

```ts
export type SurveyDraft = Readonly<{
  surveyId: string;
  participantUserId: string;
  locale: 'ko' | 'en';
  currentSectionId?: string;
  values: Record<string, unknown>;
  updatedAt: string;
  schemaVersion: number;
}>;
```

### 12.3 저장 시점

```text
- section 이동 시
- 5~10초 debounce
- page visibility hidden
- beforeunload
```

### 12.4 삭제 시점

```text
- 제출 성공
- 사용자가 임시 저장 삭제 선택
- survey id 또는 participant id 불일치
- schemaVersion mismatch 시 복구 불가 처리
```

---

## 13. 질문 렌더링 설계

`QuestionRenderer`는 `question.questionType`에 따라 컴포넌트를 선택한다.

```text
profile → ProfileQuestion
scale → ScaleQuestion
single_choice → SingleChoiceQuestion
multi_select → MultiSelectQuestion
ranking → RankingQuestion
text → TextQuestion
image_tag → ImageTagQuestion
attention_check → AttentionCheckQuestion
```

### 13.1 ScaleQuestion

저장 매핑:

```text
answer_type = scale
metric_type = question.metricType
score_value = 선택한 점수
```

### 13.2 ImageTagQuestion

태깅 플로우:

```text
이미지 로드
→ 이미지 표시 영역 측정
→ 사용자 클릭 좌표 수집
→ x_ratio/y_ratio 계산
→ tag_type 선택
→ severity 선택
→ text 입력
→ form value에 추가
```

좌표 계산:

```ts
xRatio = (clientX - imageRect.left) / imageRect.width;
yRatio = (clientY - imageRect.top) / imageRect.height;
```

저장 매핑:

```text
answer_type = image_tag
asset_id = question.config.assetId
x_ratio = xRatio
y_ratio = yRatio
tag_type = selectedTagType
severity = selectedSeverity
text_value = comment
```

### 13.3 MultiSelectQuestion

저장 매핑:

```json
{
  "selectedOptions": ["05_07", "07_09"],
  "otherText": null
}
```

### 13.4 RankingQuestion

저장 매핑:

```json
{
  "rankedOptions": [
    { "rank": 1, "optionValue": "room_assignment" },
    { "rank": 2, "optionValue": "rc_event" }
  ]
}
```

---

## 14. Validation 설계

Zod schema는 question type별로 둔다.

```text
answerSchema.ts
- profileAnswerSchema
- scaleAnswerSchema
- singleChoiceAnswerSchema
- multiSelectAnswerSchema
- rankingAnswerSchema
- textAnswerSchema
- imageTagAnswerSchema
- attentionCheckAnswerSchema
```

### 14.1 공통 검증

```text
- required 문항 응답 여부
- scale 점수 범위
- multi_select 최소/최대 선택 수
- ranking 중복 선택 방지
- image_tag 최대 태그 수
- image_tag 좌표 0~1 범위
- text 최소 글자 수
- attention_check 기대값 일치 여부
```

### 14.2 Submit 전 검증

```text
- 모든 required 질문 통과
- 기본 정보 컬럼 추출 가능
- image_tag answer의 asset_id 존재
- attention_check 실패 응답 표시 또는 제출 차단 정책 적용
- duplicate submission query 통과
```

---

## 15. 제출 Payload 설계

Controller가 받는 command:

```ts
export type SubmissionCommand = Readonly<{
  surveyId: string;
  participantUserId: string;
  participantEmail: string;
  locale: 'ko' | 'en';
  startedAt?: string;
  profile: {
    gender?: string;
    semesterGroup?: string;
    department?: string;
    rc?: string;
    dormitory?: string;
    roomType?: string;
    dormExperience?: string;
    extra?: Record<string, unknown>;
  };
  answers: AnswerInput[];
  rawPayload: Record<string, unknown>;
}>;
```

`responses` insert payload:

```ts
{
  survey_id: command.surveyId,
  participant_user_id: command.participantUserId,
  participant_email: command.participantEmail,
  status: 'submitted',
  locale: command.locale,
  gender: command.profile.gender,
  semester_group: command.profile.semesterGroup,
  department: command.profile.department,
  rc: command.profile.rc,
  dormitory: command.profile.dormitory,
  room_type: command.profile.roomType,
  dorm_experience: command.profile.dormExperience,
  profile_json: command.profile.extra ?? {},
  raw_payload: command.rawPayload,
  started_at: command.startedAt,
  submitted_at: new Date().toISOString(),
}
```

`answers` insert payload는 각 `AnswerInput`을 mapper에서 변환한다.

---

## 16. 중복 제출 방지

DB는 다음 unique index를 가진다.

```sql
create unique index uniq_submitted_response_per_user
on public.responses (survey_id, participant_user_id)
where status = 'submitted';
```

프론트 흐름:

```text
1. 로그인 후 duplicate query 실행
2. 이미 submitted response가 있으면 AlreadySubmittedPage 표시
3. submit 시 unique violation이 발생하면 AlreadySubmittedPage로 이동
```

---

## 17. 접근 제어 및 보안

### 17.1 참여자 접근 조건

```text
- authenticated user
- email domain = @handong.ac.kr
- survey.status = published
```

### 17.2 RLS 기대 동작

```text
surveys:
- published survey만 select 가능

survey_sections/questions/survey_assets:
- published survey에 속한 row만 select 가능

responses:
- 자기 response만 insert/select 가능

answers:
- 자기 response에 속한 answer만 insert/select 가능
```

### 17.3 브라우저에 저장하지 말아야 할 것

```text
- Supabase service role key
- access token 원문을 별도 storage에 저장
- 개인정보가 포함된 raw payload를 불필요하게 localStorage에 장기 보관
```

Draft에는 설문 응답 중간값이 저장될 수 있으므로, 민감 문항은 최소화하고 제출 성공 시 즉시 삭제한다.

---

## 18. Storage 이미지 로딩

참여자는 image_tag 질문에 연결된 asset을 조회하고 이미지를 표시한다.

흐름:

```text
questions.config.assetId
→ survey_assets row 조회
→ ParticipantApiGateway.createSignedAssetUrl(bucket, path)
→ 이미지 표시
```

private bucket을 사용하는 경우 signed URL을 사용한다.

이미지 표시 실패 시:

```text
- retry 버튼 표시
- 이미지 없이 제출 불가
- 관리자에게 문의 문구 표시
```

---

## 19. Error Handling

```ts
export type ParticipantApiErrorCode =
  | 'UNAUTHENTICATED'
  | 'NOT_HANDONG_EMAIL'
  | 'SURVEY_NOT_FOUND'
  | 'SURVEY_CLOSED'
  | 'ALREADY_SUBMITTED'
  | 'VALIDATION_FAILED'
  | 'SUBMISSION_FAILED'
  | 'ASSET_LOAD_FAILED'
  | 'DRAFT_RESTORE_FAILED'
  | 'UNKNOWN';
```

처리 원칙:

```text
- Gateway는 Supabase error를 ParticipantApiError로 변환한다.
- Controller는 사용자 흐름 기준으로 에러를 분기한다.
- View는 route 이동 또는 inline message로 표시한다.
```

---

## 20. 테스트 전략

## 20.1 Unit Test

```text
ParticipantPayloadMapper
- survey bundle row → PublicSurvey 변환
- title_ko/title_en → LocalizedText 변환
- form values → response payload 변환
- form values → answer payload 배열 변환
- image_tag value → x_ratio/y_ratio payload 변환

Validation
- required question validation
- multi_select min/max validation
- ranking duplicate validation
- image_tag coordinate validation
- attention_check validation

Draft
- draft key 생성
- draft save/load/delete
- schemaVersion mismatch 처리
```

## 20.2 Component Test

```text
- SurveyIntroPage 렌더링
- SectionNavigator 진행률 표시
- ScaleQuestion 점수 선택
- MultiSelectQuestion 선택 개수 제한
- RankingQuestion 중복 선택 방지
- ImageTagQuestion 좌표 표시
- DraftRestoreBanner 복구/삭제
- SurveyReviewPage 누락 응답 표시
```

## 20.3 Integration Test

fakeParticipantApiController를 사용한다.

```text
- publicSlug로 survey 조회
- 로그인 전 login page 표시
- handong email 통과
- already submitted이면 complete/blocked page 표시
- 섹션별 입력 후 draft 저장
- draft 복구 후 review 이동
- 제출 성공 시 draft 삭제
```

## 20.4 E2E Test

Playwright 기준:

```text
1. 공개 URL 접속
2. Google login mock
3. 설문 intro 확인
4. 기본 정보 입력
5. 섹션별 scale 응답
6. 이미지 태깅 입력
7. 주관식 입력
8. review 확인
9. submit
10. complete page 확인
11. 재접속 시 already submitted page 확인
```

## 20.5 Database Policy Test

Supabase local 또는 staging project에서 검증한다.

```text
- handong 계정이 아닌 사용자는 published survey select 불가
- participant는 draft survey select 불가
- participant는 다른 사용자의 response select 불가
- participant는 다른 사용자의 response_id로 answers insert 불가
- duplicate submitted response insert 실패
```

---

## 21. 구현 순서

### Phase 1. Public Survey Read

```text
- ParticipantApiGateway 구현
- ParticipantPayloadMapper 구현
- publicSlug 조회
- sections/questions/assets bundle 조회
- locale 렌더링
```

### Phase 2. Auth / Access

```text
- Supabase Google Auth 연결
- @handong.ac.kr 클라이언트 검증
- access denied / closed / not found routing
- duplicate submission query
```

### Phase 3. Survey Rendering

```text
- QuestionRenderer
- scale/single/multi/ranking/text/image_tag 컴포넌트
- section navigation
- validation
```

### Phase 4. Draft Cache

```text
- localStorageDraftStorage
- draft key
- debounce save
- restore banner
- submit success delete
```

### Phase 5. Submission

```text
- response insert + answer bulk insert
- 또는 submit_survey_response RPC 적용
- unique violation 처리
- complete page
```

### Phase 6. Hardening

```text
- image signed URL 처리
- RLS staging test
- E2E test
- edge case handling
```

---

## 22. References

- Supabase Data REST API: https://supabase.com/docs/guides/api
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Storage Access Control: https://supabase.com/docs/guides/storage/security/access-control
- Supabase Google Login: https://supabase.com/docs/guides/auth/social-login/auth-google
