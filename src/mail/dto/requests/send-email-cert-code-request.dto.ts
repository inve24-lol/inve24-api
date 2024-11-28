import { ApiProperty } from '@nestjs/swagger';
import { USER_EMAIL_LENGTH } from '@users/constants/user.constant';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class SendEmailCertCodeRequestDto {
  @ApiProperty({
    description: '유저 이메일',
    example: 'example@eamil.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @Length(USER_EMAIL_LENGTH.MIN, USER_EMAIL_LENGTH.MAX)
  readonly email!: string;
}
