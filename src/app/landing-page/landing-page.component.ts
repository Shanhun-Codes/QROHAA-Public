import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../shared/services/config.service';
import { AppConfigData } from '../shared/models/app-config-data.interface';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  public readonly configService: ConfigService = inject(ConfigService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public readonly configData: WritableSignal<AppConfigData | null> =
    signal<AppConfigData | null>(null);

  readonly paramSlug: string | null =
    this.activatedRoute.snapshot.paramMap.get('slug');
  readonly paramPublicCode: string | null =
    this.activatedRoute.snapshot.paramMap.get('publicCode');

  async ngOnInit(): Promise<void> {
    if (this.paramSlug && this.paramPublicCode) {
      const config: AppConfigData =
        await this.configService.buildConfigurationObject(
          this.paramSlug,
          this.paramPublicCode,
        );
      this.configData.set(config);
      console.log('Configuration Object Built:', config);
    }
  }
}
