--
-- PostgreSQL database dump
--

\restrict Rd2lbJITR8ofdHWWxDjJUw3QHhLkTekIxltNI3PYGAbtk381wzbigLZ5EBE015F

-- Dumped from database version 17.11
-- Dumped by pg_dump version 17.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: PapelConta; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PapelConta" AS ENUM (
    'FUNCIONARIO',
    'ADMINISTRADOR',
    'FINANCEIRO'
);


ALTER TYPE public."PapelConta" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    senha character varying(255) NOT NULL
);


ALTER TABLE public.admin OWNER TO postgres;

--
-- Name: admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_id_seq OWNER TO postgres;

--
-- Name: admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_id_seq OWNED BY public.admin.id;


--
-- Name: bloco; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bloco (
    id character varying(100) NOT NULL,
    cliente_id integer NOT NULL,
    funcionario_id character varying(100) NOT NULL,
    codigo character varying(50) NOT NULL,
    numero integer NOT NULL,
    material character varying(150),
    cor character varying(160),
    altura numeric(10,2),
    largura numeric(10,2),
    comprimento numeric(10,2),
    peso numeric(10,2),
    volume numeric(12,3) GENERATED ALWAYS AS (((altura * largura) * comprimento)) STORED,
    mes integer NOT NULL,
    ano integer NOT NULL,
    frente character varying(50) NOT NULL,
    datacadastro date DEFAULT CURRENT_DATE NOT NULL,
    CONSTRAINT chk_bloco_altura CHECK ((altura > (0)::numeric)),
    CONSTRAINT chk_bloco_ano CHECK ((ano >= 2000)),
    CONSTRAINT chk_bloco_comprimento CHECK ((comprimento > (0)::numeric)),
    CONSTRAINT chk_bloco_frente CHECK (((frente)::text = ANY ((ARRAY['A'::character varying, 'B'::character varying, 'C'::character varying, 'D'::character varying, 'BARRAGEM'::character varying, 'BARREIRO'::character varying])::text[]))),
    CONSTRAINT chk_bloco_largura CHECK ((largura > (0)::numeric)),
    CONSTRAINT chk_bloco_mes CHECK (((mes >= 1) AND (mes <= 12))),
    CONSTRAINT chk_bloco_numero CHECK (((numero >= 0) AND (numero <= 99))),
    CONSTRAINT chk_bloco_peso CHECK (((peso IS NULL) OR (peso > (0)::numeric)))
);


ALTER TABLE public.bloco OWNER TO postgres;

--
-- Name: chapa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chapa (
    id character varying(100) NOT NULL,
    cliente_id integer NOT NULL,
    funcionario_id character varying(100) NOT NULL,
    codigo character varying(50) NOT NULL,
    blocoid character varying(100) NOT NULL,
    espessura numeric(10,2),
    altura numeric(10,2),
    largura numeric(10,2),
    acabamento character varying(150),
    status character varying(20) DEFAULT 'DISPONIVEL'::character varying NOT NULL,
    datacadastro date DEFAULT CURRENT_DATE NOT NULL,
    CONSTRAINT chk_chapa_altura CHECK (((altura IS NULL) OR (altura > (0)::numeric))),
    CONSTRAINT chk_chapa_espessura CHECK (((espessura IS NULL) OR (espessura > (0)::numeric))),
    CONSTRAINT chk_chapa_largura CHECK (((largura IS NULL) OR (largura > (0)::numeric))),
    CONSTRAINT chk_chapa_status CHECK (((status)::text = ANY ((ARRAY['DISPONIVEL'::character varying, 'RESERVADO'::character varying, 'VENDIDO'::character varying])::text[])))
);


ALTER TABLE public.chapa OWNER TO postgres;

--
-- Name: cliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cliente (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    cpf character varying(11) NOT NULL,
    numero character varying(20) NOT NULL,
    CONSTRAINT chk_cliente_cpf CHECK (((cpf)::text ~ '^[0-9]{11}$'::text))
);


ALTER TABLE public.cliente OWNER TO postgres;

--
-- Name: cliente_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cliente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cliente_id_seq OWNER TO postgres;

--
-- Name: cliente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cliente_id_seq OWNED BY public.cliente.id;


