
SELECT * FROM usuario;

SELECT * FROM bloco;

SELECT * FROM chapa;

SELECT
    b.codigo AS bloco,
    b.material,
    b.cor,
    c.codigo AS chapa,
    c.acabamento,
    b.volume,
    c.status
FROM bloco b
LEFT JOIN chapa c
    ON c.blocoid = b.id
ORDER BY b.codigo;

SELECT
    b.codigo AS bloco,
    b.volume,
    m.nome AS arquivo,
    m.tipo,
    m.formato
FROM bloco b
LEFT JOIN midia m
    ON m.blocoid = b.id;