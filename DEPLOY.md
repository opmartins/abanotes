# Deploy para Google Cloud Run - Guia Completo

Este guia explica **PASSO A PASSO** como configurar o deploy automático da aplicação **ABA Notes** para Google Cloud Run.

## 📋 Pré-requisitos

- [ ] Conta Google (Gmail)
- [ ] Cartão de crédito (para ativar Google Cloud - mas usaremos free tier)
- [ ] Repositório GitHub do projeto
- [ ] Terminal com `gcloud` CLI instalado (vou ensinar a instalar)

---

## 🚀 PARTE 1: Configurar Google Cloud (15 minutos)

### Passo 1.1: Criar Conta e Projeto no Google Cloud

1. **Acesse**: https://console.cloud.google.com
2. **Faça login** com sua conta Google
3. **Aceite os termos** e clique em "Concordar e Continuar"
4. **Ative o free trial** (US$ 300 de crédito grátis por 90 dias)
   - Clique em "Ativar" no banner azul no topo
   - Preencha seus dados e informações de pagamento
   - **NÃO SE PREOCUPE**: Não será cobrado automaticamente após o trial

5. **Criar novo projeto**:
   - Clique no seletor de projeto no topo (ao lado de "Google Cloud")
   - Clique em "NOVO PROJETO"
   - Nome do projeto: `abanotes-production`
   - Anote o **Project ID** (será algo como `abanotes-production-423819`)
   - Clique em "CRIAR"
   - Aguarde 10-20 segundos
   - Selecione o projeto criado

### Passo 1.2: Habilitar APIs Necessárias

1. **Vá para a página de APIs**:
   - Menu (☰) → APIs e serviços → Biblioteca
   - OU acesse: https://console.cloud.google.com/apis/library

2. **Habilite estas APIs** (pesquise e clique em "ATIVAR" em cada uma):
   
   **a) Cloud Run API**
   - Pesquise: "Cloud Run API"
   - Clique no resultado
   - Clique em "ATIVAR"
   - Aguarde 30 segundos
   
   **b) Container Registry API**
   - Volte para Biblioteca
   - Pesquise: "Container Registry API"
   - Clique em "ATIVAR"
   
   **c) Secret Manager API**
   - Pesquise: "Secret Manager API"
   - Clique em "ATIVAR"
   
   **d) Cloud Build API**
   - Pesquise: "Cloud Build API"
   - Clique em "ATIVAR"

   ✅ **Confirmação**: Menu → APIs e serviços → Painel → Você deve ver 4 APIs ativadas

### Passo 1.3: Instalar Google Cloud CLI

**No macOS (seu caso):**

```bash
# Instalar via Homebrew (recomendado)
brew install --cask google-cloud-sdk

# OU via instalador direto
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

**Verificar instalação:**
```bash
gcloud --version
# Deve mostrar: Google Cloud SDK 450.0.0 ou superior
```

**Fazer login:**
```bash
gcloud auth login
```
- Uma janela do navegador abrirá
- Faça login com sua conta Google
- Autorize o acesso

**Configurar projeto padrão:**
```bash
# Substitua PROJECT_ID pelo ID do seu projeto (ex: abanotes-production-423819)
gcloud config set project PROJECT_ID

# Verificar
gcloud config get-value project
```

### Passo 1.4: Criar Service Account para GitHub Actions

**O que é Service Account?** É uma "conta de robô" que o GitHub Actions usará para fazer deploy.

```bash
# 1. Definir variáveis (substitua PROJECT_ID)
export PROJECT_ID="abanotes-production-423819"  # ← SEU PROJECT ID AQUI
export SA_NAME="github-actions-deployer"
export SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

# 2. Criar a service account
gcloud iam service-accounts create ${SA_NAME} \
  --display-name="GitHub Actions Deployer" \
  --description="Service account para deploy automático via GitHub Actions" \
  --project=${PROJECT_ID}

# ✅ Confirme que foi criado:
gcloud iam service-accounts list
```

**Adicionar permissões necessárias:**

```bash
# 3. Permissão para gerenciar Cloud Run
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/run.admin" \
  --condition=None

# 4. Permissão para acessar Container Registry
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/storage.admin" \
  --condition=None

# 5. Permissão para criar/gerenciar service accounts
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/iam.serviceAccountUser" \
  --condition=None

# 6. Permissão para acessar secrets
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/secretmanager.secretAccessor" \
  --condition=None

# ✅ Verificar permissões:
gcloud projects get-iam-policy ${PROJECT_ID} \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:${SA_EMAIL}" \
  --format="table(bindings.role)"
