import { Module } from '@nestjs/common';
import { AuthController } from '@auth/controllers/auth.controller';
import { AuthService } from '@auth/services/auth.service';
import { JwtAccessTokenStrategy } from '@auth/strategies/jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from '@auth/strategies/jwt-refresh-token.strategy';
import { UsersModule } from '@users/users.module';
import { TokenModule } from '@token/token.module';

@Module({
  imports: [UsersModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessTokenStrategy, JwtRefreshTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
