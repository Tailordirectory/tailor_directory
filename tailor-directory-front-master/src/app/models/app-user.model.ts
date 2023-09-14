type userType = 'user' | 'business';

export interface AppUserModel {
  name: string;
  id: string;
  profileType?: string;
  type: userType;
}
