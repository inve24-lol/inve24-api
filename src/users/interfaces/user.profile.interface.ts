import { Role } from '@common/constants/roles.enum';

export interface IUserProfile {
  email: string;

  nickname: string;

  role: Role;
}
