import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";

import { PrismaService } from "../prisma/prisma.service";
import { PapelConta } from "../generated/prisma/enums";
import { RegistroDto } from "./dto/registro.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async registrar(dto: RegistroDto) {
    const cpf = dto.cpf.replace(/\D/g, "");
    const nome = dto.nome.trim();
    const email = dto.email.trim().toLowerCase();
    const papel = dto.papel ?? PapelConta.FUNCIONARIO;

    if (!/^\d{11}$/.test(cpf)) {
      throw new ConflictException("O CPF deve conter 11 números.");
    }

    const [funcionarioExistente, usuarioExistente] = await Promise.all([
      this.prisma.funcionario.findFirst({
        where: { OR: [{ email }, { cpf }] },
      }),
      this.prisma.usuario.findFirst({
        where: { OR: [{ email }, { cpf }] },
      }),
    ]);

    if (funcionarioExistente || usuarioExistente) {
      if (
        funcionarioExistente?.email === email ||
        usuarioExistente?.email === email
      ) {
        throw new ConflictException("Já existe uma conta com este e-mail.");
      }

      throw new ConflictException("Já existe uma conta com este CPF.");
    }

    const senhaHash = await bcrypt.hash(dto.senha, 10);

    if (papel !== PapelConta.FUNCIONARIO) {
      const usuario = await this.prisma.usuario.create({
        data: {
          cpf,
          nome,
          email,
          senha_hash: senhaHash,
          papel,
        },
      });

      return {
        mensagem: "Usuário cadastrado com sucesso.",
        usuario: this.dadosPublicosUsuario(usuario),
      };
    }

    const [cliente, admin] = await Promise.all([
      this.prisma.cliente.findFirst({
        orderBy: { id: "asc" },
      }),
      this.prisma.admin.findFirst({
        orderBy: { id: "asc" },
      }),
    ]);

    if (!cliente || !admin) {
      throw new NotFoundException(
        "É necessário ter pelo menos um cliente e um administrador cadastrados.",
      );
    }

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
      mensagem: "Funcionário cadastrado com sucesso.",
      funcionario: this.dadosPublicos(funcionario),
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    const funcionario = await this.prisma.funcionario.findUnique({
      where: { email },
    });

    if (funcionario) {
      const senhaValida = await bcrypt.compare(dto.senha, funcionario.senha);

      if (!senhaValida) {
        throw new UnauthorizedException("E-mail ou senha inválidos.");
      }

      const payload = {
        sub: funcionario.id,
        tipoConta: "funcionario",
        papel: PapelConta.FUNCIONARIO,
        email: funcionario.email,
        cliente_id: funcionario.cliente_id,
        admin_id: funcionario.admin_id,
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
        funcionario: this.dadosPublicos(funcionario),
      };
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario || !usuario.ativo) {
      throw new UnauthorizedException("E-mail ou senha inválidos.");
    }

    const senhaValida = await bcrypt.compare(dto.senha, usuario.senha_hash);

    if (!senhaValida) {
      throw new UnauthorizedException("E-mail ou senha inválidos.");
    }

    const payload = {
      sub: String(usuario.id),
      tipoConta: "usuario",
      papel: usuario.papel,
      email: usuario.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      usuario: this.dadosPublicosUsuario(usuario),
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

    const senhaValida = await bcrypt.compare(senha, funcionario.senha);

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

  private dadosPublicosUsuario(usuario: {
    id: number;
    cpf: string;
    nome: string;
    email: string;
    ativo: boolean;
    papel: PapelConta;
  }) {
    return {
      id: usuario.id,
      cpf: usuario.cpf,
      nome: usuario.nome,
      email: usuario.email,
      ativo: usuario.ativo,
      papel: usuario.papel,
    };
  }
}
