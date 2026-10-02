import { Controller, Post, Get, Body } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { Papeis } from '../auth/decorators/roles.decorator';
import { Papel } from '../usuario/usuario.service';
import { CreatCliente } from './dto/criar-cliente.dto';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteservice: ClienteService) {}

  @Papeis(Papel.Financeiro)
  @Post()
  criar(@Body() body: CreatCliente) {
    return this.clienteservice.criarCliente(body);
  }

  @Papeis(Papel.Financeiro)
  @Get()
  listar() {
    return this.clienteservice.listar();
  }
}