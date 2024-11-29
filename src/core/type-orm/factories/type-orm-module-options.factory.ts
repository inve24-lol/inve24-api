import databaseConfig from '@core/config/settings/database.config';
import serverConfig from '@core/config/settings/server.config';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmModuleOptionsFactory implements TypeOrmOptionsFactory {
  constructor(
    @Inject(databaseConfig.KEY) private readonly dbConfig: ConfigType<typeof databaseConfig>,
    @Inject(serverConfig.KEY) private readonly srvConfig: ConfigType<typeof serverConfig>,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.dbConfig.mysql.host,
      port: this.dbConfig.mysql.port,
      username: this.dbConfig.mysql.username,
      password: this.dbConfig.mysql.password,
      database: this.dbConfig.mysql.database,
      timezone: this.dbConfig.mysql.timezone,
      entities: ['dist/**/entities/*{.ts,.js}'],
      logging: this.srvConfig.server.nodeEnv !== 'prod',
    };
  }
}
