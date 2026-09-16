CREATE TABLE midia (
    id VARCHAR(100) PRIMARY KEY,

    nome VARCHAR(255) NOT NULL,

    tipo VARCHAR(20) NOT NULL,

    formato VARCHAR(100) NOT NULL,

    dados BYTEA NOT NULL,

    blocoid VARCHAR(100),

    chapaid VARCHAR(100),

    dataCadastro DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT fk_midia_bloco
        FOREIGN KEY (blocoid)
        REFERENCES bloco(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_midia_chapa
        FOREIGN KEY (chapaid)
        REFERENCES chapa(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT chk_midia_tipo
        CHECK (
            tipo IN ('FOTO', 'VIDEO')
        ),

    CONSTRAINT chk_midia_origem
        CHECK (
            blocoid IS NOT NULL OR chapaid IS NOT NULL
        )
);