```

**Criar e baixar chave JSON:**

```bash
# 7. Criar chave
gcloud iam service-accounts keys create ~/gcp-key.json \
  --iam-account=${SA_EMAIL}

# ✅ Arquivo salvo em: ~/gcp-key.json

# 8. Ver conteúdo (você vai precisar copiar isso)
cat ~/gcp-key.json

# 📋 COPIE TODO O CONTEÚDO (incluindo { } )
# Você vai colar isso no GitHub depois
```

---

## 🗄️ PARTE 2: Configurar Banco de Dados (10 minutos)

### Opção A: Supabase (RECOMENDADO - Gratuito e Fácil)

**Por que Supabase?**
- ✅ Gratuito (500MB, suficiente para começar)
- ✅ PostgreSQL totalmente gerenciado
- ✅ Setup em 2 minutos
- ✅ Backups automáticos
- ✅ Interface visual

**Passo a passo:**

1. **Criar conta**: https://supabase.com
   - Clique em "Start your project"
   - Login com GitHub (recomendado)

2. **Criar projeto**:
   - Clique em "New Project"
   - Nome: `abanotes-db`
   - Database Password: **Crie uma senha forte e ANOTE**
   - Region: `East US (North Virginia)` (mais próximo do Cloud Run us-central1)
   - Plano: Free
   - Clique em "Create new project"
   - ⏱️ Aguarde 2-3 minutos (vai mostrar "Setting up project...")

3. **Copiar connection string**:
   - Vá em: Settings (⚙️) → Database
   - Role até "Connection string"
   - Selecione "URI"
   - Copie a string que parece com:
     ```
     postgresql://postgres.xxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
     ```
   - Substitua `[PASSWORD]` pela senha que você criou
   - **ANOTE ISSO** - É seu `DATABASE_URL`

4. **Testar conexão** (opcional):
   ```bash
   # Instalar psql se não tiver
   brew install postgresql
   
   # Testar conexão (substitua pela sua URL)
   psql "postgresql://postgres.xxx:SENHA@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
   
   # Se conectar, digite \q para sair
   ```

### Opção B: Cloud SQL (Pago, mais integrado)

<details>
<summary>Clique para expandir instruções do Cloud SQL</summary>

```bash
# 1. Criar instância PostgreSQL
gcloud sql instances create abanotes-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-type=SSD \
  --storage-size=10GB \
  --backup-start-time=03:00

# ⏱️ Isso leva 5-7 minutos

# 2. Definir senha do usuário postgres
gcloud sql users set-password postgres \
  --instance=abanotes-db \
  --password=SuaSenhaForte123

# 3. Criar banco de dados
gcloud sql databases create abanotes \
  --instance=abanotes-db

# 4. Pegar connection string
gcloud sql instances describe abanotes-db \
  --format="value(connectionName)"

# Resultado será algo como: project:us-central1:abanotes-db
# DATABASE_URL será:
# postgresql://postgres:SuaSenhaForte123@/abanotes?host=/cloudsql/project:us-central1:abanotes-db
```

💰 **Custo**: ~$10-15/mês (db-f1-micro)

</details>

---

## 🔴 PARTE 3: Configurar Redis (5 minutos)

### Opção A: Upstash (RECOMENDADO - Gratuito)

**Por que Upstash?**
- ✅ Completamente gratuito (10.000 comandos/dia)
- ✅ Serverless (escala automaticamente)
- ✅ Setup em 2 minutos
- ✅ Baixa latência global

**Passo a passo:**

1. **Criar conta**: https://upstash.com
   - Clique em "Get Started"
   - Login com GitHub

2. **Criar database Redis**:
   - Clique em "Create Database"
   - Name: `abanotes-redis`
   - Type: `Regional` (mais barato)
   - Region: `us-east-1` (ou próximo do seu Cloud Run)
   - Clique em "Create"

3. **Copiar connection string**:
   - Na página do database criado
   - Vá até a seção "REST API"
   - Copie o **UPSTASH_REDIS_REST_URL**
   - Parece com: `https://xxx.upstash.io`
   - **ANOTE ISSO** - É seu `REDIS_URL`

### Opção B: Redis Cloud (Também gratuito)

<details>
<summary>Clique para expandir instruções do Redis Cloud</summary>

1. Criar conta: https://redis.com/try-free/
2. Create database → Free plan (30MB)
3. Copiar "Public endpoint" (será algo como: redis-12345.c123.us-east-1-3.ec2.cloud.redislabs.com:12345)
4. Criar senha
5. REDIS_URL será: `redis://default:SENHA@endpoint:porta`

