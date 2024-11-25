import { DeepPartial } from 'typeorm';
import { UserEntity } from '@core/type-orm/entities/user.entity';

export abstract class IUserRepository {
  abstract saveUser(createUser: DeepPartial<UserEntity>): Promise<UserEntity>;
  abstract findUserByEmail(email: string): Promise<UserEntity | null>;
  abstract findUserByNickname(nickname: string): Promise<UserEntity | null>;
  abstract findUserByUuId(uuid: string): Promise<UserEntity | null>;
}
