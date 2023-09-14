export interface businessFilterModel {
  businessName?: string;
  'businessTypeId.name'?: string;
  country?: string;
  ownerFName?: string;
  ownerLName?: string;
  createdBy?: string;
  zip?: number;
  date?: {
    createdFrom: Date,
    createdTo: Date
  };
}
