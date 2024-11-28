import { UserEntity } from '@core/type-orm/entities/user.entity';

export abstract class IUserRepository {
  abstract saveUser(createUser: Partial<UserEntity>): Promise<UserEntity>;
  abstract findUserByEmail(email: string): Promise<UserEntity | null>;
  abstract findUserByNickname(nickname: string): Promise<UserEntity | null>;
  abstract findUserByUuid(uuid: string): Promise<UserEntity | null>;
}
