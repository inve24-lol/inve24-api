import { ITokenRepository } from '@core/type-orm/abstracts/token-repository.abstract';
import { TokenRepositoryImpl } from '@core/type-orm/repositories/token.repository';
import { TypeOrmExModule } from '@core/type-orm/type-orm-ex.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtModuleOptionsFactory } from '@token/jwt/factories/jwt-module-options.factory';
import { TokenService } from '@token/services/token.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      { repoInterface: ITokenRepository, repository: TokenRepositoryImpl },
    ]),
    JwtModule.registerAsync({ useClass: JwtModuleOptionsFactory }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
