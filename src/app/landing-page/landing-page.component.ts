import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../shared/services/config.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  public configService = inject(ConfigService);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly paramSlug = this.activatedRoute.snapshot.paramMap.get('slug');
  readonly paramPublicCode =
    this.activatedRoute.snapshot.paramMap.get('publicCode');

  async ngOnInit() {
    if (this.paramSlug && this.paramPublicCode) {
      const config = await this.configService.buildConfigurationObject(
        this.paramSlug,
        this.paramPublicCode,
      );
      console.log('Configuration Object Built:', config);
    }
  }
}
