import { EMAIL_VERIFICATION_CODE_REGEXP } from '@mail/constants/mail.constant';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { SendEmailVerificationCodeRequestDto } from './send-email-verification-code-request.dto';

export class verifyEmailVerificationCodeRequestDto extends SendEmailVerificationCodeRequestDto {
  @ApiProperty({
    description: 'Email Verification Code',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(EMAIL_VERIFICATION_CODE_REGEXP)
  @Transform(({ value }) => parseInt(value))
  readonly emailVerificationCode!: number;
}
