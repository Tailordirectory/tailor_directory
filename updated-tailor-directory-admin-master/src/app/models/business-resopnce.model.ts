import {BusinessModel} from "./business.model";

export interface BusinessResponseModel {
  docs: BusinessModel[];
  limit: number;
  offset: number;
  total: number;
}
