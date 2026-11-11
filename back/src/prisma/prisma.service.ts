import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';

import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();

    const diagnostico = await this.$queryRaw<
      {
        banco: string;
        schema_atual: string;
        servidor: string | null;
        porta: number;
        tabela_usuario: string | null;
      }[]
    >`
      SELECT
        current_database() AS banco,
        current_schema() AS schema_atual,
        inet_server_addr()::text AS servidor,
        inet_server_port() AS porta,
        to_regclass('public.usuario')::text AS tabela_usuario
    `;

    
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
