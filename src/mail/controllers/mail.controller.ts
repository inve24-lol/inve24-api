import { SendEmailCertCodeRequestDto } from '@mail/dto/requests/send-email-cert-code-request.dto';
import { VerifyEmailCertCodeRequestDto } from '@mail/dto/requests/verify-email-cert-code-request.dto';
import { SendEmailCertCodeResponseDto } from '@mail/dto/responses/send-email-cert-code-response.dto';
import { VerifyEmailCertCodeResponseDto } from '@mail/dto/responses/verify-email-cert-code-response.dto';
import { MailService } from '@mail/services/mail.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('v1/:email')
  async sendEmailCertCode(
    @Param() sendEmailCertCodeRequest: SendEmailCertCodeRequestDto,
  ): Promise<SendEmailCertCodeResponseDto> {
    return await this.mailService.sendEmailCertCode(sendEmailCertCodeRequest);
  }

  @Get('v1/:certCode/:email')
  async verifyEmailCertCode(
    @Param() verifyEmailCertCodeRequest: VerifyEmailCertCodeRequestDto,
  ): Promise<VerifyEmailCertCodeResponseDto> {
    return await this.mailService.verifyEmailCertCode(verifyEmailCertCodeRequest);
  }
}
