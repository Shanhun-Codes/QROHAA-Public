export type LeadFormFieldType = 'TEXT' | 'EMAIL' | 'TEL';

export interface LeadFormField {
  key: string;
  label: string;
  type: LeadFormFieldType;
  required: boolean;
}

export interface LeadFormPublicData {
  fields: LeadFormField[];
}
