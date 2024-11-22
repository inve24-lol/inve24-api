import { registerAs } from '@nestjs/config';
import { SERVER_CONFIG_TOKEN } from '@core/config/constants/config.token';

export default registerAs(SERVER_CONFIG_TOKEN, () => ({
  node: { env: process.env.NODE_ENV },
  server: {
    port: +process.env.SERVER_PORT!,
    refreshTokenCookieMaxAge: +process.env.SERVER_REFRESH_TOKEN_COOKIE_MAX_AGE!,
  },
}));
