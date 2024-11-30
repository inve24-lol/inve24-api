import { ITokenCacheRepository } from '@redis/abstracts/token-cache-repository.abstract';
import { TokenCacheRepositoryImpl } from '@redis/repositories/token-cache-repository.impl';
import { IUserRepository } from '@core/type-orm/abstracts/user-repository.abstract';
import { UserRepositoryImpl } from '@core/type-orm/repositories/user-repository.impl';
import { TypeOrmExModule } from '@core/type-orm/type-orm-ex.module';
import { Module } from '@nestjs/common';
import { UsersController } from '@users/controllers/users.controller';
import { UsersService } from '@users/services/users.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserRepositoryImpl])],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: IUserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: ITokenCacheRepository,
      useClass: TokenCacheRepositoryImpl,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