</details>

---

## 🔐 PARTE 4: Configurar Secrets no Google Cloud (10 minutos)

**O que são Secrets?** Variáveis de ambiente sensíveis (senhas, tokens) armazenadas de forma segura.

### Passo 4.1: Criar JWT Secret

```bash
# Gerar um token aleatório seguro
openssl rand -base64 32

# OU
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Copie o resultado - é seu JWT_SECRET
```

### Passo 4.2: Criar Secrets no Secret Manager

```bash
# Certifique-se de que está no projeto correto
gcloud config get-value project

# 1. Criar secret DATABASE_URL
echo -n "COLE_SUA_DATABASE_URL_AQUI" | \
  gcloud secrets create DATABASE_URL \
  --data-file=- \
  --replication-policy="automatic"

# Exemplo real:
echo -n "postgresql://postgres.xxx:senha@aws-0-us-east-1.pooler.supabase.com:6543/postgres" | \
  gcloud secrets create DATABASE_URL \
  --data-file=- \
  --replication-policy="automatic"

# 2. Criar secret REDIS_URL
echo -n "COLE_SUA_REDIS_URL_AQUI" | \
  gcloud secrets create REDIS_URL \
  --data-file=- \
  --replication-policy="automatic"

# Exemplo real:
echo -n "https://xxx.upstash.io" | \
  gcloud secrets create REDIS_URL \
  --data-file=- \
  --replication-policy="automatic"

# 3. Criar secret JWT_SECRET
echo -n "COLE_SEU_JWT_SECRET_AQUI" | \
  gcloud secrets create JWT_SECRET \
  --data-file=- \
  --replication-policy="automatic"

# Exemplo real:
echo -n "Xy9kL2mN5pQ8rT1vW3xZ6aB4cD7eF0gH2iJ5kM8nP1qS4tV7wY0zA3bC6dE9fG2h" | \
  gcloud secrets create JWT_SECRET \
  --data-file=- \
  --replication-policy="automatic"
```

**✅ Verificar secrets criados:**

```bash
gcloud secrets list

# Deve mostrar:
# NAME          CREATED              REPLICATION_POLICY  LOCATIONS
# DATABASE_URL  2025-11-08T...       automatic           -
# JWT_SECRET    2025-11-08T...       automatic           -
# REDIS_URL     2025-11-08T...       automatic           -
```

**Ver conteúdo de um secret** (para confirmar):

```bash
gcloud secrets versions access latest --secret="DATABASE_URL"
```

### Passo 4.3: Dar permissão para Cloud Run acessar os secrets

```bash
# Pegar número do projeto
export PROJECT_NUMBER=$(gcloud projects describe ${PROJECT_ID} --format="value(projectNumber)")

# Dar permissão para a service account padrão do Cloud Run
gcloud secrets add-iam-policy-binding DATABASE_URL \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding REDIS_URL \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding JWT_SECRET \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## 🐙 PARTE 5: Configurar GitHub Secrets (5 minutos)

### Passo 5.1: Adicionar Secrets no GitHub

1. **Abra seu repositório no GitHub**: https://github.com/opmartins/abanotes

2. **Vá para Settings**:
   - Clique em "Settings" (aba no topo)
   - No menu lateral, clique em "Secrets and variables" → "Actions"

3. **Adicionar secrets** (clique em "New repository secret" para cada):

   **Secret 1: GCP_PROJECT_ID**
   - Name: `GCP_PROJECT_ID`
   - Value: `abanotes-production-423819` (seu Project ID)
   - Clique em "Add secret"

   **Secret 2: GCP_SA_KEY**
   - Name: `GCP_SA_KEY`
   - Value: **COLE TODO O CONTEÚDO** do arquivo `~/gcp-key.json`
     ```bash
     cat ~/gcp-key.json
     # Copie TUDO (incluindo { })
     ```
   - Clique em "Add secret"

   **Secret 3: DATABASE_URL** (para migrations no CI/CD)
   - Name: `DATABASE_URL`
   - Value: Sua connection string do Supabase
   - Clique em "Add secret"

**✅ Você deve ter 3 secrets configurados**

---

## 🧪 PARTE 6: Testar Deploy Manual (10 minutos)

Antes de automatizar, vamos testar manualmente:

### Passo 6.1: Build e Push da Imagem

```bash
# 1. Ir para o diretório do projeto
cd /Users/opmartins/labs/abanotes

