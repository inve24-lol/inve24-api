import { registerAs } from '@nestjs/config';
import { REDIS_CONFIG_TOKEN } from '@core/config/constants/config.token';

export default registerAs(REDIS_CONFIG_TOKEN, () => ({
  redis: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT!,
    password: process.env.REDIS_PASSWORD,
    emailCertCode: {
      ttl: +process.env.REDIS_EMAIL_CERT_CODE_TTL!,
      db: +process.env.REDIS_EMAIL_CERT_CODE_DB!,
    },
    refreshToken: {
      ttl: +process.env.REDIS_REFRESH_TOKEN_TTL!,
      db: +process.env.REDIS_REFRESH_TOKEN_DB!,
    },
    summoner: {
      ttl: +process.env.REDIS_SUMMONER_TTL!,
      db: +process.env.REDIS_SUMMONER_DB!,
    },
  },
}));
