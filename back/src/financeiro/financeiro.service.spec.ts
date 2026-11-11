import { Test, TestingModule } from "@nestjs/testing";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { FinanceiroService } from "./financeiro.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

describe("FinanceiroService", () => {
  let service: FinanceiroService;
  const prisma = {
    funcionario: { findFirst: jest.fn() },
    usuario: { findFirst: jest.fn() },
    financeiro: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    prisma.funcionario.findFirst.mockResolvedValue(null);
    prisma.usuario.findFirst.mockResolvedValue(null);
    prisma.financeiro.findFirst.mockResolvedValue(null);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinanceiroService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<FinanceiroService>(FinanceiroService);
  });

  it("creates a finance account in the dedicated table with a hashed password", async () => {
    prisma.financeiro.create.mockImplementation(({ data }) =>
      Promise.resolve({
        id: 3,
        ...data,
        ativo: true,
        datacadastro: new Date(),
      }),
    );

    const conta = await service.criar({
      cpf: "123.456.789-01",
      nome: "  Financeiro  ",
      email: "Financeiro@exemplo.com ",
      senha: "senha-segura",
    });

    const data = prisma.financeiro.create.mock.calls[0][0].data;
    expect(data).toMatchObject({
      cpf: "12345678901",
      nome: "Financeiro",
      email: "financeiro@exemplo.com",
    });
    await expect(bcrypt.compare("senha-segura", data.senha_hash)).resolves.toBe(
      true,
    );
    expect(conta).toMatchObject({
      id: 3,
      papel: "FINANCEIRO",
    });
    expect(conta).not.toHaveProperty("senha_hash");
  });
});
