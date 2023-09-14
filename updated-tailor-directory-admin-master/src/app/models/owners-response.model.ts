import {OwnerModel} from "./owner.model";

export interface OwnersResponseModel {
  docs: OwnerModel[];
  limit: number;
  offset: number;
  total: number;
}

export interface OwnersFilterModel {
  firstName?: string;
  lastName?: string;
  email?: string;
  profileType?: string;
  date?: {
    createdFrom: Date;
      createdTo: Date;
  }
}
