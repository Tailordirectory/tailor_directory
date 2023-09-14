export interface ReviewModel {
  _id: string;
  businessId: {
    _id: string;
    businessName: string;
  }
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  }
  stars: number;
  comment: string;
  createdAt: Date;
}

export interface ReviewsResponseModel {
  docs: ReviewModel[],
  limit: number;
  offset: number;
  total: number;

}

export interface ReviewsRequestModel {
  businessName?: string;
  firstName?: string;
  lastName?: string;
  date?: {
    createdFrom: Date;
    createdTo: Date;
  }

}
