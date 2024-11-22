import { DeleteResult } from 'typeorm';
import { TokenEntity } from '@core/type-orm/entities/token.entity';

export abstract class ITokenRepository {
  abstract upsertToken(userId: string, refreshToken: string): Promise<void>;
  abstract findTokenByUserId(userId: string): Promise<TokenEntity | null>;
  abstract deleteToken(userId: string): Promise<DeleteResult>;
}
