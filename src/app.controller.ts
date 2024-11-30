import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from '@src/app.service';

@ApiTags('클라이언트')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'RSO 로그인 리다이렉트 페이지' })
  @Get('summoners')
  getHello(): string {
    return this.appService.getHello();
  }
}
