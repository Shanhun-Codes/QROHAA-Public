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

  ngOnInit() {
    this.configService.slug.set(this.paramSlug);
    console.log('Param Slug:', this.configService.slug());
    this.configService.getAgentInfo(this.paramSlug!);
  }
}
