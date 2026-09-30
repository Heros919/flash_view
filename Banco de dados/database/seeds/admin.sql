INSERT INTO admin (
    nome,
    email,
    senha
)
VALUES (
    'Administrador',
    'admin@flashview.com',
    'admin123'
);

ALTER TABLE chapa
    ADD COLUMN IF NOT EXISTS funcionario_id VARCHAR(100);