import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.local';
import { AgentPublicData } from '../models/agent-public-data.interface';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  public agentPublicData = signal<AgentPublicData | null>(null);
  public slug = signal<string | null>(null);

  getAgentInfo(slug: string) {
    this.http
      .get<AgentPublicData>(`${this.baseUrl}/public/agents/${slug}`)
      .subscribe({
        next: (response) => {
          this.agentPublicData.set(response);
          console.log('Stored Agent Public Data:', response);
        },
        error: (err) => {
          console.error('Error fetching agent public data:', err);
        },
      });
  }
}
