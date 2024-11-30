import { registerAs } from '@nestjs/config';
import { SERVER_CONFIG_TOKEN } from '@config/constants/config.token';

export default registerAs(SERVER_CONFIG_TOKEN, () => ({
  server: {
    nodeEnv: process.env.NODE_ENV,
    port: +process.env.SERVER_PORT!,
    host: process.env.SERVER_HOST,
    cookieMaxAge: +process.env.REDIS_REFRESH_TOKEN_TTL! * 1000,
  },
}));