# 2. Configurar Docker para usar gcloud
gcloud auth configure-docker

# 3. Build da imagem
docker build -t gcr.io/${PROJECT_ID}/abanotes-api:test ./server

# ⏱️ Isso leva 2-3 minutos na primeira vez

# 4. Push para Google Container Registry
docker push gcr.io/${PROJECT_ID}/abanotes-api:test

# ⏱️ Isso leva 1-2 minutos
```

### Passo 6.2: Deploy para Cloud Run

```bash
# Deploy
gcloud run deploy abanotes-api \
  --image gcr.io/${PROJECT_ID}/abanotes-api:test \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 300 \
  --set-secrets=DATABASE_URL=DATABASE_URL:latest,REDIS_URL=REDIS_URL:latest,JWT_SECRET=JWT_SECRET:latest

# ⏱️ Isso leva 1-2 minutos
```

**Se der tudo certo, você verá:**
```
✓ Deploying... Done.
✓ Creating Revision...
✓ Routing traffic...
Done.
Service [abanotes-api] revision [abanotes-api-00001-xxx] has been deployed and is serving 100% of traffic.
Service URL: https://abanotes-api-xxxx-uc.a.run.app
```

### Passo 6.3: Testar a API

```bash
# Pegar a URL do serviço
export SERVICE_URL=$(gcloud run services describe abanotes-api --region us-central1 --format="value(status.url)")

echo "Service URL: ${SERVICE_URL}"

# Testar health check
curl ${SERVICE_URL}/health

# Deve retornar: {"status":"ok"} ou similar
```

**🎉 Se funcionou, seu deploy manual está OK!**

---

## ⚙️ PARTE 7: Configurar Deploy Automático (5 minutos)

### Passo 7.1: Commit e Push dos Arquivos

```bash
cd /Users/opmartins/labs/abanotes

# Ver o que mudou
git status

# Adicionar arquivos
git add .github/workflows/deploy.yml
git add .gitignore
git add .gcloudignore
git add server/.dockerignore
git add DEPLOY.md
git add server/Dockerfile

# Commit
git commit -m "Configure Google Cloud Run deployment"

# Push
git push origin main
```

### Passo 7.2: Verificar Workflow no GitHub

1. **Vá para seu repositório**: https://github.com/opmartins/abanotes
2. **Clique em "Actions"** (aba no topo)
3. **Você verá o workflow "Deploy to Google Cloud Run" rodando**
4. **Clique nele para ver os logs em tempo real**

**Etapas do workflow:**
- ✅ Checkout code
- ✅ Authenticate to Google Cloud
- ✅ Build Docker image
- ✅ Push to Container Registry
- ✅ Run database migrations
- ✅ Deploy to Cloud Run
- ✅ Show deployment URL

⏱️ **Tempo total**: 5-8 minutos

### Passo 7.3: Acessar a Aplicação

Quando o workflow terminar, você verá no log:

```
Deployed to https://abanotes-api-xxxx-uc.a.run.app
```

**Teste:**
```bash
curl https://abanotes-api-xxxx-uc.a.run.app/health
```

---

## 🎯 PARTE 8: Configuração Inicial

### Executar Migrations do Prisma

Agora que está no ar, precisa criar as tabelas:

```bash
# Opção 1: Via Cloud Run Job (automático no CI/CD)
gcloud run jobs create migrate-db \
  --image gcr.io/${PROJECT_ID}/abanotes-api:test \
  --region us-central1 \
  --set-secrets=DATABASE_URL=DATABASE_URL:latest \
  --command npx \
  --args "prisma,migrate,deploy" \
  --max-retries 1 \
  --task-timeout 5m

# Executar migration
gcloud run jobs execute migrate-db --region us-central1 --wait

# Opção 2: Localmente (mais fácil)
cd /Users/opmartins/labs/abanotes/server

# Configurar DATABASE_URL local
export DATABASE_URL="sua-connection-string-do-supabase"

# Rodar migrations
npx prisma migrate deploy

# ✅ Deve mostrar: "Database migrations applied successfully"
```

---

## 🔄 PARTE 9: Workflow Automático (já está configurado!)

Agora, **TODA VEZ** que você fizer `git push origin main`:

1. GitHub Actions vai disparar automaticamente
2. Build da nova imagem Docker
3. Push para Container Registry
4. Executar migrations do Prisma
5. Deploy para Cloud Run
6. **Nova versão no ar em 5-8 minutos!**

**Ver logs do deploy:**
- GitHub: Actions → Deploy to Google Cloud Run
- GCP Console: Cloud Run → abanotes-api → Logs

---

## 📊 PARTE 10: Monitoramento e Logs (5 minutos)

### Ver Logs da Aplicação

**Via CLI:**
```bash
# Logs em tempo real (últimas linhas)
gcloud run services logs read abanotes-api \
  --region=us-central1 \
  --limit=50 \
  --format="table(timestamp,severity,textPayload)"