--
-- Name: endereco; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.endereco (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    complemento character varying(100),
    estado character(2) NOT NULL,
    local_entrega character(3) NOT NULL,
    CONSTRAINT chk_endereco_estado CHECK ((estado ~ '^[A-Z]{2}$'::text))
);


ALTER TABLE public.endereco OWNER TO postgres;

--
-- Name: endereco_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.endereco_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.endereco_id_seq OWNER TO postgres;

--
-- Name: endereco_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.endereco_id_seq OWNED BY public.endereco.id;


--
-- Name: financeiro; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.financeiro (
    id integer NOT NULL,
    cpf character varying(11) NOT NULL,
    nome character varying(150) NOT NULL,
    email character varying(255) NOT NULL,
    senha_hash character varying(255) NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    datacadastro timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.financeiro OWNER TO postgres;

--
-- Name: financeiro_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.financeiro_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.financeiro_id_seq OWNER TO postgres;

--
-- Name: financeiro_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.financeiro_id_seq OWNED BY public.financeiro.id;


--
-- Name: funcionario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.funcionario (
    id character varying(100) NOT NULL,
    cliente_id integer NOT NULL,
    admin_id integer NOT NULL,
    nome character varying(150) NOT NULL,
    email character varying(255) NOT NULL,
    senha text NOT NULL,
    cpf character varying(11)
);


ALTER TABLE public.funcionario OWNER TO postgres;

--
-- Name: midia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.midia (
    id character varying(100) NOT NULL,
    nome character varying(255) NOT NULL,
    tipo character varying(20) NOT NULL,
    formato character varying(100) NOT NULL,
    dados bytea NOT NULL,
    blocoid character varying(100),
    chapaid character varying(100),
    datacadastro date DEFAULT CURRENT_DATE NOT NULL,
    CONSTRAINT chk_midia_origem CHECK (((blocoid IS NOT NULL) OR (chapaid IS NOT NULL))),
    CONSTRAINT chk_midia_tipo CHECK (((tipo)::text = ANY ((ARRAY['FOTO'::character varying, 'VIDEO'::character varying])::text[])))
);


ALTER TABLE public.midia OWNER TO postgres;

--
-- Name: produto_servico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produto_servico (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    tipo_id integer NOT NULL,
    nome character varying(150) NOT NULL,
    descricao text,
    preco numeric(12,2) NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    datacadastro date DEFAULT CURRENT_DATE NOT NULL,
    CONSTRAINT chk_produto_servico_preco CHECK ((preco > (0)::numeric))
);


ALTER TABLE public.produto_servico OWNER TO postgres;

--
-- Name: produto_servico_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.produto_servico_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.produto_servico_id_seq OWNER TO postgres;

--
-- Name: produto_servico_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.produto_servico_id_seq OWNED BY public.produto_servico.id;


--
-- Name: tipo_produto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_produto (
    id integer NOT NULL,
    nome character varying(50) NOT NULL
);


ALTER TABLE public.tipo_produto OWNER TO postgres;

--
-- Name: tipo_produto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipo_produto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_produto_id_seq OWNER TO postgres;

--
-- Name: tipo_produto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipo_produto_id_seq OWNED BY public.tipo_produto.id;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    cpf character varying(11) NOT NULL,
    nome character varying(150) NOT NULL,
    email character varying(255) NOT NULL,
    senha_hash character varying(255) NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    papel public."PapelConta" DEFAULT 'FUNCIONARIO'::public."PapelConta" NOT NULL,
    datacadastro timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- Name: usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_seq OWNER TO postgres;

--
-- Name: usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_seq OWNED BY public.usuario.id;


--
-- Name: venda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.venda (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    funcionario_id character varying(100),
    datavenda timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status character varying(10) DEFAULT 'ABERTA'::character varying NOT NULL,
    total numeric(12,2) DEFAULT 0 NOT NULL,
    usuario_id integer,
    financeiro_id integer,
    CONSTRAINT chk_venda_status CHECK (((status)::text = ANY ((ARRAY['ABERTA'::character varying, 'PAGA'::character varying, 'CANCELADA'::character varying])::text[]))),
    CONSTRAINT chk_venda_total CHECK ((total >= (0)::numeric)),
    CONSTRAINT venda_responsavel_check CHECK ((num_nonnulls(funcionario_id, usuario_id, financeiro_id) = 1))
);


ALTER TABLE public.venda OWNER TO postgres;

--
-- Name: venda_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.venda_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.venda_id_seq OWNER TO postgres;

--
-- Name: venda_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.venda_id_seq OWNED BY public.venda.id;


--
-- Name: venda_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.venda_item (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    venda_id integer NOT NULL,
    produto_servico_id integer NOT NULL,
    quantidade numeric(12,3) NOT NULL,
    preco_unitario numeric(12,2) NOT NULL,
    subtotal numeric(14,2) GENERATED ALWAYS AS ((quantidade * preco_unitario)) STORED,
    CONSTRAINT chk_venda_item_preco CHECK ((preco_unitario > (0)::numeric)),
    CONSTRAINT chk_venda_item_quantidade CHECK ((quantidade > (0)::numeric))
);


ALTER TABLE public.venda_item OWNER TO postgres;

--
-- Name: venda_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.venda_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.venda_item_id_seq OWNER TO postgres;

--
-- Name: venda_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.venda_item_id_seq OWNED BY public.venda_item.id;


--
-- Name: admin id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin ALTER COLUMN id SET DEFAULT nextval('public.admin_id_seq'::regclass);


--
-- Name: cliente id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente ALTER COLUMN id SET DEFAULT nextval('public.cliente_id_seq'::regclass);


--
-- Name: endereco id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.endereco ALTER COLUMN id SET DEFAULT nextval('public.endereco_id_seq'::regclass);


--
-- Name: financeiro id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financeiro ALTER COLUMN id SET DEFAULT nextval('public.financeiro_id_seq'::regclass);


--
-- Name: produto_servico id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto_servico ALTER COLUMN id SET DEFAULT nextval('public.produto_servico_id_seq'::regclass);


--
-- Name: tipo_produto id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_produto ALTER COLUMN id SET DEFAULT nextval('public.tipo_produto_id_seq'::regclass);


--
-- Name: usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);


