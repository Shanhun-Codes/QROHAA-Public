import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AppConfigData } from '../shared/models/app-config-data.interface';
import { BrokeragePublicData } from '../shared/models/agent-public-data.interface';
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
  public hasLeadContact: boolean = false;

  constructor() {
    if (this.activatedRoute.snapshot.data['preview'] === true) {
      const stateConfig = (history.state as Partial<ThankYouNavigationState>)
        .config;

      if (stateConfig) {
        this.showPreview(stateConfig);
      } else {
        void this.loadPreviewConfig();
      }
      return;
    }

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

  private showPreview(config: AppConfigData): void {
    this.hasLeadContact = true;
    this.brandStyles.set(this.configService.getBrandStyles(config.branding));
    this.configData.set(config);
  }

  private loadPreviewConfig(): Promise<void> {
    return new Promise((resolve) => {
      const handler = (event: MessageEvent) => {
        const message = event.data as {
          type?: string;
          config?: AppConfigData;
        } | null;

        if (message?.type !== 'OPEN_HOUSE_PREVIEW_CONFIG' || !message.config) {
          return;
        }

        window.removeEventListener('message', handler);
        this.showPreview(message.config);
        resolve();
      };

      window.addEventListener('message', handler);

      window.parent.postMessage(
        { type: 'OPEN_HOUSE_PREVIEW_READY' },
        environment.agentAppUrl,
      );
    });
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

  public formatBrokerageAddress(brokerage: BrokeragePublicData): string {
    const locality = [brokerage.city, brokerage.state]
      .filter(Boolean)
      .join(', ');

    return [brokerage.street, brokerage.street2, locality, brokerage.zip]
      .filter(Boolean)
      .join(', ');
  }
}
