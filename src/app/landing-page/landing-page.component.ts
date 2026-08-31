import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormControl,
  FormRecord,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BrandStyles, ConfigService } from '../shared/services/config.service';
import { AppConfigData } from '../shared/models/app-config-data.interface';
import {
  FeedbackQuestion,
  FeedbackQuestionCategory,
} from '../shared/models/feedback-form-public-data.interface';

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
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public readonly configData: WritableSignal<AppConfigData | null> =
    signal<AppConfigData | null>(null);
  public readonly brandStyles: WritableSignal<BrandStyles | null> = signal(null);
  public readonly feedbackForm = new FormRecord<FormControl<string | null>>({});
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
      const config: AppConfigData =
        await this.configService.getConfiguration(
          this.paramSlug,
          this.paramPublicCode,
        );
      this.brandStyles.set(this.configService.getBrandStyles(config.branding));
      this.createFeedbackForm(config.feedbackForm.questions);
      this.configData.set(config);
    }
  }

    public submitFeedback(): void {
      if (this.feedbackForm.invalid) {
        this.feedbackForm.markAllAsTouched();
        return;
      }

      // Submission behavior will be implemented once its destination is defined.
    }

    public formatPhoneNumber(phoneNumber: string): string {
      const digits = phoneNumber.replace(/\D/g, '');
      const tenDigitNumber = digits.length === 11 && digits.startsWith('1')
        ? digits.slice(1)
        : digits;

      if (tenDigitNumber.length !== 10) {
        return phoneNumber;
      }

      return `(${tenDigitNumber.slice(0, 3)}) ${tenDigitNumber.slice(3, 6)}-${tenDigitNumber.slice(6)}`;
    }

    public getQuestionsByCategory(
      category: FeedbackQuestionCategory,
    ): FeedbackQuestion[] {
      return (
        this.configData()?.feedbackForm.questions
          .filter((question) => question.category === category)
          .sort(
            (firstQuestion, secondQuestion) =>
              firstQuestion.sortOrder - secondQuestion.sortOrder,
          ) ?? []
      );
    }

    private createFeedbackForm(questions: FeedbackQuestion[]): void {
      for (const question of questions) {
        this.feedbackForm.addControl(
          question.key,
          new FormControl<string | null>(
            null,
            question.required ? Validators.required : [],
          ),
        );
      }
    }

}