--
-- Name: venda id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venda ALTER COLUMN id SET DEFAULT nextval('public.venda_id_seq'::regclass);


--
-- Name: venda_item id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venda_item ALTER COLUMN id SET DEFAULT nextval('public.venda_item_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
0006661d-e5ab-450b-84ae-ecf56ab1238e	9c00b4feb0d9506683de77b76d3e3d506e4821ee173b4142ef342cc366e23ae1	2026-11-12 23:01:51.351914+00	20261001000000_init_banco	\N	\N	2026-11-12 23:01:51.269199+00	1
56031f26-24e1-4426-8c81-69da06dba655	99f13d28b9376ef9d7f4cfda06fffa8b937ab88c1bd73991a1c9999f18470243	2026-11-12 23:01:51.364118+00	20261010200000_create_usuario_account	\N	\N	2026-11-12 23:01:51.353908+00	1
b37011ad-0919-49bb-8496-6e40cf0e7b2e	d19fcf73ec2a8afd9f786e7058e18794d42a9b71d7f7930bb77187f67cbc2e1c	2026-11-12 23:01:51.371991+00	20261027170000_add_admin_financeiro_roles	\N	\N	2026-11-12 23:01:51.365837+00	1
eaebe0cb-0947-434e-ba65-fe7006fec086	6a0b411d0a49c91184eb223f3eb97cd208b58bd9cfcf0e047cacbe0706b99754	2026-11-12 23:01:51.389929+00	20261027180000_add_usuario_id	\N	\N	2026-11-12 23:01:51.373837+00	1
e00a4b4d-2ae3-4bf5-8fb7-45e768b758e0	587287fd0db21e7e559399786404a22b49dc08e96dec1f7905aedcb2fc730b8c	2026-11-12 23:01:51.408104+00	20261028150000_add_venda_usuario	\N	\N	2026-11-12 23:01:51.392244+00	1
5d91be53-b749-413c-8f97-101ebc9c4b90	8abfece683ddb09305211e9da553a04580abc6e5403b8cce9786dd230ec8460d	2026-11-12 23:01:51.424481+00	20261029000000_sync_funcionario_cpf	\N	\N	2026-11-12 23:01:51.410202+00	1
19ea22ec-f2c3-4911-85bd-0d0af3b8ef59	b69f9bd01d30b0b7f4d564dddcb7303df571214dbd4d0ad1659d8401a69d57b4	2026-11-12 23:01:51.447073+00	20261030100000_separate_financeiro_account	\N	\N	2026-11-12 23:01:51.426371+00	1
88fabcd7-8a79-4c7f-9778-4bbc2a74ba7a	48ae8321fc7d0761d5a5b2f20f17f23ae5905de7183bfeef780bc3747775d808	\N	20261112230211	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20261112230211\n\nDatabase error code: 42601\n\nDatabase error:\nERROR: column "volume" of relation "bloco" is a generated column\nHINT: Use ALTER TABLE ... ALTER COLUMN ... DROP EXPRESSION instead.\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E42601), message: "column \\"volume\\" of relation \\"bloco\\" is a generated column", detail: None, hint: Some("Use ALTER TABLE ... ALTER COLUMN ... DROP EXPRESSION instead."), position: None, where_: None, schema: None, table: None, column: None, datatype: None, constraint: None, file: Some("tablecmds.c"), line: Some(7951), routine: Some("ATExecColumnDefault") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20261112230211"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name="20261112230211"\n             at schema-engine/commands/src/commands/apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:260	2026-11-12 23:06:09.555936+00	2026-11-12 23:02:11.168119+00	0
\.


