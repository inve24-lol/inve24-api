import { registerAs } from '@nestjs/config';
import { MAIL_CONFIG_TOKEN } from '@core/config/constants/config.token';

export default registerAs(MAIL_CONFIG_TOKEN, () => ({
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
  },
}));
