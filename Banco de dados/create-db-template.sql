-- =========================================================
-- FLASH VIEW - BANCO DE DADOS
-- PostgreSQL
-- =========================================================


-- =========================================================
-- 1. APAGAR TABELAS ANTIGAS
-- =========================================================

DROP TABLE IF EXISTS chapa;
DROP TABLE IF EXISTS bloco;
DROP TABLE IF EXISTS usuario;


-- =========================================================
-- 2. TABELA USUARIO
-- =========================================================

CREATE TABLE usuario (
    id VARCHAR(100) PRIMARY KEY,

    nome VARCHAR(150) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    senha TEXT NOT NULL
);


-- =========================================================
-- 3. TABELA BLOCO
-- =========================================================

CREATE TABLE bloco (
    id VARCHAR(100) PRIMARY KEY,

    -- Código gerado pelo sistema
    codigo VARCHAR(50) NOT NULL UNIQUE,

    -- Número utilizado na codificação do bloco
    numero INTEGER NOT NULL,

    -- Informações do material
    material VARCHAR(150),

    cor VARCHAR(160),

    -- Dimensões do bloco
    altura NUMERIC(10,2),

    largura NUMERIC(10,2),

    comprimento NUMERIC(10,2),

    -- Peso do bloco
    peso NUMERIC(10,2),

    -- Informações utilizadas para gerar o código
    mes INTEGER NOT NULL,

    ano INTEGER NOT NULL,

    frente VARCHAR(50) NOT NULL,

    -- Data de cadastro
    dataCadastro DATE NOT NULL DEFAULT CURRENT_DATE,


    -- =====================================================
    -- REGRAS DE VALIDAÇÃO
    -- =====================================================

    CONSTRAINT chk_bloco_numero
        CHECK (numero >= 0 AND numero <= 99),

    CONSTRAINT chk_bloco_mes
        CHECK (mes >= 1 AND mes <= 12),

    CONSTRAINT chk_bloco_ano
        CHECK (ano >= 2000),

    CONSTRAINT chk_bloco_altura
        CHECK (altura IS NULL OR altura > 0),

    CONSTRAINT chk_bloco_largura
        CHECK (largura IS NULL OR largura > 0),

    CONSTRAINT chk_bloco_comprimento
        CHECK (comprimento IS NULL OR comprimento > 0),

    CONSTRAINT chk_bloco_peso
        CHECK (peso IS NULL OR peso > 0),

    CONSTRAINT chk_bloco_frente
        CHECK (
            frente IN (
                'A',
                'B',
                'C',
                'D',
                'BARRAGEM',
                'BARREIRO'
            )
        )
);


-- =========================================================
-- 4. TABELA CHAPA
-- =========================================================

CREATE TABLE chapa (
    id VARCHAR(100) PRIMARY KEY,

    -- Código da chapa
    codigo VARCHAR(50) NOT NULL UNIQUE,

    -- Bloco de origem
    blocoid VARCHAR(100) NOT NULL,

    -- Dimensões
    espessura NUMERIC(10,2),

    altura NUMERIC(10,2),

    largura NUMERIC(10,2),

    -- Tipo de acabamento
    acabamento VARCHAR(150),

    -- Situação da chapa
    status VARCHAR(20) NOT NULL DEFAULT 'DISPONIVEL',

    -- Data de cadastro
    dataCadastro DATE NOT NULL DEFAULT CURRENT_DATE,


    -- =====================================================
    -- RELACIONAMENTO COM BLOCO
    -- =====================================================

    CONSTRAINT fk_chapa_bloco
        FOREIGN KEY (blocoid)
        REFERENCES bloco(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,


    -- =====================================================
    -- REGRAS DE VALIDAÇÃO
    -- =====================================================

    CONSTRAINT chk_chapa_espessura
        CHECK (espessura IS NULL OR espessura > 0),

    CONSTRAINT chk_chapa_altura
        CHECK (altura IS NULL OR altura > 0),

    CONSTRAINT chk_chapa_largura
        CHECK (largura IS NULL OR largura > 0),

    CONSTRAINT chk_chapa_status
        CHECK (
            status IN (
                'DISPONIVEL',
                'RESERVADO',
                'VENDIDO'
            )
        )
);


-- =========================================================
-- 5. ÍNDICES
-- =========================================================

-- Pesquisas de blocos
CREATE INDEX idx_bloco_material
ON bloco(material);

CREATE INDEX idx_bloco_cor
ON bloco(cor);

CREATE INDEX idx_bloco_frente
ON bloco(frente);

CREATE INDEX idx_bloco_ano
ON bloco(ano);

CREATE INDEX idx_bloco_mes
ON bloco(mes);


-- Pesquisas de chapas
CREATE INDEX idx_chapa_blocoid
ON chapa(blocoid);

CREATE INDEX idx_chapa_status
ON chapa(status);

CREATE INDEX idx_chapa_acabamento
ON chapa(acabamento);


-- =========================================================
-- 6. USUARIO INICIAL
-- =========================================================

INSERT INTO usuario (
    id,
    nome,
    email,
    senha
)
VALUES (
    '1',
    'Administrador',
    'admin@flashview.com',
    'hashed_password_1'
);


-- =========================================================
-- 7. BLOCOS DE TESTE
-- =========================================================

INSERT INTO bloco (
    id,
    codigo,
    numero,
    material,
    cor,
    altura,
    largura,
    comprimento,
    peso,
    mes,
    ano,
    frente
)
VALUES
(
    '1',
    'BL-ZQQIJ',
    1,
    'Granito',
    'Preto',
    1.80,
    1.20,
    2.50,
    850.00,
    1,
    2026,
    'D'
),
(
    '2',
    'BL-TQQIA',
    20,
    'Granito',
    'Cinza',
    1.90,
    1.30,
    2.60,
    900.00,
    1,
    2026,
    'A'
),
(
    '3',
    'BL-QTIIV',
    12,
    'Mármore',
    'Branco',
    2.00,
    1.40,
    2.70,
    950.00,
    2,
    2026,
    'C'
);


-- =========================================================
-- 8. CHAPAS DE TESTE
-- =========================================================

INSERT INTO chapa (
    id,
    codigo,
    blocoid,
    espessura,
    altura,
    largura,
    acabamento,
    status
)
VALUES
(
    '1',
    'CH-000001',
    '1',
    2.00,
    2.50,
    1.20,
    'Polido',
    'DISPONIVEL'
),
(
    '2',
    'CH-000002',
    '1',
    2.00,
    2.50,
    1.20,
    'Escovado',
    'RESERVADO'
),
(
    '3',
    'CH-000003',
    '2',
    2.00,
    2.60,
    1.30,
    'Polido',
    'VENDIDO'
);


-- =========================================================
-- 9. CONSULTAS PARA TESTAR
-- =========================================================

-- Ver usuários
SELECT * FROM usuario;


-- Ver blocos
SELECT * FROM bloco;


-- Ver chapas
SELECT * FROM chapa;


-- Ver blocos e suas chapas
SELECT
    b.codigo AS bloco,
    b.material,
    b.cor,
    c.codigo AS chapa,
    c.acabamento,
    c.status
FROM bloco b
LEFT JOIN chapa c
    ON c.blocoid = b.id
ORDER BY b.codigo;