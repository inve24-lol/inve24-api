import { SendEmailCertCodeRequestDto } from '@mail/dto/requests/send-email-cert-code-request.dto';
import { VerifyEmailCertCodeRequestDto } from '@mail/dto/requests/verify-email-cert-code-request.dto';
import { SendEmailCertCodeResponseDto } from '@mail/dto/responses/send-email-cert-code-response.dto';
import { VerifyEmailCertCodeResponseDto } from '@mail/dto/responses/verify-email-cert-code-response.dto';
import { MailService } from '@mail/services/mail.service';
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @ApiOperation({ summary: '이메일 인증 코드 메일 전송' })
  @ApiOkResponse({ type: SendEmailCertCodeResponseDto })
  @HttpCode(HttpStatus.OK)
  @Get('v1/:email')
  async sendEmailCertCode(
    @Param() sendEmailCertCodeRequest: SendEmailCertCodeRequestDto,
  ): Promise<SendEmailCertCodeResponseDto> {
    return await this.mailService.sendEmailCertCode(sendEmailCertCodeRequest);
  }

  @ApiOperation({ summary: '이메일 인증 코드 검증' })
  @ApiOkResponse({ type: VerifyEmailCertCodeResponseDto })
  @HttpCode(HttpStatus.OK)
  @Get('v1/:certCode/:email')
  async verifyEmailCertCode(
    @Param() verifyEmailCertCodeRequest: VerifyEmailCertCodeRequestDto,
  ): Promise<VerifyEmailCertCodeResponseDto> {
    return await this.mailService.verifyEmailCertCode(verifyEmailCertCodeRequest);
  }
}
