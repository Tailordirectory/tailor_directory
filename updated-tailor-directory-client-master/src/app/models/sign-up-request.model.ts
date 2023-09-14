import {PhoneModel} from './business.model';

export interface SignUpBusinessRequestModel {
  email: string;
  password: string;
  phone?: PhoneModel;
  companyName: string;
  firstName: string;
  lastName: string;
  businessName: string;
  businessTypeId: string;
  address: string;
  city: string;
  country: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  zipCode: string;
}

export interface SignUpClientRequestModel {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userName: string;
}

