export interface SubmitPublicFeedbackResponse {
  message: string;
  submissionId: string;
  leadAction: 'LEAD_CREATED' | 'NO_LEAD_CREATED' | 'LEAD_REUSED';
}
