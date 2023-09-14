export interface BusinessModel {
  _id: string;
  name: string;
  rating: number;
  location: {
    lat: number,
    long: number
  };
  businessArea: ClientBusinessArea[];
}

export interface ClientBusinessArea {
  address: {
    country: string;
    city: string;
    street: string
    zip: string;
  };
}
