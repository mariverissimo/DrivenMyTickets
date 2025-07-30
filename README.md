# MyTickets API

API para gerenciamento de eventos e tickets, desenvolvida com Node.js, Express, TypeScript e Prisma, utilizando PostgreSQL como banco de dados.

---

## Tecnologias

- Node.js (versão > 20.x)
- Express
- TypeScript
- Prisma (ORM)
- PostgreSQL
- Jest + Supertest para testes
- Faker para geração de dados fake em testes

---

## Instalação

1. Clone o repositório:

git clone https://github.com/seuusuario/mytickets.git
cd mytickets
Instale as dependências:

npm install
Configure o banco de dados:

Crie dois bancos no PostgreSQL:

mytickets (para desenvolvimento)

mytickets_test (para testes)

Configure os arquivos .env e .env.test na raiz do projeto:

ini
# .env
DATABASE_URL=postgres://postgres:senha@localhost:5432/mytickets
PORT=5000

# .env.test
DATABASE_URL=postgres://postgres:senha@localhost:5432/mytickets_test
PORT=5000
Rode as migrations:

npm run migration:run
Scripts úteis
Iniciar a aplicação em modo desenvolvimento:

npm run dev
Iniciar a aplicação (rodando migrations e seed):

npm start
Rodar testes:

npm test
Rodar testes com relatório de cobertura:

npm run test:coverage
Resetar o banco de testes (limpar dados e rodar migrations):

npm run test:setup

Estrutura do projeto
/src

/controllers - camada que lida com rotas e requisições HTTP

/services - lógica de negócio

/repositories - comunicação com banco de dados via Prisma

/schemas - validação de dados com Joi

/middlewares - middlewares para erros, validação, etc

/routers - definição das rotas

/utils - funções auxiliares

/tests - testes de integração organizados por entidade

Testes
Os testes utilizam Jest + Supertest.

Faker gera dados fake para os cenários.

Os testes cobrem todas as rotas de tickets e eventos.

É garantida cobertura superior a 90%.

Ambiente de teste utiliza banco dedicado configurado no .env.test.

Observações
Não modifique a implementação da aplicação, exceto para adicionar testes.

Mantenha seu ambiente configurado com Node.js versão 20 ou superior.

