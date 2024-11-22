import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

config({ path: `.env.${process.env.NODE_ENV}` });

const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.get('MYSQL_HOST'),
  port: configService.get<number>('MYSQL_TCP_PORT'),
  username: configService.get('MYSQL_USER'),
  password: configService.get('MYSQL_PASSWORD'),
  database: configService.get('MYSQL_DATABASE'),
  entities: ['src/**/entities/*{.ts, .js}'],
  migrations: ['migrations/**/[0-9]*.ts'],
  migrationsTableName: 'migrations',
});
