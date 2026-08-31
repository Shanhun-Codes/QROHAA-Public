export interface PropertyPublicData {
  id: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  description?: string;
  imageUrls?: string[];
  [key: string]: unknown;
}
