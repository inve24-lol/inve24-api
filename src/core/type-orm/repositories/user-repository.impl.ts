import { CustomRepository } from '@type-orm/decorators/custom-repository.decorator';
import { UserEntity } from '@type-orm/entities/user.entity';
import { InternalServerErrorException, Optional } from '@nestjs/common';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { IUserRepository } from '@type-orm/abstracts/user-repository.abstract';
import { InjectEntityManager } from '@nestjs/typeorm';

@CustomRepository(UserEntity)
export class UserRepositoryImpl extends Repository<UserEntity> implements IUserRepository {
  constructor(
    @InjectEntityManager() manager: EntityManager,
    @Optional() queryRunner?: QueryRunner,
  ) {
    super(UserEntity, manager, queryRunner);
  }

  async saveUser(createUser: Partial<UserEntity>): Promise<UserEntity> {
    try {
      const userEntity = await this.save(createUser);

      return userEntity;
    } catch (error) {
      throw new InternalServerErrorException('Query failed.');
    }
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    try {
      const userEntity = await this.findOne({ where: { email } });

      return userEntity || null;
    } catch (error) {
      throw new InternalServerErrorException('Query failed.');
    }
  }

  async findUserByNickname(nickname: string): Promise<UserEntity | null> {
    try {
      const userEntity = await this.findOne({ where: { nickname } });

      return userEntity || null;
    } catch (error) {
      throw new InternalServerErrorException('Query failed.');
    }
  }

  async findUserByUuid(uuid: string): Promise<UserEntity | null> {
    try {
      const userEntity = await this.findOne({ where: { uuid } });

      return userEntity || null;
    } catch (error) {
      throw new InternalServerErrorException('Query failed.');
    }
  }
}