--
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin (id, nome, email, senha) FROM stdin;
\.


--
-- Data for Name: bloco; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bloco (id, cliente_id, funcionario_id, codigo, numero, material, cor, altura, largura, comprimento, peso, mes, ano, frente, datacadastro) FROM stdin;
\.


--
-- Data for Name: chapa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chapa (id, cliente_id, funcionario_id, codigo, blocoid, espessura, altura, largura, acabamento, status, datacadastro) FROM stdin;
\.


--
-- Data for Name: cliente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cliente (id, nome, cpf, numero) FROM stdin;
\.


--
-- Data for Name: endereco; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.endereco (id, cliente_id, complemento, estado, local_entrega) FROM stdin;
\.


--
-- Data for Name: financeiro; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.financeiro (id, cpf, nome, email, senha_hash, ativo, datacadastro) FROM stdin;
\.


--
-- Data for Name: funcionario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.funcionario (id, cliente_id, admin_id, nome, email, senha, cpf) FROM stdin;
\.


--
-- Data for Name: midia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.midia (id, nome, tipo, formato, dados, blocoid, chapaid, datacadastro) FROM stdin;
\.


--
-- Data for Name: produto_servico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.produto_servico (id, cliente_id, tipo_id, nome, descricao, preco, ativo, datacadastro) FROM stdin;
\.


--
-- Data for Name: tipo_produto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_produto (id, nome) FROM stdin;
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (cpf, nome, email, senha_hash, ativo, papel, datacadastro, id) FROM stdin;
\.


--
-- Data for Name: venda; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.venda (id, cliente_id, funcionario_id, datavenda, status, total, usuario_id, financeiro_id) FROM stdin;
\.


--
-- Data for Name: venda_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.venda_item (id, cliente_id, venda_id, produto_servico_id, quantidade, preco_unitario) FROM stdin;
\.


--
-- Name: admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_id_seq', 1, false);


--
-- Name: cliente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cliente_id_seq', 1, false);


--
-- Name: endereco_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.endereco_id_seq', 1, false);


--
-- Name: financeiro_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.financeiro_id_seq', 1, false);


--
-- Name: produto_servico_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.produto_servico_id_seq', 1, false);


--
-- Name: tipo_produto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipo_produto_id_seq', 1, false);


--
-- Name: usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_seq', 1, false);


--
-- Name: venda_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.venda_id_seq', 1, false);


--
-- Name: venda_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.venda_item_id_seq', 1, false);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: admin admin_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_email_key UNIQUE (email);


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);


--
-- Name: bloco bloco_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bloco
    ADD CONSTRAINT bloco_codigo_key UNIQUE (codigo);


--
-- Name: bloco bloco_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bloco
    ADD CONSTRAINT bloco_pkey PRIMARY KEY (id);


--
-- Name: chapa chapa_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapa
    ADD CONSTRAINT chapa_codigo_key UNIQUE (codigo);


--
-- Name: chapa chapa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapa
    ADD CONSTRAINT chapa_pkey PRIMARY KEY (id);


