import { validate } from 'class-validator';
import { PapelConta } from '../../generated/prisma/enums';
import { RegistroDto } from './registro.dto';

describe('RegistroDto', () => {
  const dadosValidos = {
    cpf: '12345678901',
    nome: 'Pessoa Teste',
    email: 'pessoa@exemplo.com',
    senha: 'senha-segura',
  };

  it('accepts the funcionario role sent by the registration form', async () => {
    const dto = Object.assign(new RegistroDto(), {
      ...dadosValidos,
      papel: PapelConta.FUNCIONARIO,
    });

    await expect(validate(dto)).resolves.toHaveLength(0);
  });

  it('does not allow public registration to choose a privileged role', async () => {
    const dto = Object.assign(new RegistroDto(), {
      ...dadosValidos,
      papel: PapelConta.ADMINISTRADOR,
    });

    const errors = await validate(dto);

    expect(errors.find((error) => error.property === 'papel')).toBeDefined();
  });

  it('keeps papel optional for clients that do not send it', async () => {
    const dto = Object.assign(new RegistroDto(), dadosValidos);

    await expect(validate(dto)).resolves.toHaveLength(0);
  });
});
