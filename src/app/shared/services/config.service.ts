import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.local';
import { AgentPublicData } from '../models/agent-public-data.interface';
import { AppConfigData } from '../models/app-config-data.interface';
import { OpenHousePublicData } from '../models/open-house-data.interface';
import { PropertyPublicData } from '../models/property-data.interface';

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
}
