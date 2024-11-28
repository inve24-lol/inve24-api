import { ApiProperty } from '@nestjs/swagger';
import { USER_EMAIL_LENGTH, USER_PASSWORD_REGEXP } from '@users/constants/user.constant';
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class SignInRequestDto {
  @ApiProperty({
    description: '유저 이메일',
    example: 'example@eamil.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @Length(USER_EMAIL_LENGTH.MIN, USER_EMAIL_LENGTH.MAX)
  readonly email!: string;

  @ApiProperty({
    description: '유저 비밀번호',
    example: 'P@ssw0rd4321',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(USER_PASSWORD_REGEXP)
  readonly password!: string;
}
