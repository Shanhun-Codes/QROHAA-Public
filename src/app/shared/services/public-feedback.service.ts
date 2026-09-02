import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.local';
import { AppConfigData } from '../models/app-config-data.interface';
import { SubmitPublicFeedbackRequest } from '../models/submit-public-feedback-request.interface';
import { SubmitPublicFeedbackResponse } from '../models/submit-public-feedback-response.interface';

const browserTokenKey = 'qrohaa-submission-browser-token';
const submissionCooldownKey = 'qrohaa-submission-cooldown-until';
const submissionCooldownMs = 30_000;

@Injectable({
  providedIn: 'root',
})
export class PublicFeedbackService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly browserToken = this.getBrowserToken();

  public submit(
    slug: string,
    publicCode: string,
    config: AppConfigData,
    formValues: Record<string, string | null>,
  ): Promise<SubmitPublicFeedbackResponse> {
    const request = this.createRequest(config, formValues);

    return firstValueFrom(
      this.http.post<SubmitPublicFeedbackResponse>(
        `${this.baseUrl}/public/agents/${slug}/open-houses/${publicCode}/feedback`,
        request,
        {
          headers: {
            'x-submission-browser-token': this.browserToken,
          },
        },
      ),
    );
  }

  public isSubmissionCooldownActive(): boolean {
    return (
      Number(localStorage.getItem(submissionCooldownKey) ?? 0) > Date.now()
    );
  }

  public startSubmissionCooldown(): void {
    localStorage.setItem(
      submissionCooldownKey,
      String(Date.now() + submissionCooldownMs),
    );
  }

  private createRequest(
    config: AppConfigData,
    formValues: Record<string, string | null>,
  ): SubmitPublicFeedbackRequest {
    const valueFor = (key: string): string | undefined => {
      const value = formValues[key]?.trim();
      return value || undefined;
    };

    return {
      firstName: valueFor('firstName'),
      lastName: valueFor('lastName'),
      email: valueFor('email'),
      phone: valueFor('phone'),
      website: formValues['website'] ?? '',
      feedbackAnswers: config.feedbackForm.questions.flatMap((question) => {
        const value = valueFor(question.key);

        return value ? [{ questionId: question.id, value }] : [];
      }),
    };
  }

  private getBrowserToken(): string {
    let browserToken = localStorage.getItem(browserTokenKey);

    if (!browserToken) {
      browserToken = crypto.randomUUID();
      localStorage.setItem(browserTokenKey, browserToken);
    }

    return browserToken;
  }
}
