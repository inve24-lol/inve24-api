import { EMAIL_CERT_CODE_REGEXP } from '@mail/constants/mail.constant';
import { SendEmailCertCodeRequestDto } from '@mail/dto/requests/send-email-cert-code-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class VerifyEmailCertCodeRequestDto extends SendEmailCertCodeRequestDto {
  @ApiProperty({
    description: 'Email Cert Code',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(EMAIL_CERT_CODE_REGEXP)
  readonly certCode!: string;
}
