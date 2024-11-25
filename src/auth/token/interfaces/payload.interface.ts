import { Role } from '@common/constants/roles.enum';

export interface IPayload {
  uuid: string;

  nickname: string;

  role: Role;
}
