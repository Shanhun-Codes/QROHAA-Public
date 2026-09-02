import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigData } from '../shared/models/app-config-data.interface';
import { BrandStyles, ConfigService } from '../shared/services/config.service';
import { SubmitPublicFeedbackResponse } from '../shared/models/submit-public-feedback-response.interface';

interface ThankYouNavigationState {
  config: AppConfigData;
  submission: SubmitPublicFeedbackResponse;
}

@Component({
  selector: 'app-thank-you-page',
  standalone: true,
  imports: [],
  templateUrl: './thank-you-page.component.html',
  styleUrl: './thank-you-page.component.scss',
})
export class ThankYouPageComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly configService = inject(ConfigService);

  public readonly configData: WritableSignal<AppConfigData | null> =
    signal(null);
  public readonly brandStyles: WritableSignal<BrandStyles | null> =
    signal(null);
  public readonly leadCreated: boolean = false;
  public readonly hasLeadContact: boolean = false;

  constructor() {
    const slug = this.activatedRoute.snapshot.paramMap.get('slug');
    const publicCode = this.activatedRoute.snapshot.paramMap.get('publicCode');
    const state = history.state as Partial<ThankYouNavigationState>;

    if (!slug || !publicCode || !state.config || !state.submission) {
      void this.router.navigate([slug ?? '', 'open-house', publicCode ?? '']);
      return;
    }

    this.leadCreated = state.submission.leadAction === 'LEAD_CREATED';

    this.hasLeadContact = state.submission.leadAction !== 'NO_LEAD_CREATED';

    this.brandStyles.set(
      this.configService.getBrandStyles(state.config.branding),
    );

    this.configData.set(state.config);
  }

  public formatPhoneNumber(phoneNumber: string): string {
    const digits = phoneNumber.replace(/\D/g, '');
    const tenDigitNumber =
      digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;

    if (tenDigitNumber.length !== 10) {
      return phoneNumber;
    }

    return `(${tenDigitNumber.slice(0, 3)}) ${tenDigitNumber.slice(3, 6)}-${tenDigitNumber.slice(6)}`;
  }
}
