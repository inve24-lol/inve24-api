import { EMAIL_CERT_CODE_RANGE } from '@mail/constants/mail.constant';
import { SendEmailCertCodeRequestDto } from '@mail/dto/requests/send-email-cert-code-request.dto';
import { VerifyEmailCertCodeRequestDto } from '@mail/dto/requests/verify-email-cert-code-request.dto';
import { SendEmailCertCodeResponseDto } from '@mail/dto/responses/send-email-cert-code-response.dto';
import { VerifyEmailCertCodeResponseDto } from '@mail/dto/responses/verify-email-cert-code-response.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '@users/services/users.service';
import { plainToInstance } from 'class-transformer';
import { randomInt } from 'crypto';

@Injectable()
export class MailService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  async sendEmailCertCode(
    sendEmailCertCodeRequest: SendEmailCertCodeRequestDto,
  ): Promise<SendEmailCertCodeResponseDto> {
    const { email } = sendEmailCertCodeRequest;

    await this.usersService.checkUserEmailExists(email);

    const certCode = this.generateEmailCertCode(email);

    await this.sendEmail(email, certCode);

    return plainToInstance(SendEmailCertCodeResponseDto, { email });
  }

  async verifyEmailCertCode(
    verifyEmailCertCodeRequest: VerifyEmailCertCodeRequestDto,
  ): Promise<VerifyEmailCertCodeResponseDto> {
    const { certCode, email } = verifyEmailCertCodeRequest;

    // TODO: 캐시 가져오기
    // const data = this.verificationCodeInfos.get(email);
    // if (!data) throw new BadRequestException('이메일 인증 코드가 존재하지 않습니다.');

    //  TODO: 캐시 검증하기
    // const { code, expiresAt } = data;
    // if (code !== verificationCode)
    //   throw new BadRequestException('이메일 인증 코드가 일치하지 않습니다.');

    // TODO: 만료시간 초과 시 캐시 삭제
    // if (new Date(expiresAt) < new Date()) {
    //   this.verificationCodeInfos.delete(email);
    //   throw new BadRequestException('인증 코드가 만료되었습니다.');
    // }

    // TODO: 캐시 삭제
    // this.verificationCodeInfos.delete(email);

    return plainToInstance(VerifyEmailCertCodeResponseDto, { email });
  }

  private generateEmailCertCode(email: string): number {
    const certCode = randomInt(EMAIL_CERT_CODE_RANGE.MIN, EMAIL_CERT_CODE_RANGE.MAX);

    // TODO: 레디스에 저장하고 TTL 설전 후 code만 리턴
    // const expiresAt = new Date();
    // expiresAt.setHours(expiresAt.getHours() + 1);
    // this.verificationCodeInfos.set(email, { code, expiresAt });

    return certCode;
  }

  private async sendEmail(email: string, certCode: number) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '이메일 주소 인증 코드입니다.',
        template: './email-cert-code',
        context: {
          certCode,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Send Email failed.');
    }
  }
}
