import { Module } from '@nestjs/common';
import { BlocosModule } from './Bloco/bloco.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [BlocosModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
