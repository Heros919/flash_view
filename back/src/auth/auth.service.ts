import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';

import { PrismaService } from '../prisma/prisma.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async registrar(dto: RegistroDto) {
    const cpf = dto.cpf.replace(/\D/g, '');
    const nome = dto.nome.trim();
    const email = dto.email.trim().toLowerCase();

    if (!/^\d{11}$/.test(cpf)) {
      throw new ConflictException(
        'O CPF deve conter 11 números.',
      );
    }

    const existente = await this.prisma.funcionario.findFirst({
      where: {
        OR: [
          { email },
          { cpf },
        ],
      },
    });

    if (existente) {
      if (existente.email === email) {
        throw new ConflictException(
          'Já existe um funcionário com este e-mail.',
        );
      }

      throw new ConflictException(
        'Já existe um funcionário com este CPF.',
      );
    }

    const [cliente, admin] = await Promise.all([
      this.prisma.cliente.findFirst({
        orderBy: { id: 'asc' },
      }),
      this.prisma.admin.findFirst({
        orderBy: { id: 'asc' },
      }),
    ]);

    if (!cliente || !admin) {
      throw new NotFoundException(
        'É necessário ter pelo menos um cliente e um administrador cadastrados.',
      );
    }

    const senhaHash = await bcrypt.hash(dto.senha, 10);

    const funcionario = await this.prisma.funcionario.create({
      data: {
        id: randomUUID(),
        cpf,
        nome,
        email,
        senha: senhaHash,
        cliente_id: cliente.id,
        admin_id: admin.id,
      },
    });

    return {
      mensagem: 'Funcionário cadastrado com sucesso.',
      funcionario: this.dadosPublicos(funcionario),
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    const funcionario = await this.prisma.funcionario.findUnique({
      where: { email },
    });

    if (!funcionario) {
      throw new UnauthorizedException(
        'E-mail ou senha inválidos.',
      );
    }

    const senhaValida = await bcrypt.compare(
      dto.senha,
      funcionario.senha,
    );

    if (!senhaValida) {
      throw new UnauthorizedException(
        'E-mail ou senha inválidos.',
      );
    }

    const payload = {
      sub: funcionario.id,
      email: funcionario.email,
      cliente_id: funcionario.cliente_id,
      admin_id: funcionario.admin_id,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      funcionario: this.dadosPublicos(funcionario),
    };
  }

  async validarUsuario(email: string, senha: string) {
    const funcionario = await this.prisma.funcionario.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    if (!funcionario) {
      return null;
    }

    const senhaValida = await bcrypt.compare(
      senha,
      funcionario.senha,
    );

    if (!senhaValida) {
      return null;
    }

    return this.dadosPublicos(funcionario);
  }

  private dadosPublicos(funcionario: {
    id: string;
    cpf: string | null;
    nome: string;
    email: string;
    cliente_id: number;
    admin_id: number;
  }) {
    return {
      id: funcionario.id,
      cpf: funcionario.cpf,
      nome: funcionario.nome,
      email: funcionario.email,
      cliente_id: funcionario.cliente_id,
      admin_id: funcionario.admin_id,
    };
  }
}
