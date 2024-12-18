import { Module } from '@nestjs/common';
import { IWebClientService } from '@web-client/abstracts/web-client-service.abstract';
import { AxiosClientServiceImpl } from '@web-client/services/axios-client-service.impl';

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
