import { Module } from '@nestjs/common';
import { BlocosModule } from './Bloco/bloco.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChapaModule } from './Chapa/chapa.module';

@Module({
  imports: [BlocosModule, ChapaModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
