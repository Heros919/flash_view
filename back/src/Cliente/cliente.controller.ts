import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { Papeis } from '../auth/decorators/roles.decorator';
import { Papel } from '../usuario/usuario.service';
import { CreatCliente } from './dto/criar-cliente.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteservice: ClienteService) {}

  @Papeis(Papel.Financeiro)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  criar(@Body() body: CreatCliente) {
    return this.clienteservice.criarCliente(body);
  }

  @Papeis(Papel.Financeiro)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  listar() {
    return this.clienteservice.listar();
  }
}