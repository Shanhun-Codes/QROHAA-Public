import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, FormRecord, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment.local';
import { BrandStyles, ConfigService } from '../shared/services/config.service';
import { AppConfigData } from '../shared/models/app-config-data.interface';
import {
  FeedbackQuestion,
  FeedbackQuestionCategory,
} from '../shared/models/feedback-form-public-data.interface';
import { LeadFormField } from '../shared/models/lead-form-public-data.interface';
import { PublicFeedbackService } from '../shared/services/public-feedback.service';
import { PublicFormService } from '../shared/services/public-form.service';

interface FeedbackSection {
  category: FeedbackQuestionCategory;
  title: string;
  subtitle?: string;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  public readonly configService: ConfigService = inject(ConfigService);
  private readonly publicFormService = inject(PublicFormService);
  private readonly publicFeedbackService = inject(PublicFeedbackService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public readonly configData: WritableSignal<AppConfigData | null> =
    signal<AppConfigData | null>(null);
  public readonly brandStyles: WritableSignal<BrandStyles | null> =
    signal(null);
  public readonly showLoader: WritableSignal<boolean> = signal(true);
  public readonly loaderIsExiting: WritableSignal<boolean> = signal(false);
  public readonly isSubmitting: WritableSignal<boolean> = signal(false);
  public readonly isExiting: WritableSignal<boolean> = signal(false);
  public readonly submissionError: WritableSignal<boolean> = signal(false);
  public feedbackForm = new FormRecord<FormControl<string | null>>({});
  public readonly feedbackSections: FeedbackSection[] = [
    { category: 'BUYER_PROFILE', title: 'About You' },
    {
      category: 'PROPERTY_FEEDBACK',
      title: 'Rate This Property',
      subtitle: 'Tap an option for each category.',
    },
    { category: 'BUYING_READINESS', title: 'Quick Questions' },
  ];

  readonly paramSlug: string | null =
    this.activatedRoute.snapshot.paramMap.get('slug');
  readonly paramPublicCode: string | null =
    this.activatedRoute.snapshot.paramMap.get('publicCode');

  async ngOnInit(): Promise<void> {
    if (this.paramSlug && this.paramPublicCode) {
      const config: AppConfigData = await this.configService.getConfiguration(
        this.paramSlug,
        this.paramPublicCode,
      );
      this.brandStyles.set(this.configService.getBrandStyles(config.branding));
      this.feedbackForm = this.publicFormService.buildForm(
        config.leadForm.fields,
        config.feedbackForm.questions,
      );
      this.configData.set(config);
      await this.waitForLoadingReveal();
      this.dismissLoader();
    }
  }

  private dismissLoader(): void {
    this.loaderIsExiting.set(true);
    window.setTimeout(() => this.showLoader.set(false), 240);
  }

  private async waitForLoadingReveal(): Promise<void> {
    const isLocalDevelopment =
      window.location.port === '4200' ||
      ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);

    if (!isLocalDevelopment || environment.loadingAnimationDelayMs === 0) {
      return;
    }

    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, environment.loadingAnimationDelayMs);
    });
  }

  public async submitFeedback(): Promise<void> {
    this.submissionError.set(false);

    if (this.feedbackForm.invalid) {
      this.feedbackForm.markAllAsTouched();
      return;
    }

    const config = this.configData();

    if (!config || !this.paramSlug || !this.paramPublicCode) {
      return;
    }

    this.isSubmitting.set(true);

    try {
      const submission = await this.publicFeedbackService.submit(
        this.paramSlug,
        this.paramPublicCode,
        config,
        this.feedbackForm.getRawValue(),
      );
      this.feedbackForm.reset();
      this.isExiting.set(true);
      await new Promise<void>((resolve) => window.setTimeout(resolve, 240));
      await this.router.navigate(
        [this.paramSlug, 'open-house', this.paramPublicCode, 'thank-you'],
        {
          state: { leadCreated: submission.leadCreated },
        },
      );
    } catch (error) {
      console.error('Error submitting public feedback:', error);
      this.submissionError.set(true);
    } finally {
      this.isSubmitting.set(false);
    }
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

  public getQuestionsByCategory(
    category: FeedbackQuestionCategory,
  ): FeedbackQuestion[] {
    return (
      this.configData()
        ?.feedbackForm.questions.filter(
          (question) => question.category === category,
        )
        .sort(
          (firstQuestion, secondQuestion) =>
            firstQuestion.sortOrder - secondQuestion.sortOrder,
        ) ?? []
    );
  }

  public getLeadFields(): LeadFormField[] {
    return this.configData()?.leadForm.fields ?? [];
  }
}
