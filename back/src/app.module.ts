import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BlocosModule } from './Bloco/bloco.module';
import { ChapasModule } from './chapas/chapas.module';
<<<<<<< Updated upstream
=======
import { ClienteModule } from './Cliente/cliente.module';
>>>>>>> Stashed changes
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    BlocosModule,
<<<<<<< Updated upstream
    ChapasModule
=======
    ChapasModule,
    ClienteModule
>>>>>>> Stashed changes
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
