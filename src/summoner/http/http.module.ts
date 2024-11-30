import { Module } from '@nestjs/common';
import { WebClientModule } from '@web-client/web-client.module';
import { HttpService } from '@http/services/http.service';

@Module({
  imports: [WebClientModule],
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule {}