# Seguir logs (como tail -f)
gcloud run services logs tail abanotes-api \
  --region=us-central1

# Filtrar por erro
gcloud run services logs read abanotes-api \
  --region=us-central1 \
  --filter='severity>=ERROR' \
  --limit=20
```

**Via Console (mais fácil):**
1. Vá para: https://console.cloud.google.com/run
2. Clique em `abanotes-api`
3. Aba "LOGS"
4. Use os filtros para buscar

### Ver Métricas

```bash
# Informações do serviço
gcloud run services describe abanotes-api \
  --region=us-central1 \
  --format="yaml(status)"

# Ver quantas instâncias estão rodando
gcloud run services describe abanotes-api \
  --region=us-central1 \
  --format="value(status.traffic[0].percent)"
```

**Via Console:**
1. Cloud Run → abanotes-api → Aba "METRICS"
2. Você verá:
   - Request count (quantos requests)
   - Request latency (tempo de resposta)
   - Container instances (quantos containers ativos)
   - Memory utilization (uso de memória)
   - CPU utilization (uso de CPU)

### Configurar Alertas

```bash
# Exemplo: Alerta se latência > 2 segundos
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="High Latency Alert" \
  --condition-display-name="Request latency > 2s" \
  --condition-threshold-value=2000 \
  --condition-threshold-duration=60s
```

---

## 💰 PARTE 11: Custos e Otimização

### Custos Esperados (com configuração recomendada)

**FREE TIER (primeiros 90 dias + US$ 300):**
- Cloud Run: **$0** (2 milhões requests/mês grátis)
- Container Registry: **$0** (primeiros 0.5GB grátis)
- Supabase: **$0** (plano gratuito)
- Upstash Redis: **$0** (10k comandos/dia grátis)
- **TOTAL: $0/mês** ✅

**Após free tier (uso moderado):**
- Cloud Run: ~$5-10/mês (50k-100k requests)
- Container Registry: ~$1-2/mês
- Supabase: $0 (até 500MB) ou $25/mês (Pro)
- Upstash: $0 (até 10k/dia) ou $10/mês
- **TOTAL: ~$6-12/mês** ou **$36-47/mês** com upgrades

### Otimizações para Reduzir Custos

**1. Reduzir instâncias mínimas:**
```bash
# Já configurado: min-instances=0 (escala para zero quando sem uso)
gcloud run services update abanotes-api \
  --region=us-central1 \
  --min-instances=0
```

**2. Reduzir memória/CPU:**
```bash
# Se não precisar de tanto
gcloud run services update abanotes-api \
  --region=us-central1 \
  --memory=256Mi \
  --cpu=0.5
```

**3. Configurar timeout menor:**
```bash
gcloud run services update abanotes-api \
  --region=us-central1 \
  --timeout=60s
```

**4. Limpar imagens antigas:**
```bash
# Listar todas as imagens
gcloud container images list-tags gcr.io/${PROJECT_ID}/abanotes-api

# Deletar tags específicas (mantém latest e últimas 5)
gcloud container images list-tags gcr.io/${PROJECT_ID}/abanotes-api \
  --format="get(digest)" \
  --filter="NOT tags:*" \
  | xargs -I {} gcloud container images delete gcr.io/${PROJECT_ID}/abanotes-api@{} --quiet
```

---

## 🚨 PARTE 12: Troubleshooting (Problemas Comuns)

### Problema 1: "Permission denied" no GitHub Actions

**Erro:**
```
ERROR: (gcloud.run.deploy) User [...] does not have permission to access...
```

**Solução:**
```bash
# Re-adicionar permissões
export PROJECT_ID="seu-project-id"
export SA_EMAIL="github-actions-deployer@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/storage.admin"
```

### Problema 2: "Container failed to start"

**Erro no log:**
```
Container failed to start. Failed to start and then listen on the port...
```

**Causas comuns:**
1. Aplicação não está escutando na porta 3000
2. Aplicação está crashando no start
3. Variáveis de ambiente faltando

**Solução:**
```bash
# Ver logs detalhados
gcloud run services logs read abanotes-api \
  --region=us-central1 \
  --limit=100

