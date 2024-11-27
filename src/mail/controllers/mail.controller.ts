import { SendEmailVerificationCodeRequestDto } from '@mail/dto/requests/send-email-verification-code-request.dto';
import { verifyEmailVerificationCodeRequestDto } from '@mail/dto/requests/verify-email-verification-code-request.dto';
import { SendEmailVerificationCodeResponseDto } from '@mail/dto/responses/send-email-verification-code-response.dto';
import { VerifyEmailVerificationCodeResponseDto } from '@mail/dto/responses/verify-email-verification-code-response.dto';
import { MailService } from '@mail/services/mail.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('v1/:email')
  async sendEmailVerificationCode(
    @Param() sendEmailVerificationCodeRequest: SendEmailVerificationCodeRequestDto,
  ): Promise<SendEmailVerificationCodeResponseDto> {
    return await this.mailService.sendEmailVerificationCode(sendEmailVerificationCodeRequest);
  }

  @Get('v1/:verificationCode/:email')
  async verifyEmailVerificationCode(
    @Param() verifyEmailVerificationCodeRequest: verifyEmailVerificationCodeRequestDto,
  ): Promise<VerifyEmailVerificationCodeResponseDto> {
    return await this.mailService.verifyEmailVerificationCode(verifyEmailVerificationCodeRequest);
  }
}
