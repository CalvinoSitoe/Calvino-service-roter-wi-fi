# Calvino Service - Router Wi-Fi

Este repositório contém um protótipo de aplicação para gerenciar um roteador Wi‑Fi via API HTTP/REST.

Arquitetura:
- Backend: Node.js + Express
- Banco: SQLite (protótipo)
- Frontend: interface web estática (página simples)
- Integração com roteador: via HTTP/REST (configurável via variáveis de ambiente)

Principais comandos

- Instalar dependências:
  npm install

- Criar admin seed (usa variáveis de ambiente `ADMIN_USER` e `ADMIN_PASSWORD`):
  npm run seed

- Rodar em desenvolvimento:
  npm run dev

- Rodar em produção:
  npm start

Docker

- Dockerfile incluso para rodar a aplicação.

Variáveis de ambiente (adicione um arquivo .env local a partir do .env.example):
- ADMIN_USER - nome do usuário admin que será criado pelo seed
- ADMIN_PASSWORD - senha do admin (somente local/no ambiente)
- JWT_SECRET - segredo para assinar tokens JWT
- ROUTER_BASE_URL - URL base do roteador (ex.: http://192.168.0.1)
- ROUTER_USERNAME - usuário para autenticação com o roteador
- ROUTER_PASSWORD - senha para autenticação com o roteador

Segurança e notas importantes
- Nunca comite senhas ou chaves no repositório.
- Configure firewall para limitar acesso à aplicação e ao roteador.
- Revogue credenciais caso haja suspeita de exposição.

Veja mais detalhes no README abaixo e no SECURITY.md do projeto.
