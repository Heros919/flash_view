
SELECT * FROM funcionario;

SELECT * FROM cliente;

SELECT * FROM produto_servico;

SELECT * FROM venda;

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

SELECT
    v.id AS venda_id,
    v.dataVenda,
    v.status,
    c.nome AS cliente,
    f.nome AS funcionario,
    vi.id AS item_id,
    tp.nome AS tipo,
    ps.nome AS produto_servico,
    vi.quantidade,
    vi.preco_unitario,
    vi.subtotal,
    v.total AS total_registrado,
    COALESCE(
        SUM(vi.subtotal) OVER (PARTITION BY v.cliente_id, v.id),
        0
    ) AS total_calculado,
    CASE
        WHEN v.total = COALESCE(
            SUM(vi.subtotal) OVER (PARTITION BY v.cliente_id, v.id),
            0
        ) THEN 'OK'
        ELSE 'DIVERGENTE'
    END AS conferencia_total
FROM venda v
LEFT JOIN cliente c
    ON c.id = v.cliente_id
LEFT JOIN funcionario f
    ON f.cliente_id = v.cliente_id
   AND f.id = v.funcionario_id
LEFT JOIN venda_item vi
    ON vi.cliente_id = v.cliente_id
   AND vi.venda_id = v.id
LEFT JOIN produto_servico ps
    ON ps.cliente_id = vi.cliente_id
   AND ps.id = vi.produto_servico_id
LEFT JOIN tipo_produto tp
    ON tp.id = ps.tipo_id
ORDER BY v.id, vi.id;

