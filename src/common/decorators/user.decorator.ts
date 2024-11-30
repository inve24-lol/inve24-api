import { PayloadDto } from '@common/dto/payload.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((data: keyof PayloadDto, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return request.user[data] || request.user;
});
