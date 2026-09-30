INSERT INTO midia (
	id,
	nome,
	tipo,
	formato,
	dados,
	blocoid,
	chapaid
)
VALUES (
	'1',
	'bloco-1.gif',
	'FOTO',
	'image/gif',
	decode('R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=', 'base64'),
	'1',
	NULL
),
(
	'2',
	'chapa-1.gif',
	'FOTO',
	'image/gif',
	decode('R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=', 'base64'),
	NULL,
	'1'
);
