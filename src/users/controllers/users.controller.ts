import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignUpRequestDto } from '@users/dto/requests/sign-up-request.dto';
import { SignUpResponseDto } from '@users/dto/responses/sign-up-response.dto';
import { UsersService } from '@users/services/users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Sign-up user' })
  @ApiCreatedResponse({ type: SignUpResponseDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('v1/signup')
  async signUp(@Body() signUpRequest: SignUpRequestDto): Promise<SignUpResponseDto> {
    return await this.usersService.signUpUser(signUpRequest);
  }
}
