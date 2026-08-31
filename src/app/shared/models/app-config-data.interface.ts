import { AgentPublicData } from './agent-public-data.interface';
import { OpenHousePublicData } from './open-house-data.interface';
import { PropertyPublicData } from './property-data.interface';

export interface AppConfigData {
  agentData: AgentPublicData | null;
  propertyData: PropertyPublicData | null;
  openHouseData: OpenHousePublicData | null;
}

