
CREATE TABLE funcionario (
    id VARCHAR(100) PRIMARY KEY,
    cliente_id INTEGER NOT NULL,
    admin_id INTEGER NOT NULL,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha TEXT NOT NULL,

    CONSTRAINT uq_funcionario_cliente_id
        UNIQUE (cliente_id, id),

    CONSTRAINT fk_funcionario_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES cliente(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_funcionario_admin
        FOREIGN KEY (admin_id)
        REFERENCES admin(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE INDEX idx_funcionario_cliente_id
ON funcionario(cliente_id);

CREATE INDEX idx_funcionario_admin_id
ON funcionario(admin_id);