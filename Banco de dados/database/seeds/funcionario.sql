INSERT INTO funcionario (
    id,
    cliente_id,
    admin_id,
    nome,
    email,
    senha
)
SELECT
    '1',
    cliente.id,
    admin.id,
    'Funcionario',
    'func@flashview.com',
    'password-1'
FROM cliente
CROSS JOIN admin
WHERE cliente.cpf = '12345678901'
  AND admin.email = 'admin@flashview.com';