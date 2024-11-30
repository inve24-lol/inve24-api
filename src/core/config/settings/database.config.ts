import { registerAs } from '@nestjs/config';
import { DATABASE_CONFIG_TOKEN } from '@config/constants/config.token';

export default registerAs(DATABASE_CONFIG_TOKEN, () => ({
  mysql: {
    host: process.env.MYSQL_HOST,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: +process.env.MYSQL_TCP_PORT!,
    timezone: process.env.MYSQL_TIME_ZONE,
  },
}));
