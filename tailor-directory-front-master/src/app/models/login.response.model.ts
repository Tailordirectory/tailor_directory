export interface LoginResponseModel {
  token: string;
  refreshToken: string;
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  companyName: string;
  groupName: string;
  profileType: string;
  role: 'user' | 'business';
}
