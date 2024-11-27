import { EMAIL_VERIFICATION_CODE_RANGE } from '@mail/constants/mail.constant';
import { SendEmailVerificationCodeRequestDto } from '@mail/dtos/requests/send-email-verification-code-request.dto';
import { verifyEmailVerificationCodeRequestDto } from '@mail/dtos/requests/verify-email-verification-code-request.dto';
import { SendEmailVerificationCodeResponseDto } from '@mail/dtos/responses/send-email-verification-code-response.dto';
import { VerifyEmailVerificationCodeResponseDto } from '@mail/dtos/responses/verify-email-verification-code-response.dto';
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

  async sendEmailVerificationCode(
    sendEmailVerificationCodeRequest: SendEmailVerificationCodeRequestDto,
  ): Promise<SendEmailVerificationCodeResponseDto> {
    const { email } = sendEmailVerificationCodeRequest;

    await this.usersService.checkUserEmailExists(email);

    const emailVerificationCode = this.generateEmailVerificationCode(email);

    await this.sendEmail(email, emailVerificationCode);

    return plainToInstance(SendEmailVerificationCodeResponseDto, { email });
  }

  async verifyEmailVerificationCode(
    verifyEmailVerificationCodeRequest: verifyEmailVerificationCodeRequestDto,
  ): Promise<VerifyEmailVerificationCodeResponseDto> {
    const { emailVerificationCode, email } = verifyEmailVerificationCodeRequest;

    // TODO: 캐시 가져오기
    // const data = this.verificationCodeInfos.get(email);
    // if (!data) throw new BadRequestException('이메일 인증 코드가 존재하지 않습니다.');

    //  TODO: 캐시 가져오기
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

    return plainToInstance(VerifyEmailVerificationCodeResponseDto, { email });
  }

  private generateEmailVerificationCode(email: string): number {
    const emailVerificationCode = randomInt(
      EMAIL_VERIFICATION_CODE_RANGE.MIN,
      EMAIL_VERIFICATION_CODE_RANGE.MAX,
    );

    // TODO: 레디스에 저장하고 TTL 설전 후 code만 리턴
    // const expiresAt = new Date();
    // expiresAt.setHours(expiresAt.getHours() + 1);
    // this.verificationCodeInfos.set(email, { code, expiresAt });

    return emailVerificationCode;
  }

  private async sendEmail(email: string, emailVerificationCode: number) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '이메일 주소 인증 코드입니다.',
        template: './email-verification-code',
        context: {
          code: emailVerificationCode,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Send Email failed.');
    }
  }
}
