import { registerAs } from '@nestjs/config';
import { REDIS_CONFIG_TOKEN } from '@core/config/constants/config.token';

export default registerAs(REDIS_CONFIG_TOKEN, () => ({
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    emailCode: process.env.REDIS_EMAIL_CODE_TTL,
  },
}));
