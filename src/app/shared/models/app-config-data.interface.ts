import { AgentPublicData } from './agent-public-data.interface';
import { BrandingPublicData } from './branding-public-data.interface';
import { FeedbackFormPublicData } from './feedback-form-public-data.interface';
import { OpenHousePublicData } from './open-house-data.interface';
import { PropertyPublicData } from './property-data.interface';

export interface AppConfigData {
  agent: AgentPublicData;
  branding: BrandingPublicData;
  openHouse: OpenHousePublicData;
  property: PropertyPublicData;
  feedbackForm: FeedbackFormPublicData;
}

