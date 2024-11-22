import { Role } from '@common/constants/roles.enum';

export interface IPayload {
  id: string;

  nickname: string;

  role: Role;
}