--
-- Name: cliente cliente_cpf_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_cpf_key UNIQUE (cpf);


--
-- Name: cliente cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id);


--
-- Name: endereco endereco_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.endereco
    ADD CONSTRAINT endereco_pkey PRIMARY KEY (id);


--
-- Name: financeiro financeiro_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financeiro
    ADD CONSTRAINT financeiro_pkey PRIMARY KEY (id);


--
-- Name: funcionario funcionario_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT funcionario_email_key UNIQUE (email);


--
-- Name: funcionario funcionario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT funcionario_pkey PRIMARY KEY (id);


--
-- Name: midia midia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.midia
    ADD CONSTRAINT midia_pkey PRIMARY KEY (id);


--
-- Name: produto_servico produto_servico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto_servico
    ADD CONSTRAINT produto_servico_pkey PRIMARY KEY (id);


--
-- Name: tipo_produto tipo_produto_nome_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_produto
    ADD CONSTRAINT tipo_produto_nome_key UNIQUE (nome);


--
-- Name: tipo_produto tipo_produto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_produto
    ADD CONSTRAINT tipo_produto_pkey PRIMARY KEY (id);


--
-- Name: funcionario uq_funcionario_cliente_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT uq_funcionario_cliente_id UNIQUE (cliente_id, id);


--
-- Name: produto_servico uq_produto_servico_cliente_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto_servico
    ADD CONSTRAINT uq_produto_servico_cliente_id UNIQUE (cliente_id, id);


--
-- Name: venda uq_venda_cliente_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venda
    ADD CONSTRAINT uq_venda_cliente_id UNIQUE (cliente_id, id);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (cpf);


--
-- Name: venda_item venda_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venda_item
    ADD CONSTRAINT venda_item_pkey PRIMARY KEY (id);


--
-- Name: venda venda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venda
    ADD CONSTRAINT venda_pkey PRIMARY KEY (id);


--
-- Name: financeiro_cpf_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX financeiro_cpf_key ON public.financeiro USING btree (cpf);


--
-- Name: financeiro_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX financeiro_email_key ON public.financeiro USING btree (email);


--
-- Name: funcionario_cpf_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX funcionario_cpf_key ON public.funcionario USING btree (cpf);


--
-- Name: idx_bloco_ano; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bloco_ano ON public.bloco USING btree (ano);


--
-- Name: idx_bloco_cliente_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bloco_cliente_id ON public.bloco USING btree (cliente_id);


--
-- Name: idx_bloco_cor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bloco_cor ON public.bloco USING btree (cor);


--
-- Name: idx_bloco_frente; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bloco_frente ON public.bloco USING btree (frente);


--
-- Name: idx_bloco_funcionario_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bloco_funcionario_id ON public.bloco USING btree (funcionario_id);


--
-- Name: idx_bloco_material; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bloco_material ON public.bloco USING btree (material);


--
-- Name: idx_bloco_mes; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bloco_mes ON public.bloco USING btree (mes);


--
-- Name: idx_chapa_acabamento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_chapa_acabamento ON public.chapa USING btree (acabamento);


--
-- Name: idx_chapa_blocoid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_chapa_blocoid ON public.chapa USING btree (blocoid);


--
-- Name: idx_chapa_cliente_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_chapa_cliente_id ON public.chapa USING btree (cliente_id);


--
-- Name: idx_chapa_funcionario_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_chapa_funcionario_id ON public.chapa USING btree (funcionario_id);


--
-- Name: idx_chapa_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_chapa_status ON public.chapa USING btree (status);


--
-- Name: idx_endereco_cliente_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_endereco_cliente_id ON public.endereco USING btree (cliente_id);


--
-- Name: idx_funcionario_admin_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_funcionario_admin_id ON public.funcionario USING btree (admin_id);


--
-- Name: idx_funcionario_cliente_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_funcionario_cliente_id ON public.funcionario USING btree (cliente_id);


--
-- Name: idx_produto_servico_cliente_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_produto_servico_cliente_id ON public.produto_servico USING btree (cliente_id);


--
-- Name: idx_produto_servico_tipo_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_produto_servico_tipo_id ON public.produto_servico USING btree (tipo_id);


--
-- Name: idx_venda_cliente_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_venda_cliente_id ON public.venda USING btree (cliente_id);


