import { ITokenCacheRepository } from '@redis/abstracts/token-cache-repository.abstract';
import { TokenCacheRepositoryImpl } from '@redis/repositories/token-cache-repository.impl';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtModuleOptionsFactory } from '@token/factories/jwt-module-options.factory';
import { TokenService } from '@token/services/token.service';

@Module({
  imports: [JwtModule.registerAsync({ useClass: JwtModuleOptionsFactory })],
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
