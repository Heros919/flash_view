import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Papeis } from '../auth/decorators/roles.decorator';
import {
  Papel,
  UsuarioAutenticado,
  UsuarioService,
} from './usuario.service';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Papeis(Papel.Administrador)
export class UsuarioController {
  constructor(private readonly usuarios: UsuarioService) {}

  @Get()
  listar() {
    return this.usuarios.listar();
  }

  @Post()
  criar(@Body() body: CriarUsuarioDto) {
    return this.usuarios.criar(body);
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AtualizarUsuarioDto,
    @Req()
    request: Request & {
      user: UsuarioAutenticado;
    },
  ) {
    return this.usuarios.atualizar(id, body, request.user.id);
  }

  @Delete(':id')
  remover(
    @Param('id', ParseIntPipe) id: number,
    @Req()
    request: Request & {
      user: UsuarioAutenticado;
    },
  ) {
    return this.usuarios.remover(id, request.user.id);
  }
}
