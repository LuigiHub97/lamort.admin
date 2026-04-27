# Lamort Admin

API para gerenciar clientes e atendimentos, com autenticacao por JWT e banco PostgreSQL.

## Tecnologias

- Node.js
- Express
- PostgreSQL
- JWT
- bcrypt
- dotenv

## Como rodar

Instale as dependencias na raiz do projeto:

```powershell
npm install
```

Crie um arquivo `.env` na raiz usando o `.env.example` como base:

```env
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=lamort
DB_PASSWORD=sua_senha_aqui
DB_PORT=5432
JWT_SECRET=sua_chave_jwt_aqui
```

Crie o banco no PostgreSQL:

```powershell
& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -h localhost -U postgres -d postgres -c "CREATE DATABASE lamort"
```

Crie as tabelas:

```powershell
& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -h localhost -U postgres -d lamort -f server/database/schema.sql
```

Suba o servidor:

```powershell
cd server
npm run dev
```

A API roda em:

```txt
http://localhost:3000/api
```

Em outro terminal, rode o frontend:

```powershell
cd client
npm install
npm run dev
```

O painel roda em:

```txt
http://localhost:5173
```

## Rotas

### Auth

```txt
POST /api/auth/register
POST /api/auth/login
```

Body de cadastro/login:

```json
{
  "email": "admin@email.com",
  "senha": "123456"
}
```

### Clientes

As rotas de clientes exigem token JWT no header:

```txt
Authorization: Bearer seu_token
```

```txt
GET /api/clientes
POST /api/clientes
PUT /api/clientes/:id
DELETE /api/clientes/:id
```

Body de cliente:

```json
{
  "nome": "Cliente Exemplo",
  "telefone": "11999999999",
  "instagram": "@cliente",
  "observacoes": "Preferencia por contato via WhatsApp"
}
```

### Atendimentos

As rotas de atendimentos tambem exigem token JWT.

```txt
GET /api/atendimentos
POST /api/atendimentos
PUT /api/atendimentos/:id
DELETE /api/atendimentos/:id
```

Body de atendimento:

```json
{
  "cliente_id": 1,
  "descricao": "Orcamento de tatuagem",
  "status": "orcamento",
  "data": "2026-04-27",
  "valor": 350.00,
  "observacoes": "Cliente pediu referencia floral"
}
```

## Status do projeto

Backend inicial com autenticacao, clientes e atendimentos. Proximas etapas planejadas:

- melhorar validacoes
- criar frontend de login
- criar telas de clientes
- criar telas de atendimentos
