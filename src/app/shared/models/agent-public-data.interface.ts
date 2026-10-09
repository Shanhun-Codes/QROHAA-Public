export interface AgentPublicData {
  slug: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  realEstateLicenseNumber: string | null;
  brokerage: BrokeragePublicData | null;
  headline: string;
  logoUrl: string | null;
  headshotUrl: string | null;
}

export interface BrokeragePublicData {
  name: string;
  licenseNumber: string | null;
  street: string | null;
  street2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
}
