CREATE TABLE usuario (
    id VARCHAR(100) PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha TEXT NOT NULL
);

CREATE TABLE administrador (
    id VARCHAR(100) PRIMARY KEY,
    usuario_id VARCHAR(100) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    email VARCHAR(255) NOT NULL UNIQUE,
    senha TEXT NOT NULL
);
