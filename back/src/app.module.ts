import { Module } from '@nestjs/common';
import { BlocosModule } from './Bloco/bloco.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChapaModule } from './Chapa/chapa.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [BlocosModule, ChapaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
