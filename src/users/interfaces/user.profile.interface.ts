import { Role } from '@common/constants/roles.enum';

export interface IUserProfile {
  uuid: string;

  email: string;

  nickname: string;

  role: Role;
}
