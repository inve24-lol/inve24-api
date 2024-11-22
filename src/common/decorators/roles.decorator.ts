import { Role } from '@common/constants/roles.enum';
import { ROLES_KEY } from '@common/constants/roles.key';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
