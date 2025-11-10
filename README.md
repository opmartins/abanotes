# ABA Notes 📝

<div align="center">
  <img src="web/public/favicon.svg" alt="ABA Notes Logo" width="120" height="120" />
  <h3>Sistema de Gerenciamento de Prontuários ABA</h3>
  <p>Plataforma moderna para clínicas de terapia ABA (Applied Behavior Analysis)</p>
</div>

---

## 📋 Descrição

**ABA Notes** é uma aplicação web moderna desenvolvida para clínicas de terapia ABA (Applied Behavior Analysis). O sistema permite o armazenamento e gerenciamento eficiente de relatórios e prontuários, facilitando o acompanhamento do desenvolvimento de crianças em terapia comportamental.

### ✨ Funcionalidades

- 📊 **Dashboard**: Visão geral com métricas e estatísticas
- 📈 **Relatórios**: Geração e visualização de relatórios de progresso
- 📋 **Prontuários**: Gerenciamento completo de registros de pacientes
- 🔐 **Autenticação**: Sistema seguro de login e autorização
- 📱 **Responsivo**: Interface adaptável para desktop, tablet e mobile
- 🌙 **Dark Mode**: Suporte automático para modo escuro

## 🎨 Identidade Visual

- **Cores**: Indigo (#4F46E5) e Teal (#14B8A6)
- **Logo**: Nota com gradiente moderno
- **Design**: Limpo, profissional e acessível

Veja mais detalhes em [BRAND.md](BRAND.md)

## Tecnologias Utilizadas
- **Backend**: Node.js com Express
- **Frontend**: React com Vite
- **Banco de Dados**: Prisma
- **Autenticação**: Middleware personalizado
- **Testes**: Jest
- **Containerização**: Docker
- **CI/CD**: GitHub Actions
- **Infraestrutura**: Terraform
- **Serviço de Nuvem**: (escolha uma opção, como AWS, Azure, Google Cloud)

## Estrutura do Projeto
```
abanotes
├── server                # Código do servidor (API REST)
│   ├── src              # Código-fonte
│   ├── prisma           # Configuração do Prisma
│   ├── tests            # Testes unitários
│   ├── package.json     # Dependências do servidor
│   └── Dockerfile       # Dockerfile do servidor
├── web                  # Código do frontend
│   ├── src              # Código-fonte
│   ├── static           # Recursos estáticos (publicDir do Vite)
│   ├── package.json     # Dependências do frontend
│   └── Dockerfile       # Dockerfile do frontend
├── infra                # Infraestrutura
│   ├── docker           # Configuração do Docker
│   └── terraform        # Configuração do Terraform
├── .github              # Configurações do GitHub Actions
├── docker-compose.yml   # Configuração do Docker Compose
└── README.md            # Documentação do projeto
```

## Instruções de Configuração

### Pré-requisitos
- Docker
- Docker Compose
- (Opcional) Node.js e npm, caso queira rodar fora de containers

### Subir localmente com Docker Compose (recomendado)
1) Crie o arquivo `.env` na raiz (ou copie de `.env.example`):
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=abanotes
DATABASE_URL=postgresql://postgres:postgres@db:5432/abanotes?schema=public
JWT_SECRET=local-dev-secret
```

2) Suba os containers:
```zsh
docker compose up -d --build
```

3) (Primeira vez) Rode as migrações do Prisma dentro do container do backend:
```zsh
docker compose exec server npx prisma migrate dev --name init
```

4) Acesse:
- Frontend: http://localhost:8080
- Backend (API): http://localhost:3000

### Script de automação (opcional)
Use o script abaixo para subir tudo, aguardar o Postgres ficar saudável e aplicar migrações automaticamente:

```zsh
bash scripts/dev.sh         # sobe e aplica migrações
bash scripts/dev.sh --build # sobe reconstruindo imagens
```

Seed opcional:

```zsh
RUN_SEED=true bash scripts/dev.sh --build
```

### Script de automação (opcional)
Para subir tudo, aguardar o Postgres ficar saudável e aplicar migrações automaticamente, use:

```zsh
bash scripts/dev.sh         # sobe e aplica migrações
bash scripts/dev.sh --build # sobe reconstruindo imagens
```

O script imprime as URLs finais e um teste rápido do healthcheck da API.

### Rodar sem Docker (opcional, dev)
Backend:
```zsh
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start
```

Frontend:
```zsh
cd web
npm install
npm run dev
```

### CI/CD
Há um workflow em `.github/workflows/ci-cd.yml` que faz:
- Testes e build (backend e frontend)
- Build e push das imagens Docker para GHCR
- (Opcional) `terraform apply` para provisionar/atualizar infra na AWS

Para usar o deploy na AWS, configure os secrets `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY` no repositório e ajuste os `-var` das imagens no `terraform plan/apply` (ver `infra/terraform`).

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença
Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.