export type FeedbackQuestionType =
  | 'SINGLE_SELECT'
  | 'TEXT'
  | 'TEXTAREA'
  | 'RATING';

export type FeedbackQuestionCategory =
  | 'BUYER_PROFILE'
  | 'PROPERTY_FEEDBACK'
  | 'BUYING_READINESS';

export interface FeedbackQuestionOption {
  label: string;
  value: string;
  sortOrder: number;
}

export interface FeedbackQuestion {
  id: string;
  key: string;
  label: string;
  type: FeedbackQuestionType;
  category: FeedbackQuestionCategory;
  required: boolean;
  sortOrder: number;
  options: FeedbackQuestionOption[];
}

export interface FeedbackFormPublicData {
  questions: FeedbackQuestion[];
}
