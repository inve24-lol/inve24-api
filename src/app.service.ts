import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'RSO 로그인 리다이렉트 페이지 입니다.';
  }
}
