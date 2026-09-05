# Contexto

Este projeto é uma proposta da empresa
 **Ingá Granitos do Nordeste** 

Seu trabalho acontece em setores privados de pedreiras que contém pedras retiradas e formadas como blocos ou chapas. Com isso, eles focam extração e comercialização de blocos brutos e formação de chapas de granito através desse processo:

- Extração na Jazida
- Desdobramento em Chapas
- Venda e Distribuição B2B
- Transformação em diversas peças de alto padrão

( Pisos de áreas sociais internas, Bancadas de cozinha, Painéis de parede retroiluminados, lavatórios de luxo, etc…)

## Sobre o Projeto

O projeto começa a partir do cadastro desses blocos e chapas, onde eles recebem um código próprio para identificação e, em seguida, salvam-se todos os dados em um programa.

Entretanto, a empresa já relatarou que esse sistema se encontra desatualizado e **carece de funcionalidades para** adicionar blocos e chapas de forma mais direta e organizada.

## Por que Flash View?

O **Flash View** foi escolhido como proposta de sistema por oferecer uma forma mais rápida, organizada e intuitiva de gerenciar os blocos e chapas da empresa. A plataforma busca facilitar o cadastro, a consulta e a atualização dos produtos, além de automatizar a geração dos códigos de identificação.

Com uma interface simples e informações centralizadas, o sistema permite que os funcionários encontrem os produtos com mais facilidade e tenham uma visão rápida do estoque e de seus principais dados. Dessa forma, o **Flash View** contribui para tornar o processo de gerenciamento mais eficiente, reduzindo tarefas manuais e possíveis erros no cadastro das informações.


# Integrantes

- Eduardo Nunes
- Heros Henrique
- Jonas Adriano
- Ronald Willy

# Divisão de temas

Cada pessoa do grupo tem uma área própria para desenvolver, aplicar e apresentar no dia de demonstração do projeto.

Iremos criar um repositório no Github para o projeto, onde cada um terá sua própria pasta para concluir sua parte e depois juntar tudo em uma pasta Principal (Main).


| Área | Aplicação | Responsável |
| --- | --- | --- |
| **Frontend** | Telas, formulários, tabelas, filtros, dashboard |  |
| **Backend** | API, autenticação, regras de negócio, códigos, validações |  |
| **Banco** | PostgreSQL, entidades, relacionamentos, migrations |  |
| **Integração** | Conectar frontend com API e testar o sistema completo |  |

## Funcionalidades principais

1. **Autenticação e Dashboard** 
    - Cadastro de Usuário.
    - Login.
    - Recuperação de senha (opcional).
    - Quantidade total de blocos.
    - Quantidade total de chapas.
    - Últimos itens cadastrados.
    - Estatísticas rápidas.
    - Carregar Imagem dos blocos e chapas
    - Criação de um código para o bloco ou chapa

2. **Gerenciamento de Blocos** 
    - Cadastrar bloco.
    - Editar.
    - Excluir.
    - Listar.
    - Pesquisar por código, tipo ou material.

3. **Gerenciamento de Chapas**
    - Cadastrar chapa.
    - Editar.
    - Excluir.
    - Listar.
    - Relacionar a um bloco (caso a chapa seja produzida a partir dele).

4.  **Filtros**
    - Material (granito, mármore etc.).
    - Cor
    - Espessura
    - Dimensões
    - Status(Disponível, Reservado, Vendido)

---

## Exemplo de entidades

### Usuário

```
id
nome
email
senha
```

### Bloco

```
id
codigo
material
cor
altura
largura
comprimento
peso
dataCadastro
```

### Chapa

```
id
codigo
blocoId
espessura
altura
largura
acabamento
status
dataCadastro
```

---

## Fluxo do usuário

---

```
Cadastro
      │
      ▼
Login
      │
      ▼
Dashboard
      │
 ┌────┴─────┐
 ▼          ▼
Blocos    Chapas
 │          │
Cadastrar   Cadastrar
Editar      Editar
Excluir     Excluir
Pesquisar   Pesquisar
```

## Tecnologias de uso

