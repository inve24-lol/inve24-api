import { SetMetadata } from '@nestjs/common';
import { TYPE_ORM_EX_CUSTOM_REPOSITORY } from '@core/type-orm/constants/type-orm.token';

export const CustomRepository = (entity: Function): ClassDecorator => {
  return SetMetadata(TYPE_ORM_EX_CUSTOM_REPOSITORY, entity);
};
