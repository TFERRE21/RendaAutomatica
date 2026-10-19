# Renda Automática AI

Plataforma para comercialização de produtos digitais com automação de tarefas, acompanhamento financeiro e integrações de pagamento.

## Stack inicial

- Next.js + TypeScript
- PostgreSQL + Prisma
- Redis para tarefas assíncronas
- Docker Compose
- Adaptadores de pagamento preparados para Asaas e Stripe

## Estado do projeto

Esta é a primeira base documental do repositório. Integrações externas e fluxos financeiros devem permanecer em modo de teste até configurarem credenciais reais e validarem webhooks.

## Requisitos

- Node.js 22+
- Docker e Docker Compose

## Configuração

1. Copie `.env.example` para `.env`.
2. Configure senhas e chaves de API no ambiente local (nunca faça commit dessas credenciais).
3. Inicialize os serviços com `docker compose up -d`.
4. Instale dependências com `npm install`.
5. Gere o cliente do banco e aplique migrações conforme os scripts do projeto.

## Segurança

Nunca libere produtos com base apenas em uma URL de retorno do checkout. A confirmação deve ocorrer no backend, após validação da origem e autenticidade do evento e tratamento idempotente. Não coloque segredos no frontend ou no repositório.
