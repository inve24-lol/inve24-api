import { Module } from '@nestjs/common';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { CoreModule } from '@core/core.module';
import { UsersModule } from '@users/users.module';
import { AuthModule } from '@auth/auth.module';
import { MailModule } from '@mail/mail.module';
import { SummonerModule } from '@summoner/summoner.module';

@Module({
  imports: [CoreModule, UsersModule, AuthModule, MailModule, SummonerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
