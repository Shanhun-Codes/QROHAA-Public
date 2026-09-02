export interface PublicFeedbackAnswer {
  questionId: string;
  value: string;
}

export interface SubmitPublicFeedbackRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  feedbackAnswers: PublicFeedbackAnswer[];
}
