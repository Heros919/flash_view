-- Ver usuários
SELECT * FROM usuario;

-- Ver blocos
SELECT * FROM bloco;

-- Ver chapas
SELECT * FROM chapa;

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
