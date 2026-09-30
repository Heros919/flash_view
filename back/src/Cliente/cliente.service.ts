import { Injectable } from '@nestjs/common';
import { CreatCliente } from './dto/criar-cliente.dto';
type Cliente = {
  id: number;
  nome: string;
  cpf: number;
  telefone: number;
};
@Injectable()
export class ClienteService {
  private clientes: Cliente[] = [
    {
      id: 1,
      nome: 'João Morais',
      cpf: 123456,
      telefone: 9999999
    }
  ];

  criarCliente(dados: CreatCliente): Cliente {
    const novoId =
      this.clientes.length > 0
        ? Math.max(...this.clientes.map((c) => c.id)) + 1
        : 1;

    const novoCliente: Cliente = { id: novoId, ...dados };
    this.clientes.push(novoCliente);

    return novoCliente;
  }
}
