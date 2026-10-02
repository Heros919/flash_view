import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ChapasService } from './chapas.service';
import { Papeis } from '../auth/decorators/roles.decorator';
import { CreatChapas } from './dto/criar-chapas.dto';
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

  // O id da chapa é texto (VARCHAR) no banco, por isso sem ParseIntPipe
  @Papeis(Papel.Financeiro)
  @Patch(':id/status')
  atualizarStatus(@Param('id') id: string, @Body() dto: AutualizarStatus) {
    return this.chapasservice.atualizarStatus(id, dto);
  }
}