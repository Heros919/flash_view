import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { randomUUID, timingSafeEqual } from "node:crypto";

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
    const papel = dto.papel ?? PapelConta.FUNCIONARIO;

    if (papel !== PapelConta.FUNCIONARIO) {
      throw new ForbiddenException(
        "Somente um administrador pode criar contas Financeiro ou Administrador.",
      );
    }

    const cpf = dto.cpf.replace(/\D/g, "");
    const nome = dto.nome.trim();
    const email = dto.email.trim().toLowerCase();

    if (!/^\d{11}$/.test(cpf)) {
      throw new ConflictException("O CPF deve conter 11 números.");
    }

    const [funcionarioExistente, usuarioExistente, financeiroExistente] =
      await Promise.all([
        this.prisma.funcionario.findFirst({
          where: { OR: [{ email }, { cpf }] },
        }),
        this.prisma.usuario.findFirst({
          where: { OR: [{ email }, { cpf }] },
        }),
        this.prisma.financeiro.findFirst({
          where: { OR: [{ email }, { cpf }] },
        }),
      ]);

    if (funcionarioExistente || usuarioExistente || financeiroExistente) {
      if (
        funcionarioExistente?.email === email ||
        usuarioExistente?.email === email ||
        financeiroExistente?.email === email
      ) {
        throw new ConflictException("Já existe uma conta com este e-mail.");
      }

      throw new ConflictException("Já existe uma conta com este CPF.");
    }

    const senhaHash = await bcrypt.hash(dto.senha, 10);

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

  async bootstrapAdministrador(dto: RegistroDto, chave: string) {
    this.validarChaveBootstrap(chave);

    const contaExistente = await this.prisma.usuario.findFirst({
      where: { papel: PapelConta.ADMINISTRADOR, ativo: true },
      orderBy: { id: "asc" },
    });

    const cpf = dto.cpf.replace(/\D/g, "");
    const nome = dto.nome.trim();
    const email = dto.email.trim().toLowerCase();

    if (!/^\d{11}$/.test(cpf)) {
      throw new ConflictException("O CPF deve conter 11 números.");
    }

    const [
      funcionarioComEmail,
      funcionarioComCpf,
      financeiroComEmail,
      financeiroComCpf,
      usuarioComEmail,
      usuarioComCpf,
    ] = await Promise.all([
      this.prisma.funcionario.findFirst({ where: { email } }),
      this.prisma.funcionario.findFirst({ where: { cpf } }),
      this.prisma.financeiro.findFirst({ where: { email } }),
      this.prisma.financeiro.findFirst({ where: { cpf } }),
      this.prisma.usuario.findFirst({ where: { email } }),
      this.prisma.usuario.findFirst({ where: { cpf } }),
    ]);

    if (
      funcionarioComEmail ||
      funcionarioComCpf ||
      financeiroComEmail ||
      financeiroComCpf
    ) {
      throw new ConflictException(
        funcionarioComEmail || financeiroComEmail
          ? "Já existe uma conta com este e-mail."
          : "Já existe uma conta com este CPF.",
      );
    }

    if (
      (usuarioComEmail && usuarioComEmail.id !== contaExistente?.id) ||
      (usuarioComCpf && usuarioComCpf.id !== contaExistente?.id)
    ) {
      throw new ConflictException(
        usuarioComEmail && usuarioComEmail.id !== contaExistente?.id
          ? "Já existe uma conta com este e-mail."
          : "Já existe uma conta com este CPF.",
      );
    }

    const data = {
      cpf,
      nome,
      email,
      senha_hash: await bcrypt.hash(dto.senha, 10),
      papel: PapelConta.ADMINISTRADOR,
      ativo: true,
    };
    const usuario = contaExistente
      ? await this.prisma.usuario.update({
          where: { id: contaExistente.id },
          data,
        })
      : await this.prisma.usuario.create({ data });

    return {
      mensagem: "Acesso do Administrador configurado com sucesso.",
      usuario: this.dadosPublicosUsuario(usuario),
    };
  }

  async bootstrapFinanceiro(dto: RegistroDto, chave: string) {
    this.validarChaveBootstrap(chave);

    const contaExistente = await this.prisma.financeiro.findFirst({
      where: { ativo: true },
      orderBy: { id: "asc" },
    });
    const cpf = dto.cpf.replace(/\D/g, "");
    const nome = dto.nome.trim();
    const email = dto.email.trim().toLowerCase();

    if (!/^\d{11}$/.test(cpf)) {
      throw new ConflictException("O CPF deve conter 11 números.");
    }

    const [
      funcionarioComEmail,
      funcionarioComCpf,
      usuarioComEmail,
      usuarioComCpf,
      financeiroComEmail,
      financeiroComCpf,
    ] = await Promise.all([
      this.prisma.funcionario.findFirst({ where: { email } }),
      this.prisma.funcionario.findFirst({ where: { cpf } }),
      this.prisma.usuario.findFirst({ where: { email } }),
      this.prisma.usuario.findFirst({ where: { cpf } }),
      this.prisma.financeiro.findFirst({ where: { email } }),
      this.prisma.financeiro.findFirst({ where: { cpf } }),
    ]);

    if (
      funcionarioComEmail ||
      funcionarioComCpf ||
      usuarioComEmail ||
      usuarioComCpf
    ) {
      throw new ConflictException(
        funcionarioComEmail || usuarioComEmail
          ? "Já existe uma conta com este e-mail."
          : "Já existe uma conta com este CPF.",
      );
    }

    if (
      (financeiroComEmail && financeiroComEmail.id !== contaExistente?.id) ||
      (financeiroComCpf && financeiroComCpf.id !== contaExistente?.id)
    ) {
      throw new ConflictException(
        financeiroComEmail && financeiroComEmail.id !== contaExistente?.id
          ? "Já existe uma conta com este e-mail."
          : "Já existe uma conta com este CPF.",
      );
    }

    const data = {
      cpf,
      nome,
      email,
      senha_hash: await bcrypt.hash(dto.senha, 10),
      ativo: true,
    };
    const financeiro = contaExistente
      ? await this.prisma.financeiro.update({
          where: { id: contaExistente.id },
          data,
        })
      : await this.prisma.financeiro.create({ data });

    return {
      mensagem: "Acesso do Financeiro configurado com sucesso.",
      financeiro: this.dadosPublicosFinanceiro(financeiro),
    };
  }

  private validarChaveBootstrap(chave: string) {
    const chaveConfigurada = process.env.ADMIN_BOOTSTRAP_KEY?.trim();
    if (!chaveConfigurada) {
      throw new ServiceUnavailableException(
        "ADMIN_BOOTSTRAP_KEY não foi configurada.",
      );
    }

    const chaveRecebida = Buffer.from(chave.trim());
    const chaveEsperada = Buffer.from(chaveConfigurada);
    if (
      chaveRecebida.length !== chaveEsperada.length ||
      !timingSafeEqual(chaveRecebida, chaveEsperada)
    ) {
      throw new UnauthorizedException("Chave de configuração inválida.");
    }
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
      const financeiro = await this.prisma.financeiro.findUnique({
        where: { email },
      });

      if (!financeiro || !financeiro.ativo) {
        throw new UnauthorizedException("E-mail ou senha inválidos.");
      }

      const senhaFinanceiroValida = await bcrypt.compare(
        dto.senha,
        financeiro.senha_hash,
      );

      if (!senhaFinanceiroValida) {
        throw new UnauthorizedException("E-mail ou senha inválidos.");
      }

      const payloadFinanceiro = {
        sub: String(financeiro.id),
        tipoConta: "financeiro",
        papel: PapelConta.FINANCEIRO,
        email: financeiro.email,
      };

      return {
        access_token: await this.jwtService.signAsync(payloadFinanceiro),
        financeiro: this.dadosPublicosFinanceiro(financeiro),
      };
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
      papel: PapelConta.FUNCIONARIO,
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

  private dadosPublicosFinanceiro(financeiro: {
    id: number;
    cpf: string;
    nome: string;
    email: string;
    ativo: boolean;
  }) {
    return {
      id: financeiro.id,
      cpf: financeiro.cpf,
      nome: financeiro.nome,
      email: financeiro.email,
      ativo: financeiro.ativo,
      papel: PapelConta.FINANCEIRO,
    };
  }
}
