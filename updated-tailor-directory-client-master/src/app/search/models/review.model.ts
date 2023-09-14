export interface ReviewModel {
  _id: string;
  businessId: string;
  comment: string;
  createdAt: Date;
  stars: number;
  userId: ReviewUserModel;
}

export interface ReviewUserModel {
  firstName: string;
  lastName: string;
  userName: string;
  _id: string;
}