# Verificar se secrets estão corretos
gcloud secrets versions access latest --secret="DATABASE_URL"
gcloud secrets versions access latest --secret="REDIS_URL"
gcloud secrets versions access latest --secret="JWT_SECRET"

# Testar localmente primeiro
cd /Users/opmartins/labs/abanotes/server
export DATABASE_URL="..."
export REDIS_URL="..."
export JWT_SECRET="..."
npm run dev
```

### Problema 3: "Cannot connect to database"

**Erro:**
```
Error: Can't reach database server at ...
```

**Solução:**
```bash
# Testar conexão com banco localmente
psql "sua-connection-string"

# Se não conectar, verificar:
# 1. Firewall do Supabase (deve permitir conexões de qualquer IP)
# 2. Connection pooling habilitado
# 3. SSL mode correto (adicione ?sslmode=require na URL)

# Exemplo de DATABASE_URL correto:
# postgresql://user:pass@host:6543/postgres?sslmode=require&pgbouncer=true
```

### Problema 4: Build muito lento

**Solução:**
```bash
# Usar cache do Docker no CI/CD
# Já configurado no workflow, mas pode melhorar com:
# 1. Usar image menor (node:18-alpine em vez de bullseye)
# 2. Multi-stage build (já implementado)
# 3. .dockerignore correto (já criado)
```

### Problema 5: "Secret not found"

**Erro:**
```
ERROR: Secret [DATABASE_URL] not found
```

**Solução:**
```bash
# Listar secrets
gcloud secrets list

# Se não existir, criar
echo -n "valor-do-secret" | \
  gcloud secrets create DATABASE_URL \
  --data-file=- \
  --replication-policy="automatic"

# Dar permissão para Cloud Run
export PROJECT_NUMBER=$(gcloud projects describe ${PROJECT_ID} --format="value(projectNumber)")

gcloud secrets add-iam-policy-binding DATABASE_URL \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Problema 6: Migrations não rodam

**Erro:**
```
Migration engine error: ...
```

**Solução:**
```bash
# Rodar migrations manualmente
cd /Users/opmartins/labs/abanotes/server

export DATABASE_URL="sua-connection-string"

# Resetar banco (CUIDADO - deleta tudo!)
npx prisma migrate reset --force

# OU aplicar apenas pending migrations
npx prisma migrate deploy

# Ver status
npx prisma migrate status
```

---

## 🎓 PARTE 13: Comandos Úteis (Cheatsheet)

### Gerenciamento de Serviços

```bash
# Listar todos os serviços
gcloud run services list

# Ver detalhes de um serviço
gcloud run services describe abanotes-api --region=us-central1

# Deletar um serviço
gcloud run services delete abanotes-api --region=us-central1

# Atualizar variável de ambiente
gcloud run services update abanotes-api \
  --region=us-central1 \
  --set-env-vars="NEW_VAR=value"

# Atualizar secret
gcloud run services update abanotes-api \
  --region=us-central1 \
  --update-secrets=NEW_SECRET=secret-name:latest

# Reverter para versão anterior
gcloud run services update-traffic abanotes-api \
  --region=us-central1 \
  --to-revisions=abanotes-api-00001-xxx=100
```

### Gerenciamento de Imagens

```bash
# Listar imagens
gcloud container images list --repository=gcr.io/${PROJECT_ID}

# Listar tags de uma imagem
gcloud container images list-tags gcr.io/${PROJECT_ID}/abanotes-api

# Deletar imagem específica
gcloud container images delete gcr.io/${PROJECT_ID}/abanotes-api:TAG --quiet

# Deletar TODAS exceto latest
gcloud container images list-tags gcr.io/${PROJECT_ID}/abanotes-api \
  --filter='-tags:latest' \
  --format='get(digest)' \
  --limit=999999 | \
  xargs -I {} gcloud container images delete "gcr.io/${PROJECT_ID}/abanotes-api@{}" --quiet
```

### Gerenciamento de Secrets

```bash
# Listar secrets
gcloud secrets list

# Ver valor de um secret
gcloud secrets versions access latest --secret="DATABASE_URL"

# Atualizar secret
echo -n "novo-valor" | gcloud secrets versions add SECRET_NAME --data-file=-

# Deletar secret
gcloud secrets delete SECRET_NAME

# Ver histórico de versões
gcloud secrets versions list SECRET_NAME
```

### Logs e Debug

