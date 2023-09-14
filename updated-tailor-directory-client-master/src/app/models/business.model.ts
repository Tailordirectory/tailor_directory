import {TagsModel} from './tags.model';
import {BusinessTypesModel} from './business-types.model';

export interface MediaModel {
  _id: string;
  url: string;
  type: string;
}

export interface PhoneModel {
  phone: string;
  countryCode: string;
  countryIsoCode: string;
}

export interface AccountRestrictions {
  picture_gallery?: boolean;
  full_profile_page?: boolean;
  social_media_links?: boolean;
  reviews_comments?: boolean;
  is_highlighted?: boolean;
  is_on_top?: boolean;
  opening_hours?: boolean;
  contact_information?: boolean;
  get_directions?: boolean;
  service_offering?: boolean;
  multiple_stores?: boolean;
}

export interface BusinessModel {
  _id: string;
  address: string;
  groupName?: string;
  businessName: string;
  businessType: string;
  businessTypeId: BusinessTypesModel;
  city: string;
  country: string;
  createdAt?: Date;
  email: string;
  website: string;
  phones: PhoneModel[];
  contactName: string;
  contactPhone: PhoneModel;
  emailVerifiedAt?: Date;
  location: { coordinates: [number, number] };
  media: MediaModel[];
  icon: string;
  ownerId?: {
    _id: string;
    profileType: string;
  };
  phoneConfirmedAt?: Date;
  rating?: number;
  reviewsCount?: number;
  tags: TagsModel[];
  updatedAt?: Date;
  workTime: { start: { h: number, m: number }, end: { h: number, m: number } };
  zipCode: string;
  description: string;
  establishedSince: string;
  numberOfBusiness: string;
  speciality: string;
  typeOfProducts: string;
  facebookProfile: string;
  instagramProfile: string;
  linkedInProfile: string;
  restrictions: AccountRestrictions;
}
