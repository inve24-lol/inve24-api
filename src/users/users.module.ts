import { UserRepository } from '@core/type-orm/repositories/user.repository';
import { TypeOrmExModule } from '@core/type-orm/type-orm-ex.module';
import { Module } from '@nestjs/common';
import { UsersController } from '@users/controllers/users.controller';
import { UsersService } from '@users/services/users.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserRepository])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
