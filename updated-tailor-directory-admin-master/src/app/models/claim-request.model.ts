export interface ClaimModel {
  _id: string
  businessId: {
    businessName: string;
    country: string;
    address: string;
    city: string;
    _id: string
  };
  createdAt: Date;
  message: string;
  historyReplies: { message: string; createdAt: Date }[]
  status: string
  updatedAt: Date;
  userId: {
    firstName: string;
    lastName: string;
    _id: string;
  }
}

export interface ClaimResponseModel {
  docs: ClaimModel[];
  limit: number;
  offset: number;
  total: number;
}

export interface ClaimRequestModel {
  businessName?: string;
  firstName?: string;
  lastName?: string;
  status?: string;
  country?: string;
  date?: {
    createdFrom: Date,
    createdTo: Date
  };
}
