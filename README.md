# Movie Portal - Nuxt 3

Um portal moderno de filmes construído com Nuxt 3, Vue 3, TypeScript e Bootstrap, consumindo a API do TMDB com sistema completo de favoritos e autenticação.

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Nuxt](https://img.shields.io/badge/Nuxt-3.x-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Lighthouse](https://img.shields.io/badge/Lighthouse-97%2F100-28a745?style=for-the-badge&logo=lighthouse&logoColor=white)

## Demo Online

🚀 **[Ver aplicação funcionando](https://moviel-portal-nuxt.vercel.app/)**

Aplicação deployada automaticamente na Vercel com integração contínua via GitHub Actions.

## Funcionalidades

### Core Features
- **Interface Responsiva** - Design mobile-first com Bootstrap 5
- **Catálogo de Filmes** - Integração completa com TMDB API
- **Sistema de Favoritos** - Persistência local com Pinia
- **Autenticação JWT Fake** - Middleware de proteção de rotas
- **Páginas Dinâmicas** - SSR com rotas dinâmicas para detalhes
- **Componentização Completa** - Arquitetura limpa e reutilizável

### Características Técnicas
- **Server-Side Rendering (SSR)** com Nuxt 3
- **Estado Global** gerenciado por Pinia
- **CSS Modular** com arquivos separados por componente
- **Acessibilidade** com ARIA labels e navegação por teclado
- **SEO Otimizado** com meta tags dinâmicas
- **Performance Score 97/100** no Lighthouse
- **Testes Unitários** com Vitest e Vue Test Utils

## Tecnologias Utilizadas

### Frontend Stack
- **[Nuxt 3](https://nuxt.com/)** - Framework Vue.js full-stack
- **[Vue 3](https://vuejs.org/)** - Framework JavaScript reativo com Composition API
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática completa
- **[Pinia](https://pinia.vuejs.org/)** - Gerenciamento de estado moderno
- **[Bootstrap 5](https://getbootstrap.com/)** - Framework CSS responsivo

### APIs & Services
- **[TMDB API](https://www.themoviedb.org/documentation/api)** - Base de dados de filmes
- **LocalStorage** - Persistência de favoritos e autenticação

### Deploy & CI/CD
- **[Vercel](https://vercel.com/)** - Hospedagem e deploy automático
- **GitHub Actions** - Integração contínua

### Ferramentas de Desenvolvimento
- **[Vitest](https://vitest.dev/)** - Framework de testes unitários
- **[Vue Test Utils](https://test-utils.vuejs.org/)** - Utilitários para testes de componentes

## Performance e Qualidade

### Lighthouse Score: 97/100
- **Performance**: 97
- **Accessibility**: 88
- **Best Practices**: 100
- **SEO**: 100

### Otimizações Implementadas
- **Compressão de Assets** - Gzip automático via Nitro
- **Minificação** - CSS e JavaScript otimizados
- **Code Splitting** - Separação de chunks (Bootstrap, Pinia)
- **Cache de Rotas** - ISR configurado por tipo de página
- **Resource Hints** - Preconnect e DNS prefetch para TMDB
- **Lazy Loading** - Carregamento sob demanda de componentes
- **Payload Extraction** - Redução do tamanho inicial

## Instalação

### Pré-requisitos
- Node.js 20+ (recomendado LTS)
- npm ou yarn
- Git

### Passo a passo

1. **Clone o repositório**
```bash
git clone https://github.com/joaolrocha/moviel-portal-nuxt
cd movie-portal-nuxt
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Crie o arquivo .env na raiz do projeto
cp .env.example .env

# Edite o .env e adicione sua TMDB API Key
TMDB_API_KEY=sua_api_key_aqui
```

4. **Obtenha sua TMDB API Key**
   - Acesse: https://www.themoviedb.org/
   - Crie uma conta gratuita
   - Vá em Settings → API
   - Solicite uma API Key (escolha Developer)
   - Cole no arquivo `.env`

5. **Execute o projeto**
```bash
npm run dev
```

6. **Acesse no navegador**
```
http://localhost:3000
```

## Estrutura do Projeto

```
movie-portal-nuxt3/
├── assets/
│   └── styles/
│       ├── components/          # CSS dos componentes
│       └── pages/              # CSS das páginas
├── components/
│   ├── layout/                 # Navbar
│   ├── movie/                  # MovieCard, Grid, Hero
│   └── ui/                     # LoadingSpinner, ErrorAlert
├── composables/
│   └── useTmdb.ts             # Integração TMDB API
├── middleware/
│   └── auth.ts                # Proteção de rotas
├── pages/
│   ├── index.vue              # Homepage
│   ├── login.vue              # Login
│   ├── favoritos.vue          # Favoritos
│   └── item/
│       └── [id].vue           # Detalhes do filme
├── store/
│   ├── auth.ts                # Estado de autenticação
│   ├── favorites.ts           # Estado dos favoritos
│   └── movies.ts              # Estado dos filmes
├── tests/
│   ├── composables/           # Testes dos composables
│   └── stores/                # Testes das stores
├── nuxt.config.ts             # Configuração do Nuxt
└── package.json
```

## Testes

### Configuração de Testes
O projeto utiliza **Vitest** como framework de testes com **Vue Test Utils** para testes de componentes Vue.


#### Composables Testados
- **useTmdb.ts**: Testes completos da integração com TMDB API
  - Construção de URLs de imagem
  - Requisições para diferentes endpoints
  - Tratamento de erros
  - Formatação de parâmetros

#### Stores Testadas
- **favorites.ts**: Testes do sistema de favoritos
  - Adição e remoção de favoritos
  - Persistência no localStorage
  - Getters computados
  - Estado inicial e limpeza

## Como Usar

### Navegação Principal
- **Início**: Lista de filmes populares da TMDB
- **Favoritos**: Seus filmes salvos (requer autenticação)
- **Detalhes**: Informações completas de cada filme

### Sistema de Favoritos
- Login necessário para acessar funcionalidade
- Persistência automática no localStorage
- Sincronização em tempo real entre páginas

### Autenticação (Demo)
Sistema de autenticação fake para demonstração:

**Credenciais de teste:**
- Email: `joao@exemplo.com` | Senha: qualquer (3+ caracteres)
- Email: `maria@exemplo.com` | Senha: qualquer (3+ caracteres)

## Componentes Criados

### Movie Components
- **MovieCard** - Card responsivo de filmes
- **MovieGrid** - Grid adaptativa de filmes
- **HeroSection** - Seção hero com backdrop
- **CastSection** - Exibição de elenco e equipe técnica
- **MovieInfoSidebar** - Informações técnicas e comerciais

### UI Components
- **LoadingSpinner** - Indicador de carregamento reutilizável
- **ErrorAlert** - Sistema de alertas com retry automático
- **FavoriteButton** - Botão animado para sistema de favoritos

### Layout Components
- **Navbar** - Navegação responsiva com estados de autenticação

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```
## Responsividade

### Breakpoints Bootstrap
- **xs**: < 576px (Mobile)
- **sm**: ≥ 576px (Mobile grande)
- **md**: ≥ 768px (Tablet)
- **lg**: ≥ 992px (Desktop)
- **xl**: ≥ 1200px (Desktop grande)

### Design Mobile-First
- Interface otimizada para dispositivos móveis
- Touch targets de 44px mínimo
- Navigation drawer responsivo
- Grid adaptativa por breakpoint

## Sistema de Autenticação

### Funcionalidades
- **JWT Fake** para demonstração
- **Middleware** de proteção automática
- **Redirecionamento** inteligente pós-login
- **Persistência** de sessão no localStorage

### Fluxo de Autenticação
1. Usuário acessa rota protegida (/favoritos)
2. Middleware verifica token JWT
3. Se inválido/ausente → Redirect para /login
4. Após login → Redirect para destino original
5. Token armazenado com expiração

## Stores (Pinia)

### Movies Store
- Cache inteligente com TTL
- Paginação e estados de loading
- Sincronização com TMDB API

### Favorites Store
- Operações CRUD completas
- Persistência automática
- Sync entre abas/janelas

### Auth Store
- Gerenciamento de JWT fake
- Estados de loading/error
- Integração com middleware

## Deploy

### Vercel
A aplicação está configurada para deploy automático na Vercel:

- **URL de Produção**: https://moviel-portal-nuxt.vercel.app/
- **Deploy automático** a cada push na branch main
- **Preview deployments** para Pull Requests
- **Variáveis de ambiente** configuradas no painel da Vercel


## Diferenciais Implementados

### Requisitos Obrigatórios ✅
- Vue 3 + Nuxt 3 com TypeScript
- SSR configurado corretamente
- Rotas dinâmicas funcionais
- Middleware de autenticação
- Pinia para estado global
- Integração com API REST (TMDB)
- Responsividade completa com Bootstrap
- Código versionado com commits semânticos

### Bônus Implementados ✅
- **Testes Unitários**: Vitest + Vue Test Utils
- **Performance Lighthouse ≥ 90**: Score atual 97/100
- **Lazy Loading**: Componentes e imagens
- **JWT Fake**: Sistema de autenticação completo
- **Deploy Automático**: Vercel + GitHub Actions

### Processo de Contribuição
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Autor

**Seu Nome**
- GitHub: [@joaolrocha](https://github.com/joaolrocha)
- LinkedIn: [Joao Luiz Rocha](https://linkedin.com/in/rochajoao)
- Email: joaolrocha07@gmail.com