```bash
# Logs em tempo real
gcloud run services logs tail abanotes-api --region=us-central1

# Últimos 100 logs
gcloud run services logs read abanotes-api --region=us-central1 --limit=100

# Filtrar por erro
gcloud run services logs read abanotes-api --region=us-central1 \
  --filter='severity>=ERROR'

# Filtrar por timestamp
gcloud run services logs read abanotes-api --region=us-central1 \
  --filter='timestamp>="2025-11-08T10:00:00Z"'

# Exportar logs para arquivo
gcloud run services logs read abanotes-api --region=us-central1 \
  --limit=1000 > logs.txt
```

### Testes

```bash
# Pegar URL do serviço
export SERVICE_URL=$(gcloud run services describe abanotes-api --region=us-central1 --format="value(status.url)")

# Test health endpoint
curl ${SERVICE_URL}/health

# Test com headers
curl -H "Authorization: Bearer TOKEN" ${SERVICE_URL}/api/endpoint

# Load test (usando hey)
brew install hey
hey -n 1000 -c 10 ${SERVICE_URL}/health
```

---

## 🔒 PARTE 14: Segurança

### Habilitar HTTPS (já está ativo por padrão)

Cloud Run automaticamente fornece certificado SSL. Seu serviço já roda em HTTPS!

### Configurar CORS (se necessário)

No seu código (`server/src/app.ts`):

```typescript
app.use(cors({
  origin: ['https://seu-frontend.com', 'https://abanotes.com'],
  credentials: true
}));
```

### Restringir acesso público

Se quiser autenticação no Cloud Run:

```bash
# Remover acesso público
gcloud run services remove-iam-policy-binding abanotes-api \
  --region=us-central1 \
  --member="allUsers" \
  --role="roles/run.invoker"

# Permitir apenas service accounts específicas
gcloud run services add-iam-policy-binding abanotes-api \
  --region=us-central1 \
  --member="serviceAccount:sua-sa@project.iam.gserviceaccount.com" \
  --role="roles/run.invoker"
```

### Rate Limiting (Cloud Armor)

Para proteger contra DDoS e abuso, configure Cloud Armor (US$ 2/mês):

```bash
# Criar política de segurança
gcloud compute security-policies create rate-limit-policy \
  --description="Rate limiting policy"

# Adicionar regra de rate limit (100 req/min por IP)
gcloud compute security-policies rules create 1000 \
  --security-policy=rate-limit-policy \
  --expression="true" \
  --action=rate-based-ban \
  --rate-limit-threshold-count=100 \
  --rate-limit-threshold-interval-sec=60 \
  --ban-duration-sec=600

# Aplicar no Cloud Run (requer Load Balancer)
```

### Rotação de Secrets

```bash
# Gerar novo JWT_SECRET
NEW_SECRET=$(openssl rand -base64 32)

# Adicionar nova versão
echo -n "${NEW_SECRET}" | gcloud secrets versions add JWT_SECRET --data-file=-

# Cloud Run pegará automaticamente na próxima requisição
# OU force um novo deploy:
gcloud run services update abanotes-api --region=us-central1
```

---

## 🌐 PARTE 15: Domínio Customizado (Opcional)

### Configurar domínio próprio (ex: api.abanotes.com)

```bash
# 1. Mapear domínio
gcloud run domain-mappings create \
  --service=abanotes-api \
  --domain=api.abanotes.com \
  --region=us-central1

# 2. Vai mostrar os registros DNS necessários
# Copie e adicione no seu provedor de DNS (Cloudflare, GoDaddy, etc)

# Exemplo de registros:
# Type: A
# Name: api
# Value: 216.239.32.21, 216.239.34.21, 216.239.36.21, 216.239.38.21

# Type: AAAA
# Name: api
# Value: 2001:4860:4802:32::15, ...

# 3. Aguarde propagação DNS (5-30 minutos)

# 4. Verificar
curl https://api.abanotes.com/health
```

### Redirecionar domínio raiz para www

```bash
# No seu provedor de DNS, adicione:
# Type: CNAME
# Name: www
# Value: ghs.googlehosted.com
```

---

## 📈 PARTE 16: Escalabilidade e Performance

### Configurar Autoscaling

```bash
# Configuração atual (já otimizada):
# - min-instances: 0 (escala para zero quando sem uso)
# - max-instances: 10 (pode escalar até 10 containers)
# - cpu: 1 (1 vCPU por container)
# - memory: 512Mi

# Para aplicação com tráfego constante (manter sempre 1 instância ativa):
gcloud run services update abanotes-api \
  --region=us-central1 \
  --min-instances=1 \
  --max-instances=20

# Para aplicação com picos (escalar mais agressivamente):
gcloud run services update abanotes-api \
  --region=us-central1 \
  --min-instances=0 \
  --max-instances=50 \
  --cpu=2 \
  --memory=1Gi
```

