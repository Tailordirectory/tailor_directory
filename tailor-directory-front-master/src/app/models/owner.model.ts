export interface OwnerModel {
  firstName: string;
  lastName: string;
  companyName: string;
  groupName: string;
  email: string;
  _id: string;
  role: 'business';
  password: string;
  business: string[];
  createdAt: Date;
  updatedAt: Date;
  profileType: string;
}
