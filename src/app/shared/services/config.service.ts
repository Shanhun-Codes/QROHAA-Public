import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.local';
import { AgentPublicData } from '../models/agent-public-data.interface';
import { AppConfigData } from '../models/app-config-data.interface';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly propertyId = signal<string | null>(null);

  public agentPublicData = signal<AgentPublicData | null>(null);
  public slug = signal<string | null>(null);

  public openHouseData = signal<any | null>(null);
  public publicCode = signal<string | null>(null);

  public propertyData = signal<any | null>(null);

  async buildConfigurationObject(
    slug: string,
    publicCode: string,
  ): Promise<AppConfigData> {
    this.slug.set(slug);
    this.publicCode.set(publicCode);

    const [agentData, openHouseData] = await Promise.all([
      this.getAgentData(slug),
      this.getOpenHouseData(slug, publicCode),
    ]);

    const propertyData = await this.getPropertyData(openHouseData!.propertyId);

    return {
      agentData,
      openHouseData,
      propertyData,
    };
  }

  async getAgentData(slug: string): Promise<AgentPublicData | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<AgentPublicData>(`${this.baseUrl}/public/agents/${slug}`),
      );
      this.agentPublicData.set(response);
      return response;
    } catch (err) {
      console.error('Error fetching agent public data:', err);
      return null;
    }
  }

  async getOpenHouseData(
    slug: string,
    publicCode: string,
  ): Promise<any | null> {
    try {
      const response = await firstValueFrom(
        this.http.get(
          `${this.baseUrl}/public/agents/${slug}/open-houses/${publicCode}`,
        ),
      );
      this.openHouseData.set(response);
      return response;
    } catch (err) {
      console.error('Error fetching open house data:', err);
      return null;
    }
  }

  async getPropertyData(propertyId: string): Promise<any | null> {
    try {
      const response = await firstValueFrom(
        this.http.get(`${this.baseUrl}/property/${propertyId}`),
      );
      this.propertyData.set(response);
      return response;
    } catch (err) {
      console.error('Error fetching property data:', err);
      return null;
    }
  }
}
