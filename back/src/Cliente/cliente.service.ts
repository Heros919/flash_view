import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatCliente } from './dto/criar-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(private readonly prisma: PrismaService) {}

  async criarCliente(dados: CreatCliente) {
    try {
      return await this.prisma.cliente.create({
        data: {
          nome: dados.nome,
          cpf: dados.cpf,
          numero: dados.numero
        }
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('Já existe um cliente com esse CPF');
      }
      throw e;
    }
  }

  listar() {
    return this.prisma.cliente.findMany();
  }
}