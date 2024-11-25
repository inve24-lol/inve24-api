import { CustomRepository } from '@core/type-orm/decorators/custom-repository.decorator';
import { TokenEntity } from '@core/type-orm/entities/token.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { ITokenRepository } from '@core/type-orm/abstracts/token-repository.abstract';

@CustomRepository(TokenEntity)
export class TokenRepositoryImpl extends Repository<TokenEntity> implements ITokenRepository {
  async upsertToken(userUuid: string, refreshToken: string): Promise<void> {
    try {
      await this.upsert(
        {
          userUuid,
          refreshToken,
        },
        ['userUuid'],
      );
    } catch (error) {
      throw new InternalServerErrorException('Query failed.');
    }
  }

  async findTokenByUserId(userUuid: string): Promise<TokenEntity | null> {
    try {
      const tokenEntity = await this.findOne({ where: { userUuid } });

      return tokenEntity || null;
    } catch (error) {
      throw new InternalServerErrorException('Query failed.');
    }
  }

  async deleteToken(userUuid: string): Promise<DeleteResult> {
    try {
      return await this.delete({ userUuid });
    } catch (error) {
      throw new InternalServerErrorException('Query failed.');
    }
  }
}
