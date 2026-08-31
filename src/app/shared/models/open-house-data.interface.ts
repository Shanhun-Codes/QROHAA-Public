export interface OpenHousePublicData {
  id: string;
  agentId: string;
  propertyId: string;
  publicCode: string;
  startDate: string | Date;
  endDate: string | Date;
  active: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: unknown;
}
