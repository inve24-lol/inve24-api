import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PayloadDto } from '@token/dtos/payload.dto';

export const User = createParamDecorator((data: keyof PayloadDto, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return request.user[data] || request.user;
});
