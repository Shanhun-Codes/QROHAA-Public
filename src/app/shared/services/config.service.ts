import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.local';
import { AgentPublicData } from '../models/agent-public-data.interface';
import { AppConfigData } from '../models/app-config-data.interface';
import { BrandingPublicData } from '../models/branding-public-data.interface';
import { OpenHousePublicData } from '../models/open-house-data.interface';
import { PropertyPublicData } from '../models/property-data.interface';

export interface BrandStyles {
  '--brand-primary': string;
  '--brand-primary-text': string;
  '--brand-secondary': string;
  '--brand-secondary-text': string;
  '--brand-accent': string;
  '--brand-accent-text': string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly propertyId: WritableSignal<string | null> = signal<
    string | null
  >(null);

  public agentPublicData: WritableSignal<AgentPublicData | null> =
    signal<AgentPublicData | null>(null);
  public slug: WritableSignal<string | null> = signal<string | null>(null);

  public openHouseData: WritableSignal<OpenHousePublicData | null> =
    signal<OpenHousePublicData | null>(null);
  public publicCode: WritableSignal<string | null> = signal<string | null>(
    null,
  );

  public propertyData: WritableSignal<PropertyPublicData | null> =
    signal<PropertyPublicData | null>(null);

  async getConfiguration(
    slug: string,
    publicCode: string,
  ): Promise<AppConfigData> {
    try {
      const response = await firstValueFrom(
        this.http.get<AppConfigData>(
          `${this.baseUrl}/public/agents/${slug}/open-houses/${publicCode}/configuration`,
        ),
      );
      return response;
    } catch (err) {
      console.error('Error fetching configuration data:', err);
      throw err;
    }
  }

  public getBrandStyles(branding: BrandingPublicData): BrandStyles {
    return {
      '--brand-primary': branding.primaryColor,
      '--brand-primary-text': this.getContrastingTextColor(
        branding.primaryColor,
      ),
      '--brand-secondary': branding.secondaryColor,
      '--brand-secondary-text': this.getContrastingTextColor(
        branding.secondaryColor,
      ),
      '--brand-accent': branding.accentColor,
      '--brand-accent-text': this.getContrastingTextColor(branding.accentColor),
    };
  }

  private getContrastingTextColor(
    backgroundColor: string,
  ): '#FFFFFF' | '#111111' {
    const red = Number.parseInt(backgroundColor.slice(1, 3), 16);
    const green = Number.parseInt(backgroundColor.slice(3, 5), 16);
    const blue = Number.parseInt(backgroundColor.slice(5, 7), 16);
    const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

    return luminance > 0.55 ? '#111111' : '#FFFFFF';
  }
}
