import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConfigData } from '../shared/models/app-config-data.interface';
import { BrandStyles, ConfigService } from '../shared/services/config.service';

@Component({
  selector: 'app-thank-you-page',
  standalone: true,
  imports: [],
  templateUrl: './thank-you-page.component.html',
  styleUrl: './thank-you-page.component.scss',
})
export class ThankYouPageComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly configService = inject(ConfigService);

  public readonly configData: WritableSignal<AppConfigData | null> =
    signal(null);
  public readonly brandStyles: WritableSignal<BrandStyles | null> =
    signal(null);
  public readonly leadCreated: boolean = Boolean(history.state.leadCreated);

  async ngOnInit(): Promise<void> {
    const slug = this.activatedRoute.snapshot.paramMap.get('slug');
    const publicCode = this.activatedRoute.snapshot.paramMap.get('publicCode');

    if (!slug || !publicCode) {
      return;
    }

    const config = await this.configService.getConfiguration(slug, publicCode);
    this.brandStyles.set(this.configService.getBrandStyles(config.branding));
    this.configData.set(config);
  }
}
