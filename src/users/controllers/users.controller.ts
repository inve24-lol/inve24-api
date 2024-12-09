import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckRequestDto } from '@users/dto/requests/check-request.dto';
import { SignUpRequestDto } from '@users/dto/requests/sign-up-request.dto';
import { SignUpResponseDto } from '@users/dto/responses/sign-up-response.dto';
import { UsersService } from '@users/services/users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '회원 가입' })
  @ApiCreatedResponse({ type: SignUpResponseDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('v1/signup')
  async signUp(@Body() signUpRequest: SignUpRequestDto): Promise<SignUpResponseDto> {
    return await this.usersService.signUpUser(signUpRequest);
  }

  @ApiOperation({ summary: '계정 존재 검사' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('v1/check/:email')
  async check(@Param() checkRequest: CheckRequestDto): Promise<void> {
    await this.usersService.checkUser(checkRequest);
  }
}
