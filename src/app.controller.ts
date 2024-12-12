import serverConfig from '@config/settings/server.config';
import { Controller, Get, Inject, Render } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('클라이언트')
@Controller()
export class AppController {
  constructor(@Inject(serverConfig.KEY) private readonly config: ConfigType<typeof serverConfig>) {}

  @ApiOperation({ summary: '메인 페이지' })
  @Get('/')
  @Render('home')
  homePage() {
    return {
      layout: 'layouts/layout',
      title: '메인 페이지',
      vertex: 'home',
      adfit: this.config.server.client.kakaoAdfitKey,
      hostBaseUrl: this.config.server.host,
      riotSignOutUrl: this.config.server.client.riotSignOutUrl,
    };
  }

  @ApiOperation({ summary: '로그인 페이지' })
  @Get('/login')
  @Render('login')
  loginPage() {
    return {
      layout: 'layouts/layout',
      title: '로그인 페이지',
      vertex: 'login',
      adfit: this.config.server.client.kakaoAdfitKey,
      hostBaseUrl: this.config.server.host,
    };
  }

  @ApiOperation({ summary: '회원 가입 페이지' })
  @Get('/signup')
  @Render('signup')
  signupPage() {
    return {
      layout: 'layouts/layout',
      title: '회원 가입 페이지',
      vertex: 'signup',
      adfit: this.config.server.client.kakaoAdfitKey,
      hostBaseUrl: this.config.server.host,
    };
  }

  @ApiOperation({ summary: '관전 페이지' })
  @Get('/spectate')
  @Render('spectate')
  spectatePage() {
    return {
      layout: 'layouts/layout',
      title: '관전 페이지',
      vertex: 'spectate',
      adfit: this.config.server.client.kakaoAdfitKey,
      hostBaseUrl: this.config.server.host,
    };
  }
}
