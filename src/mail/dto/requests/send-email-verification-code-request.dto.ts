import { ApiProperty } from '@nestjs/swagger';
import { USER_EMAIL_LENGTH } from '@users/constants/user.constant';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class SendEmailVerificationCodeRequestDto {
  @ApiProperty({
    description: 'User Email',
    example: 'example@eamil.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @Length(USER_EMAIL_LENGTH.MIN, USER_EMAIL_LENGTH.MAX)
  readonly email!: string;
}
