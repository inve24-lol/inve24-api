import { Module } from '@nestjs/common';
import { IWebClientService } from '@summoner/web-client/abstracts/web-client-service.abstract';
import { AxiosClientServiceImpl } from '@summoner/web-client/services/axios-client-service.impl';

@Module({
  providers: [
    {
      provide: IWebClientService,
      useClass: AxiosClientServiceImpl,
    },
  ],
  exports: [IWebClientService],
})
export class WebClientModule {}
