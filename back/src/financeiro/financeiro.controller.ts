import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import { Papeis } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { RolesGuard } from "../auth/guard/roles.guard";
import { Papel } from "../usuario/usuario.service";
import { AtualizarFinanceiroDto } from "./dto/atualizar-financeiro.dto";
import { CriarFinanceiroDto } from "./dto/criar-financeiro.dto";
import { FinanceiroService } from "./financeiro.service";

@Controller("financeiros")
@UseGuards(JwtAuthGuard, RolesGuard)
@Papeis(Papel.Administrador)
export class FinanceiroController {
  constructor(private readonly financeiros: FinanceiroService) {}

  @Get()
  listar() {
    return this.financeiros.listar();
  }

  @Post()
  criar(@Body() body: CriarFinanceiroDto) {
    return this.financeiros.criar(body);
  }

  @Patch(":id")
  atualizar(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: AtualizarFinanceiroDto,
  ) {
    return this.financeiros.atualizar(id, body);
  }

  @Delete(":id")
  remover(@Param("id", ParseIntPipe) id: number) {
    return this.financeiros.remover(id);
  }
}