- **Frontend:** HTML, CSS e JavaScript (ou Vue.js).
- **Backend:** NestJS + TypeScript.
- **Banco de dados:** PostgreSQL.
- **ORM (conecta códigos orientados a objetos a bancos de dados):** TypeORM.
- **Ferramentas:** Git, Github e npm
- **Containerização:** Docker e Docker Compose

---

# Frontend

```jsx
Login
│
▼
Dashboard
│
├── Blocos
│    ├── Listar
│    ├── Cadastrar
│    ├── Editar
│    └── Visualizar
│
├── Chapas
│    ├── Listar
│    ├── Cadastrar
│    ├── Editar
│    └── Visualizar
│
└── Usuários
├── Listar
└── Cadastrar
```

# Dashboard

```jsx
┌─────────────────────────────────────┐
│ Total de Blocos     150             │
│ Total de Chapas     823             │
│ Disponíveis         430             │
│ Vendidas            273             │
└─────────────────────────────────────┘
Últimos cadastrados
──────────────────────────────────────
Código       Tipo       Data
BL-000125    Bloco      04/09/2026
CH-000891    Chapa      04/09/2026
```

# Endpoints ( Backend)

### 1. Autenticação

```jsx
POST   /auth/register
POST   /auth/login
GET    /auth/me
POST   /auth/forgot-password
POST   /auth/reset-password
```

### 2. Blocos

```jsx
POST   /blocos
GET    /blocos
GET    /blocos/:id
PATCH  /blocos/:id
DELETE /blocos/:id
```

### 3. Listagem + Filtros

```jsx
GET /blocos/por-material
GET /blocos/por-cor
GET /blocos/por-status
GET /blocos/por-codigo
GET /blocos/:id/chapas
```

### 3. Chapas

```jsx
POST   /chapas
GET    /chapas
GET    /chapas/:id
PATCH  /chapas/:id
DELETE /chapas/:id
```

### 4. Usuários

```jsx
GET    /usuarios
GET    /usuarios/:id
POST   /usuarios
PATCH  /usuarios/:id
DELETE /usuarios/:id
```

### 5. Dashboard

```jsx
GET /dashboard/resumo
GET /dashboard/ultimos
GET /dashboard/estatisticas
```

#### Exemplo de Retorno no Dashbord ( GET /dashboard/resumo )

```jsx
{
"totalBlocos": 150,
"totalChapas": 823,
"chapasDisponiveis": 430,
"chapasReservadas": 120,
"chapasVendidas": 273
}
```

 

## Estrutura do Projeto NestJS

```jsx
src/
│
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── guards/
│   └── dto/
│
├── usuarios/
│   ├── usuarios.controller.ts
│   ├── usuarios.service.ts
│   ├── entities/
│   └── dto/
│
├── blocos/
│   ├── blocos.controller.ts
│   ├── blocos.service.ts
│   ├── entities/
│   └── dto/
│
├── chapas/
│   ├── chapas.controller.ts
│   ├── chapas.service.ts
│   ├── entities/
│   └── dto/
│
├── dashboard/
│   ├── dashboard.controller.ts
│   └── dashboard.service.ts
│
└── app.module.ts
```

# Banco de Dados

```jsx
database/
│
├── migrations/
│
├── seeds/
│
└── schema/
├── usuario
├── bloco
├── chapa
└── imagem
```

# Estrutura geral do projeto

```jsx
flash-view/
│
├── frontend/
│
├── backend/
│
├── database/
│
├── docs/
│   ├── arquitetura.md
│   ├── endpoints.md
│   └── banco-de-dados.md
│
├── docker-compose.yml
│
└── README.md
```

# Instalação

## **1. Clone o repositório**

```
git clone https://github.com/Heros919/flash_view.git
```

Entre na pasta

```
cd flash_view
```

---

## **2. Configure as variáveis de ambiente**

Crie um arquivo

```
.env
```

Utilizando o modelo abaixo.

---

## **3. Inicie os containers**

Execute o comando abaixo para construir as imagens e iniciar os serviços:

```
docker compose up --build
```

---

## **Acesse a aplicação**

Após a inicialização, a API estará disponível em:

```
http://localhost:3000
```

---

## **5. Encerrar a aplicação**

```
docker compose down
```

# **Licença**

Este projeto foi desenvolvido para fins acadêmicos.