--
-- Name: idx_venda_data; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_venda_data ON public.venda USING btree (datavenda);


--
-- Name: idx_venda_financeiro_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_venda_financeiro_id ON public.venda USING btree (financeiro_id);


--
-- Name: idx_venda_funcionario_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_venda_funcionario_id ON public.venda USING btree (funcionario_id);


--
-- Name: idx_venda_item_produto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_venda_item_produto ON public.venda_item USING btree (cliente_id, produto_servico_id);


--
-- Name: idx_venda_item_venda_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_venda_item_venda_id ON public.venda_item USING btree (cliente_id, venda_id);


--
-- Name: idx_venda_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_venda_status ON public.venda USING btree (status);


--
-- Name: idx_venda_usuario_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_venda_usuario_id ON public.venda USING btree (usuario_id);


--
-- Name: usuario_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX usuario_email_key ON public.usuario USING btree (email);


--
-- Name: usuario_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX usuario_id_key ON public.usuario USING btree (id);


--
-- Name: bloco fk_bloco_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bloco
    ADD CONSTRAINT fk_bloco_cliente FOREIGN KEY (cliente_id) REFERENCES public.cliente(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: bloco fk_bloco_funcionario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bloco
    ADD CONSTRAINT fk_bloco_funcionario FOREIGN KEY (cliente_id, funcionario_id) REFERENCES public.funcionario(cliente_id, id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: chapa fk_chapa_bloco; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapa
    ADD CONSTRAINT fk_chapa_bloco FOREIGN KEY (blocoid) REFERENCES public.bloco(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: chapa fk_chapa_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapa
    ADD CONSTRAINT fk_chapa_cliente FOREIGN KEY (cliente_id) REFERENCES public.cliente(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: chapa fk_chapa_funcionario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapa
    ADD CONSTRAINT fk_chapa_funcionario FOREIGN KEY (cliente_id, funcionario_id) REFERENCES public.funcionario(cliente_id, id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: endereco fk_endereco_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.endereco
    ADD CONSTRAINT fk_endereco_cliente FOREIGN KEY (cliente_id) REFERENCES public.cliente(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: funcionario fk_funcionario_admin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT fk_funcionario_admin FOREIGN KEY (admin_id) REFERENCES public.admin(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: funcionario fk_funcionario_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT fk_funcionario_cliente FOREIGN KEY (cliente_id) REFERENCES public.cliente(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: midia fk_midia_bloco; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.midia
    ADD CONSTRAINT fk_midia_bloco FOREIGN KEY (blocoid) REFERENCES public.bloco(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: midia fk_midia_chapa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.midia
    ADD CONSTRAINT fk_midia_chapa FOREIGN KEY (chapaid) REFERENCES public.chapa(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: produto_servico fk_produto_servico_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto_servico
    ADD CONSTRAINT fk_produto_servico_cliente FOREIGN KEY (cliente_id) REFERENCES public.cliente(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: produto_servico fk_produto_servico_tipo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto_servico
    ADD CONSTRAINT fk_produto_servico_tipo FOREIGN KEY (tipo_id) REFERENCES public.tipo_produto(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: venda fk_venda_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venda
    ADD CONSTRAINT fk_venda_cliente FOREIGN KEY (cliente_id) REFERENCES public.cliente(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: venda fk_venda_financeiro; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venda
    ADD CONSTRAINT fk_venda_financeiro FOREIGN KEY (financeiro_id) REFERENCES public.financeiro(id);


--
-- Name: venda fk_venda_funcionario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venda
    ADD CONSTRAINT fk_venda_funcionario FOREIGN KEY (funcionario_id) REFERENCES public.funcionario(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: venda_item fk_venda_item_produto_servico; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venda_item
    ADD CONSTRAINT fk_venda_item_produto_servico FOREIGN KEY (cliente_id, produto_servico_id) REFERENCES public.produto_servico(cliente_id, id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: venda_item fk_venda_item_venda; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venda_item
    ADD CONSTRAINT fk_venda_item_venda FOREIGN KEY (cliente_id, venda_id) REFERENCES public.venda(cliente_id, id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: venda fk_venda_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venda
    ADD CONSTRAINT fk_venda_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict Rd2lbJITR8ofdHWWxDjJUw3QHhLkTekIxltNI3PYGAbtk381wzbigLZ5EBE015F

