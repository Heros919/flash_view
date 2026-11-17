import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { BlocosModule } from "./Bloco/bloco.module";
import { ChapasModule } from "./chapas/chapas.module";
import { UsuarioModule } from "./usuario/usuario.module";
import { ClienteModule } from "./Cliente/cliente.module";
import { PrismaModule } from "./prisma/prisma.module";
import { VendasModule } from "./vendas/vendas.module";
import { FinanceiroModule } from "./financeiro/financeiro.module";
import { JwtAuthGuard } from "./auth/guard/jwt-auth.guard";
import { RolesGuard } from "./auth/guard/roles.guard";
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsuarioModule,
    BlocosModule,
    ChapasModule,
    ClienteModule,
    VendasModule,
    FinanceiroModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,   // 1 minuto
      limit: 100,   // máximo global de 100 requisições/minuto
    }]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}