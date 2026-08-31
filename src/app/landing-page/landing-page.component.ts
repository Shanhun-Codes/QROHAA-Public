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
import { ConfigService } from '../shared/services/config.service';
import { AppConfigData } from '../shared/models/app-config-data.interface';
import {
  FeedbackQuestion,
  FeedbackQuestionCategory,
} from '../shared/models/feedback-form-public-data.interface';

interface BrandStyles {
  '--brand-primary': string;
  '--brand-primary-text': string;
  '--brand-secondary': string;
  '--brand-secondary-text': string;
  '--brand-accent': string;
  '--brand-accent-text': string;
}

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
  public readonly brandStyles: WritableSignal<BrandStyles> = signal(
    this.createBrandStyles('#1E3A5F', '#4F6F8F', '#D4A853'),
  );
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
      this.configData.set(config);
        this.brandStyles.set(
          this.createBrandStyles(
            config.branding.primaryColor,
            config.branding.secondaryColor,
            config.branding.accentColor,
          ),
        );
        this.createFeedbackForm(config.feedbackForm.questions);
    }
  }

    public submitFeedback(): void {
      if (this.feedbackForm.invalid) {
        this.feedbackForm.markAllAsTouched();
        return;
      }

      // Submission behavior will be implemented once its destination is defined.
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

    private createBrandStyles(
      primaryColor: string,
      secondaryColor: string,
      accentColor: string,
    ): BrandStyles {
      const primary = this.normalizeHexColor(primaryColor, '#1E3A5F');
      const secondary = this.normalizeHexColor(secondaryColor, '#4F6F8F');
      const accent = this.normalizeHexColor(accentColor, '#D4A853');

      return {
        '--brand-primary': primary,
        '--brand-primary-text': this.getContrastingTextColor(primary),
        '--brand-secondary': secondary,
        '--brand-secondary-text': this.getContrastingTextColor(secondary),
        '--brand-accent': accent,
        '--brand-accent-text': this.getContrastingTextColor(accent),
      };
    }

    private normalizeHexColor(color: string, fallback: string): string {
      return /^#[0-9a-fA-F]{6}$/.test(color) ? color : fallback;
    }

    private getContrastingTextColor(backgroundColor: string): '#FFFFFF' | '#111111' {
      const red = Number.parseInt(backgroundColor.slice(1, 3), 16);
      const green = Number.parseInt(backgroundColor.slice(3, 5), 16);
      const blue = Number.parseInt(backgroundColor.slice(5, 7), 16);
      const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

      return luminance > 0.55 ? '#111111' : '#FFFFFF';
    }
}
