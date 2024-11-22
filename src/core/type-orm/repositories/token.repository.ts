import { CustomRepository } from '@core/type-orm/decorators/custom-repository.decorator';
import { TokenEntity } from '@core/type-orm/entities/token.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';

@CustomRepository(TokenEntity)
export class TokenRepository extends Repository<TokenEntity> {
  async upsertToken(userId: string, refreshToken: string): Promise<void> {
    try {
      await this.upsert(
        {
          userId,
          refreshToken,
        },
        ['userId'],
      );
    } catch (error) {
      throw new InternalServerErrorException('Query failed.');
    }
  }

  async findTokenByUserId(userId: string): Promise<TokenEntity | null> {
    try {
      const tokenEntity = await this.findOne({ where: { userId } });

      return tokenEntity || null;
    } catch (error) {
      throw new InternalServerErrorException('Query failed.');
    }
  }

  async deleteToken(userId: string): Promise<DeleteResult> {
    try {
      return await this.delete({ userId });
    } catch (error) {
      throw new InternalServerErrorException('Query failed.');
    }
  }
}
