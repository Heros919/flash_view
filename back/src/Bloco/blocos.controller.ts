import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { BlocosService } from './blocos.service';

import {
  Papeis,
} from '../auth/decorators/roles.decorator';

import {
  Papel,
} from '../usuario/usuario.service';

import {
  CreateBlocos,
} from './dto/criar-bloco.dto';

import {
  AtualizarBlocoDto,
} from './dto/atualizar-bloco.dto';

@Controller('blocos')
export class BlocosController {
  constructor(
    private readonly blocosService: BlocosService,
  ) {}

  @Papeis(Papel.Funcionario)
  @Post()
  criar(@Body() body: CreateBlocos) {
    return this.blocosService.criarBloco(body);
  }

  @Get()
  listar() {
    return this.blocosService.listas();
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.blocosService.buscarPorId(id);
  }

  @Papeis(Papel.Funcionario)
  @Patch(':id')
  atualizar(
    @Param('id') id: string,
    @Body() body: AtualizarBlocoDto,
  ) {
    return this.blocosService.atualizarBloco(
      id,
      body,
    );
  }
}
