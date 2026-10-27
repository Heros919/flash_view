import { validate } from "class-validator";
import { PapelConta } from "../../generated/prisma/enums";
import { RegistroDto } from "./registro.dto";

describe("RegistroDto", () => {
  const dadosValidos = {
    cpf: "12345678901",
    nome: "Pessoa Teste",
    email: "pessoa@exemplo.com",
    senha: "senha-segura",
  };

  it.each(Object.values(PapelConta))(
    "accepts the %s role sent by the registration form",
    async (papel) => {
      const dto = Object.assign(new RegistroDto(), {
        ...dadosValidos,
        papel,
      });

      await expect(validate(dto)).resolves.toHaveLength(0);
    },
  );

  it("rejects roles that are not defined by the account enum", async () => {
    const dto = Object.assign(new RegistroDto(), {
      ...dadosValidos,
      papel: "OUTRO",
    });

    const errors = await validate(dto);

    expect(errors.find((error) => error.property === "papel")).toBeDefined();
  });

  it("keeps papel optional for clients that do not send it", async () => {
    const dto = Object.assign(new RegistroDto(), dadosValidos);

    await expect(validate(dto)).resolves.toHaveLength(0);
  });
});
