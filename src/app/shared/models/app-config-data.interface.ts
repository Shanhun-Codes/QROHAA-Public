import { AgentPublicData } from './agent-public-data.interface';

export interface AppConfigData {
  agentData: AgentPublicData | null;
  propertyData: any | null;
  openHouseData: any | null;
}
