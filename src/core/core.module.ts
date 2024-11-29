import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TypeOrmModuleOptionsFactory } from '@core/type-orm/factories/type-orm-module-options.factory';
import { RedisModuleOptionsFactory } from '@core/redis/factories/redis-module-options.factory';
import { WebClientModule } from '@core/web-client/web-client.module';
import { ConfigExModule } from './config/config-ex-module';

@Module({
  imports: [
    ConfigExModule,
    WebClientModule,
    TypeOrmModule.forRootAsync({ useClass: TypeOrmModuleOptionsFactory }),
    RedisModule.forRootAsync({ useClass: RedisModuleOptionsFactory }),
  ],
})
export class CoreModule {}
