import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { PrismaService } from "../prisma/prisma.service";
import { FinanceiroController } from "./financeiro.controller";
import { FinanceiroService } from "./financeiro.service";

@Module({
  imports: [AuthModule],
  controllers: [FinanceiroController],
  providers: [FinanceiroService, PrismaService],
})
export class FinanceiroModule {}
