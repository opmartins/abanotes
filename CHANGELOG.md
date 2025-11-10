# Changelog - ABA Notes Rebranding

## 🎨 Identidade Visual Atualizada (Nov 8, 2025)

### Branding
- ✅ Nome atualizado de "Clínica Autismo" para **ABA Notes**
- ✅ Logo criado com gradiente Indigo (#4F46E5) → Teal (#14B8A6)
- ✅ Favicon SVG personalizado com ícone de nota
- ✅ Paleta de cores profissional e moderna

### Arquivos Modificados

#### Frontend (`web/`)
- ✅ `index.html` - Título e meta tags atualizados
- ✅ `package.json` - Nome do projeto alterado para "abanotes-web"
- ✅ `src/index.css` - Design system completo atualizado com nova paleta
- ✅ `src/components/Header.tsx` - Header com novo logo
- ✅ `src/components/Sidebar.tsx` - Sidebar modernizada com ícones
- ✅ `src/components/Logo.tsx` - **NOVO** componente de logo reutilizável
- ✅ `src/pages/Dashboard.tsx` - Textos atualizados
- ✅ `public/favicon.svg` - **NOVO** favicon personalizado

#### Backend (`server/`)
- ✅ `package.json` - Nome do projeto alterado para "abanotes-api"

#### Documentação
- ✅ `README.md` - Documentação completa atualizada
- ✅ `DEPLOY.md` - Guia de deploy referenciando ABA Notes
- ✅ `BRAND.md` - **NOVO** guia de identidade visual

### Design System

#### Cores Primárias
- **Primary**: Indigo `#4F46E5` (profissionalismo)
- **Accent**: Teal `#14B8A6` (energia e crescimento)

#### Tipografia
- Fonte: Inter (sans-serif moderna)
- Pesos: 400, 500, 600, 700

#### Componentes Estilizados
- Cards com hover effects
- Botões com gradientes
- Navegação com estados visuais claros
- Dark mode completo
- Sistema de espaçamento consistente
- Sombras e bordas arredondadas

### Funcionalidades Adicionadas
- Logo component reutilizável com 3 tamanhos
- Ícones emoji para melhor UX
- Sidebar colapsável com dicas
- Header responsivo
- Melhor acessibilidade (ARIA labels)

### Próximos Passos Sugeridos
- [ ] Atualizar imagens de marketing
- [ ] Criar templates de email com novo branding
- [ ] Documentação de usuário com screenshots atualizados
- [ ] Social media assets (OG images, Twitter cards)
- [ ] Presskit com logos em diferentes formatos

---

**Nota**: Todos os arquivos de lock (`package-lock.json`) precisarão ser regenerados após `npm install`.
