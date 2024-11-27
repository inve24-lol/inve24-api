import redisConfig from '@core/config/redis.config';
import { IMailCacheRepository } from '@core/redis/abstracts/mail-cache-repository.abstract';
import { EMAIL_CERT_CODE_RANGE } from '@mail/constants/mail.constant';
import { SendEmailCertCodeRequestDto } from '@mail/dto/requests/send-email-cert-code-request.dto';
import { VerifyEmailCertCodeRequestDto } from '@mail/dto/requests/verify-email-cert-code-request.dto';
import { SendEmailCertCodeResponseDto } from '@mail/dto/responses/send-email-cert-code-response.dto';
import { VerifyEmailCertCodeResponseDto } from '@mail/dto/responses/verify-email-cert-code-response.dto';
import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { UsersService } from '@users/services/users.service';
import { plainToInstance } from 'class-transformer';
import { randomInt } from 'crypto';

@Injectable()
export class MailService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    private readonly mailCacheRepository: IMailCacheRepository,
    @Inject(redisConfig.KEY) private readonly config: ConfigType<typeof redisConfig>,
  ) {}

  async sendEmailCertCode(
    sendEmailCertCodeRequest: SendEmailCertCodeRequestDto,
  ): Promise<SendEmailCertCodeResponseDto> {
    const { email } = sendEmailCertCodeRequest;

    await this.usersService.checkUserEmailExists(email);

    await this.generateEmailCertCode(email);

    return plainToInstance(SendEmailCertCodeResponseDto, { email });
  }

  async verifyEmailCertCode(
    verifyEmailCertCodeRequest: VerifyEmailCertCodeRequestDto,
  ): Promise<VerifyEmailCertCodeResponseDto> {
    const { certCode, email } = verifyEmailCertCodeRequest;

    const redisCertCode = await this.mailCacheRepository.getCertCode(email);

    if (!redisCertCode) throw new BadRequestException('이메일 인증 코드가 만료되었습니다.');

    if (certCode !== redisCertCode)
      throw new BadRequestException('이메일 인증 코드가 일치하지 않습니다.');

    await this.mailCacheRepository.delCertCode(email);

    return plainToInstance(VerifyEmailCertCodeResponseDto, { email });
  }

  private async generateEmailCertCode(email: string): Promise<void> {
    const certCode = randomInt(EMAIL_CERT_CODE_RANGE.MIN, EMAIL_CERT_CODE_RANGE.MAX);

    await this.mailCacheRepository.setCertCode(email, certCode, this.config.redis.emailCertCodeTtl);

    await this.sendEmail(email, certCode);
  }

  private async sendEmail(email: string, certCode: number) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '이메일 주소 인증 코드입니다.',
        template: 'email-cert-code',
        context: {
          certCode,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Send Email failed.');
    }
  }
}
