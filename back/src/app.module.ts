import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BlocosModule } from './Bloco/bloco.module';
import { ChapasModule } from './chapas/chapas.module';
import { UsuarioModule } from './usuario/usuario.module';
import { ClienteModule } from './Cliente/cliente.module';
import { PrismaModule } from './prisma/prisma.module';
import { VendasModule } from './vendas/vendas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
       isGlobal: true 
      }),
    PrismaModule,
    AuthModule,
    UsuarioModule,
    BlocosModule,
    ChapasModule,
    ClienteModule,
    VendasModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}