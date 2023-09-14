export interface AddressSearchModel {
  country: string;
  city: string;
  address: string;
  distance: string;
}

export interface SearchFilterModel {
  businessType: string;
  tags: string[];
}

export interface GeocodingSearchModel {
  lat: number;
  long: number;
}
