import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '../generated/prisma/client';
import { PapelConta } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { RegistroDto } from '../auth/dto/registro.dto';

export enum Papel {
  Funcionario = 'FUNCIONARIO',
  Financeiro = 'FINANCEIRO',
  Administrador = 'ADMINISTRADOR'
}

export type Usuario = {
  cpf: string;
  nome: string;
  email: string;
  senhaHash: string;
  ativo: boolean;
  papel: Papel;
};

export type UsuarioAutenticado = Omit<Usuario, 'senhaHash'>;

const MAPA_PAPEL: Record<string, Papel> = {
  FUNCIONARIO: Papel.Funcionario,
  FINANCEIRO: Papel.Financeiro,
  ADMINISTRADOR: Papel.Administrador
};

@Injectable()
export class UsuarioService {
  private readonly logger = new Logger(UsuarioService.name);

  constructor(private readonly prisma: PrismaService) {}

  private readonly usuarios: Usuario[] = [
    {
      cpf: '1',
      nome: 'Henrique Luiz Dantas',
      email: 'henrique@empresa.com',
      senhaHash:
        '$2b$12$1TxO6MRn5RPcoL3AvNGrb.if.HubmYVzI204/nNeXd0zd98N5OEv2',
      ativo: true,
      papel: Papel.Administrador
    },
    {
      cpf: '2',
      nome: 'Claudio Araujo Casta',
      email: 'caraujo@empresa.com',
      senhaHash:
        '$2b$12$1TxO6MRn5RPcoL3AvNGrb.if.HubmYVzI204/nNeXd0zd98N5OEv2',
      ativo: true,
      papel: Papel.Financeiro
    },
    {
      cpf: '3',
      nome: 'Luiz Conzaga Garcia',
      email: 'conzaga@empresa.com',
      senhaHash:
        '$2b$12$1TxO6MRn5RPcoL3AvNGrb.if.HubmYVzI204/nNeXd0zd98N5OEv2',
      ativo: true,
      papel: Papel.Funcionario
    }
  ];

  async buscarPorEmail(email: string): Promise<Usuario | undefined> {
    const alvo = email.trim().toLowerCase();

    try {
      const registrado = await this.prisma.usuario.findUnique({
        where: { email: alvo }
      });

      if (registrado) {
        return this.mapearUsuario(registrado);
      }
    } catch (erro) {
      this.registrarErro('Falha ao buscar usuário por e-mail', erro);
      throw new InternalServerErrorException(
        'Não foi possível buscar o usuário'
      );
    }

    return this.usuarios.find(
      (usuario) => usuario.email.toLowerCase() === alvo
    );
  }

  async buscarPorId(cpf: string | number): Promise<Usuario | undefined> {
    const identificador = String(cpf);

    try {
      const registrado = await this.prisma.usuario.findUnique({
        where: { cpf: identificador }
      });

      if (registrado) {
        return this.mapearUsuario(registrado);
      }
    } catch (erro) {
      this.registrarErro('Falha ao buscar usuário por CPF', erro);
      throw new InternalServerErrorException(
        'Não foi possível buscar o usuário'
      );
    }

    return this.usuarios.find(
      (usuario) => usuario.cpf === identificador
    );
  }

  async criar(dados: RegistroDto): Promise<UsuarioAutenticado> {
    const cpf = dados.cpf.trim();
    const nome = dados.nome.trim();
    const email = dados.email.trim().toLowerCase();

    const existente = this.usuarios.some(
      (usuario) =>
        usuario.cpf === cpf ||
        usuario.email.toLowerCase() === email
    );

    if (existente) {
      throw new ConflictException(
        'Já existe uma conta com esse CPF ou e-mail'
      );
    }

    const senhaHash = await bcrypt.hash(dados.senha, 12);

    try {
      const usuario = await this.prisma.usuario.create({
        data: {
          cpf,
          nome,
          email,
          senha_hash: senhaHash,
          papel: PapelConta.FUNCIONARIO
        }
      });

      return this.semSenha(this.mapearUsuario(usuario));
    } catch (erro) {
      if (
        erro instanceof Prisma.PrismaClientKnownRequestError &&
        erro.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe uma conta com esse CPF ou e-mail'
        );
      }

      this.registrarErro('Falha ao criar usuário', erro);

      throw new InternalServerErrorException(
        'Não foi possível cadastrar o usuário'
      );
    }
  }

  private mapearUsuario(usuario: {
    cpf: string;
    nome: string;
    email: string;
    senha_hash: string;
    ativo: boolean;
    papel: PapelConta;
  }): Usuario {
    const papel = MAPA_PAPEL[usuario.papel];

    if (!papel) {
      throw new InternalServerErrorException(
        'A conta possui um papel de acesso inválido'
      );
    }

    return {
      cpf: usuario.cpf,
      nome: usuario.nome,
      email: usuario.email,
      senhaHash: usuario.senha_hash,
      ativo: usuario.ativo,
      papel
    };
  }

  semSenha(usuario: Usuario): UsuarioAutenticado {
    return {
      cpf: usuario.cpf,
      nome: usuario.nome,
      email: usuario.email,
      ativo: usuario.ativo,
      papel: usuario.papel
    };
  }

  private registrarErro(mensagem: string, erro: unknown): void {
    if (erro instanceof Error) {
      this.logger.error(`${mensagem}: ${erro.message}`, erro.stack);
    } else {
      this.logger.error(`${mensagem}: ${String(erro)}`);
    }
  }
}