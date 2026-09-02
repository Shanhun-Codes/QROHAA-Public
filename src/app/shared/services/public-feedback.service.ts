import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.local';
import { AppConfigData } from '../models/app-config-data.interface';
import { SubmitPublicFeedbackRequest } from '../models/submit-public-feedback-request.interface';

@Injectable({
  providedIn: 'root',
})
export class PublicFeedbackService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  public submit(
    slug: string,
    publicCode: string,
    config: AppConfigData,
    formValues: Record<string, string | null>,
  ): Promise<void> {
    const request = this.createRequest(config, formValues);

    return firstValueFrom(
      this.http.post<void>(
        `${this.baseUrl}/public/agents/${slug}/open-houses/${publicCode}/feedback`,
        request,
      ),
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
      feedbackAnswers: config.feedbackForm.questions.flatMap((question) => {
        const value = valueFor(question.key);

        return value ? [{ questionId: question.id, value }] : [];
      }),
    };
  }
}