import {TagsModel} from './tags.model';
import {PhoneModel} from './business.model';

export interface UpdateBusinessRequestModel {
  _id?: string;
  address: string;
  businessName?: string;
  businessTypeId?: string;
  city: string;
  country: string;
  email?: string;
  website?: string;
  contactPhone?: PhoneModel;
  contactName?: string;
  phones?: PhoneModel[];
  location?: { coordinates: [number, number] };
  media?: string[];
  tags?: TagsModel[];
  workTime?: { start: { h: number, m: number } | null, end: { h: number, m: number } | null };
  zipCode?: string;
  description?: string;
  establishedSince?: string;
  numberOfTailors?: string;
  speciality?: string;
  typeOfProducts?: string;
  facebookProfile?: string;
  instagramProfile?: string;
  linkedInProfile?: string;
}
