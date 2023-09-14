import {TagsModel} from './tags.model';

export interface TagsResponseModel {
  docs: TagsModel[];
  limit: number;
  offset: number;
  total: number;
}
