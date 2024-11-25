import { DeleteResult } from 'typeorm';
import { TokenEntity } from '@core/type-orm/entities/token.entity';

export abstract class ITokenRepository {
  abstract upsertToken(userUuid: string, refreshToken: string): Promise<void>;
  abstract findTokenByUserUuid(userUuid: string): Promise<TokenEntity | null>;
  abstract deleteToken(userUuid: string): Promise<DeleteResult>;
}
