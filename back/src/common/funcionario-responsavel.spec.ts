import { BadRequestException, NotFoundException } from "@nestjs/common";
import { PapelConta } from "../generated/prisma/enums";
import { obterFuncionarioResponsavel } from "./funcionario-responsavel";

describe("obterFuncionarioResponsavel", () => {
  const funcionarioFindUnique = jest.fn();
  const clienteFindUnique = jest.fn();
  const prisma = {
    funcionario: {
      findUnique: funcionarioFindUnique,
    },
    cliente: {
      findUnique: clienteFindUnique,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("uses the authenticated employee for employee registrations", async () => {
    const responsavel = await obterFuncionarioResponsavel(prisma, {
      id: "funcionario-1",
      cpf: "12345678901",
      nome: "Pessoa Teste",
      email: "pessoa@exemplo.com",
      cliente_id: 7,
      admin_id: 1,
      papel: PapelConta.FUNCIONARIO,
    });

    expect(responsavel).toEqual({
      id: "funcionario-1",
      cliente_id: 7,
      usuario_id: null,
    });
    expect(funcionarioFindUnique).not.toHaveBeenCalled();
  });

  it("does not allow an employee to register under another employee ID", async () => {
    await expect(
      obterFuncionarioResponsavel(
        prisma,
        {
          id: "funcionario-1",
          cpf: "12345678901",
          nome: "Pessoa Teste",
          email: "pessoa@exemplo.com",
          cliente_id: 7,
          admin_id: 1,
          papel: PapelConta.FUNCIONARIO,
        },
        "funcionario-2",
      ),
    ).rejects.toThrow("Funcionários só podem cadastrar");

    expect(funcionarioFindUnique).not.toHaveBeenCalled();
  });

  it("allows an employee to register for another existing client", async () => {
    clienteFindUnique.mockResolvedValue({ id: 8 });

    await expect(
      obterFuncionarioResponsavel(
        prisma,
        {
          id: "funcionario-1",
          cpf: "12345678901",
          nome: "Pessoa Teste",
          email: "pessoa@exemplo.com",
          cliente_id: 7,
          admin_id: 1,
          papel: PapelConta.FUNCIONARIO,
        },
        "funcionario-1",
        8,
      ),
    ).resolves.toEqual({
      id: "funcionario-1",
      cliente_id: 8,
      usuario_id: null,
    });
    expect(clienteFindUnique).toHaveBeenCalledWith({
      where: { id: 8 },
      select: { id: true },
    });
  });

  it("uses the administrator account ID and selected client", async () => {
    clienteFindUnique.mockResolvedValue({ id: 8 });

    const responsavel = await obterFuncionarioResponsavel(
      prisma,
      {
        id: 2,
        cpf: "12345678901",
        nome: "Admin",
        email: "admin@exemplo.com",
        ativo: true,
        papel: PapelConta.ADMINISTRADOR,
      },
      undefined,
      8,
    );

    expect(responsavel).toEqual({
      id: null,
      cliente_id: 8,
      usuario_id: 2,
    });
    expect(clienteFindUnique).toHaveBeenCalledWith({
      where: { id: 8 },
      select: { id: true },
    });
    expect(funcionarioFindUnique).not.toHaveBeenCalled();
  });

  it("requires a client for administrator registrations", async () => {
    await expect(
      obterFuncionarioResponsavel(prisma, {
        id: 2,
        cpf: "12345678901",
        nome: "Admin",
        email: "admin@exemplo.com",
        ativo: true,
        papel: PapelConta.ADMINISTRADOR,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("does not accept an employee ID for administrator registrations", async () => {
    await expect(
      obterFuncionarioResponsavel(
        prisma,
        {
          id: 2,
          cpf: "12345678901",
          nome: "Admin",
          email: "admin@exemplo.com",
          ativo: true,
          papel: PapelConta.ADMINISTRADOR,
        },
        "funcionario-2",
        7,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(funcionarioFindUnique).not.toHaveBeenCalled();
  });

  it("rejects an unknown client for administrator registrations", async () => {
    clienteFindUnique.mockResolvedValue(null);

    await expect(
      obterFuncionarioResponsavel(
        prisma,
        {
          id: 2,
          cpf: "12345678901",
          nome: "Admin",
          email: "admin@exemplo.com",
          ativo: true,
          papel: PapelConta.ADMINISTRADOR,
        },
        undefined,
        999,
      ),
    ).rejects.toThrow("Cliente não encontrado");
  });

  it("rejects unknown employee IDs for financial registrations", async () => {
    funcionarioFindUnique.mockResolvedValue(null);

    await expect(
      obterFuncionarioResponsavel(
        prisma,
        {
          id: 2,
          cpf: "12345678901",
          nome: "Admin",
          email: "admin@exemplo.com",
          ativo: true,
          papel: PapelConta.FINANCEIRO,
        },
        "nao-existe",
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("resolves the selected employee for financial registrations", async () => {
    funcionarioFindUnique.mockResolvedValue({
      id: "funcionario-3",
      cliente_id: 9,
    });

    await expect(
      obterFuncionarioResponsavel(
        prisma,
        {
          id: 3,
          cpf: "12345678901",
          nome: "Financeiro",
          email: "financeiro@exemplo.com",
          ativo: true,
          papel: PapelConta.FINANCEIRO,
        },
        "funcionario-3",
      ),
    ).resolves.toEqual({
      id: "funcionario-3",
      cliente_id: 9,
      usuario_id: null,
    });
    expect(funcionarioFindUnique).toHaveBeenCalledWith({
      where: { id: "funcionario-3" },
    });
  });
});
