import { MailController } from '@mail/controllers/mail.controller';
import { MailerModuleOptionsFactory } from '@mail/factories/mailer-module-options.factory';
import { MailService } from '@mail/services/mail.service';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [UsersModule, MailerModule.forRootAsync({ useClass: MailerModuleOptionsFactory })],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
