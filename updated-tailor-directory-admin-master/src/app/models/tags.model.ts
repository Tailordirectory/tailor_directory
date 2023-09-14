export interface TagsModel {
  _id: string;
  createdAt: Date;
  name: string;
}

export interface TagsResponseModel {
  docs: TagsModel[];
  total: number;
  limit: number;
  offset: number;
}

export interface TagsFilterModel {
  name?: string;
  date?: {
    createdFrom: Date;
    createdTo: Date;
  }
}
