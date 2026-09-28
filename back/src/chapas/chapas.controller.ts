import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  ParseIntPipe
} from '@nestjs/common';
import { ChapasService } from './chapas.service';
import { Papeis } from '../auth/decorators/roles.decorator';
import { CreatChapas } from './dto/criar-chapas.dto';
import { AtualizarPrecoChapaDto } from './dto/atualizar-preco.dto';
import { AutualizarStatus } from './dto/autera-status.dto';
import { Papel } from '../usuario/usuario.service';

@Controller('chapas')
export class ChapasController {
  constructor(private readonly chapasservice: ChapasService) {}

  @Papeis(Papel.Funcionario)
  @Post()
  criar(@Body() body: CreatChapas) {
    return this.chapasservice.criarChapas(body);
  }

  @Get()
  listar() {
    return this.chapasservice.listar();
  }

  @Papeis(Papel.Financeiro)
  @Patch(':id/preco')
  atualizarPreco(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarPrecoChapaDto
  ) {
    return this.chapasservice.atualizarPreco(id, dto);
  }

  @Papeis(Papel.Financeiro)
  @Patch(':id/status')
  atualizarStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AutualizarStatus
  ) {
    return this.chapasservice.atualizarStatus(id, dto);
  }
}
