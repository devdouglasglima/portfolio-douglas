# Portfólio Profissional — Douglas

Portfólio profissional interativo com experiência 3D de partículas controlada por scroll.

**Site:** https://devdouglasglima.github.io/portfolio-douglas/

---

## Tecnologias

- HTML5 + CSS3 + JavaScript ES Modules
- [Three.js](https://threejs.org/) — sistema de partículas 3D (WebGL)
- [GSAP + ScrollTrigger](https://gsap.com/) — narrativa controlada por scroll
- Sem bundler — funciona como arquivos estáticos

## Executar localmente

```bash
# Qualquer servidor HTTP estático funciona.
# Com Python (recomendado):
python -m http.server 3000

# Acesse: http://localhost:3000
```

## Estrutura

```
portfolio-douglas/
├── index.html              ← página principal
├── src/
│   ├── css/main.css        ← estilos (design system completo)
│   └── js/
│       ├── main.js         ← entry point
│       ├── store.js        ← estado global
│       ├── brain/          ← Three.js: geometria + shaders + cena
│       ├── sections/       ← narrativa por scroll e observers
│       └── utils/          ← detecção de WebGL e performance
└── public/
    └── images/profile/     ← profile-main.webp (não versionada)
```

## Fotografia

Adicionar o arquivo `public/images/profile/profile-main.webp` para exibir a foto na seção Hero.

- Proporção recomendada: 4:5
- Resolução: 1600 × 2000 px
- Formato: WebP (preferencial), JPG ou PNG

## Publicar no GitHub Pages

1. Criar repositório `portfolio-douglas` no GitHub
2. Fazer push do código para a branch `main`
3. Acessar **Settings → Pages → Source: Deploy from branch → main / (root)**
4. O site estará disponível em `https://<seu-usuario>.github.io/portfolio-douglas/`

## Projetos apresentados

1. **Auditoria Inteligente de Chamados com IA** — dupla avaliação por IA + validação humana
2. **Orquestrador de Requisições de API** — Kafka + Multisoft + Freshservice com fila por prioridade
3. **Integração de Inventário e Ativos ao ITSM** — sincronização de ativos e usuários ao Araújo Service