### Habilitar Connection Pooling do Prisma

No seu `schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Adicione:
  directUrl = env("DIRECT_URL")  // Para migrations
}
```

No `.env`:
```bash
# Para queries (via connection pooler)
DATABASE_URL="postgresql://user:pass@host:6543/postgres?pgbouncer=true"

# Para migrations (conexão direta)
DIRECT_URL="postgresql://user:pass@host:5432/postgres"
```

### Configurar Redis para cache

```typescript
// server/src/db/redis.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true,
});

// Middleware de cache
export const cacheMiddleware = (duration: number) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    const cached = await redis.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      redis.setex(key, duration, JSON.stringify(body));
      res.sendResponse(body);
    };
    next();
  };
};
```

---

## 🎉 CONCLUSÃO

**Parabéns!** Se chegou até aqui, sua aplicação está:

✅ **Rodando em produção** no Google Cloud Run  
✅ **Deploy automático** via GitHub Actions  
✅ **Banco de dados** configurado (Supabase/Cloud SQL)  
✅ **Redis** configurado (Upstash/Memorystore)  
✅ **Secrets** gerenciados com segurança  
✅ **HTTPS** habilitado automaticamente  
✅ **Autoscaling** configurado (0-10 instâncias)  
✅ **Logs** centralizados  
✅ **Zero downtime** em deploys  

### Workflow de Desenvolvimento

```bash
# 1. Desenvolver localmente
cd /Users/opmartins/labs/abanotes
git checkout -b feature/nova-funcionalidade

# 2. Fazer mudanças
# ... código ...

# 3. Testar localmente
docker-compose up
npm test

# 4. Commit e push
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push origin feature/nova-funcionalidade

# 5. Criar PR no GitHub
# 6. Revisar e mergear para main
# 7. GitHub Actions faz deploy automático! 🚀
```

### Checklist Final

- [ ] ✅ Projeto GCP criado
- [ ] ✅ APIs habilitadas
- [ ] ✅ Service Account configurada
- [ ] ✅ Banco de dados (Supabase) criado
- [ ] ✅ Redis (Upstash) criado
- [ ] ✅ Secrets no GCP criados
- [ ] ✅ Secrets no GitHub configurados
- [ ] ✅ Deploy manual testado
- [ ] ✅ Deploy automático funcionando
- [ ] ✅ Migrations rodaram com sucesso
- [ ] ✅ API respondendo corretamente
- [ ] ✅ Logs visíveis e funcionando
- [ ] ✅ Domínio customizado (opcional)

### Links Úteis

- **Seu Cloud Run**: https://console.cloud.google.com/run
- **Seus Secrets**: https://console.cloud.google.com/security/secret-manager
- **Logs**: https://console.cloud.google.com/logs
- **Métricas**: https://console.cloud.google.com/monitoring
- **Container Registry**: https://console.cloud.google.com/gcr
- **GitHub Actions**: https://github.com/opmartins/abanotes/actions
- **Supabase Dashboard**: https://app.supabase.com
- **Upstash Dashboard**: https://console.upstash.com

### Próximos Passos Recomendados

1. **Monitoramento avançado**: Configure Sentry ou Datadog
2. **CI/CD completo**: Adicione testes automatizados
3. **Staging environment**: Crie ambiente de homologação
4. **Backups**: Configure backup automático do banco
5. **CDN**: Configure Cloud CDN para assets estáticos
6. **Firewall**: Configure Cloud Armor para proteção DDoS
7. **Análises**: Configure Google Analytics ou Mixpanel
8. **Documentação API**: Configure Swagger/OpenAPI

### Suporte

**Problemas?** 
- Revise a seção de Troubleshooting
- Veja os logs: `gcloud run services logs tail abanotes-api --region=us-central1`
- GitHub Issues: https://github.com/opmartins/abanotes/issues
- GCP Support: https://cloud.google.com/support

**Dúvidas sobre custos?**
- Calculadora GCP: https://cloud.google.com/products/calculator
- Billing dashboard: https://console.cloud.google.com/billing

---

**🎊 Sua aplicação está no ar! Compartilhe com o mundo! 🎊**

```bash
# Teste agora:
curl https://abanotes-api-xxxx-uc.a.run.app/health
```
