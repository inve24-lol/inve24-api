import { DynamicModule, Provider } from '@nestjs/common';
import { TYPE_ORM_EX_CUSTOM_REPOSITORY } from '@core/type-orm/constants/type-orm.token';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class TypeOrmExModule {
  public static forCustomRepository<
    T extends { repoInterface: any; repository: new (...args: any[]) => any },
  >(repositories: T[]): DynamicModule {
    const providers: Provider[] = [];

    for (const { repoInterface, repository } of repositories) {
      const entity = Reflect.getMetadata(TYPE_ORM_EX_CUSTOM_REPOSITORY, repository);

      if (!entity) continue;

      providers.push({
        inject: [getDataSourceToken()],
        provide: repository,
        useFactory: (dataSource: DataSource): typeof repository => {
          const baseRepository = dataSource.getRepository<any>(entity);
          return new repository(
            baseRepository.target,
            baseRepository.manager,
            baseRepository.queryRunner,
          );
        },
      });

      providers.push({
        provide: repoInterface,
        useClass: repository,
      });
    }

    return { exports: providers, module: TypeOrmExModule, providers };
  }
}
