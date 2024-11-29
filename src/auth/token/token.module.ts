import { ITokenCacheRepository } from '@core/redis/abstracts/token-cache-repository.abstract';
import { TokenCacheRepositoryImpl } from '@core/redis/repositories/token-cache-repository.impl';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtModuleOptionsFactory } from '@token/factories/jwt-module-options.factory';
import { TokenService } from '@token/services/token.service';

@Module({
  imports: [RedisModule, JwtModule.registerAsync({ useClass: JwtModuleOptionsFactory })],
  providers: [
    TokenService,
    {
      provide: ITokenCacheRepository,
      useClass: TokenCacheRepositoryImpl,
    },
  ],
  exports: [TokenService],
})
export class TokenModule {}
