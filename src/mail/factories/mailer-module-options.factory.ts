import mailConfig from '@core/config/settings/mail.config';
import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class MailerModuleOptionsFactory implements MailerOptionsFactory {
  constructor(@Inject(mailConfig.KEY) private readonly config: ConfigType<typeof mailConfig>) {}

  createMailerOptions(): MailerOptions {
    return {
      transport: {
        host: this.config.mail.host,
        port: this.config.mail.port,
        secure: true,
        auth: {
          user: this.config.mail.user,
          pass: this.config.mail.password,
        },
      },
      defaults: {
        from: `"인베24" <${this.config.mail.user}>`,
      },
      template: {
        dir: 'dist/mail/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
}
