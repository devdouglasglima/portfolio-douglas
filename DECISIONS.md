# DECISIONS.md — Portfólio Profissional Douglas

> Registro de decisões de arquitetura, design e produto.  
> Inclui alternativas consideradas e justificativas para cada escolha relevante.

---

## D-00 — Mudança de Stack: React/Vite → Vanilla JS (sem npm)

**Decisão:** Implementação com HTML + CSS + JavaScript ES Modules puros, sem bundler.

**Motivação:** O ambiente não possui npm instalado no PATH. A instalação foi tentada via winget mas requer permissões de administrador não disponíveis no momento.

**Stack final:**
- Three.js via CDN (importmap)
- GSAP + ScrollTrigger via CDN (script tags)
- CSS Modules substituído por CSS puro com Custom Properties
- Servidor local: `python -m http.server 3000`
- Deploy: GitHub Pages (arquivos estáticos sem build step)

**Impacto:** Sem TypeScript. Sem React. Sem bundler. O código é organizado em ES Modules nativos. A qualidade visual é preservada.

---

## D-01 — Framework: React + Vite vs Next.js vs Astro

**Decisão:** ~~React 18 + Vite 5~~ → Vanilla JS (ver D-00)

**Alternativas consideradas:**

| Opção | Prós | Contras |
|-------|------|---------|
| React + Vite | DX rápido, suporte nativo R3F, controle total, deploy estático simples | SSR não incluso por padrão |
| Next.js | SSR, otimização de imagem, SEO nativo | Overhead desnecessário para SPA; complexidade de deploy com R3F/GSAP |
| Astro | Excelente para sites estáticos, MPA | Integração 3D/GSAP mais complexa; menos ecossistema para R3F |

**Justificativa:** O portfólio é uma SPA com experiência interativa pesada (3D, GSAP, animações). React + Vite entrega o melhor equilíbrio entre DX, ecossistema 3D (React Three Fiber) e build estático para GitHub Pages. Next.js adicionaria complexidade sem benefício real para este caso de uso.

---

## D-02 — 3D: React Three Fiber vs Three.js puro

**Decisão:** React Three Fiber (@react-three/fiber) + @react-three/drei

**Alternativas consideradas:**

| Opção | Prós | Contras |
|-------|------|---------|
| React Three Fiber | Declarativo, integra bem com React, ecossistema rico (Drei, postprocessing), gerencia lifecycle | Overhead de abstração; requer compreensão do modelo React para objetos 3D |
| Three.js puro | Controle total, sem overhead de abstração, melhor para animações imperativas complexas | Integração manual com React lifecycle; mais código boilerplate |
| Babylon.js | Framework completo, bom editor visual | Bundle maior, ecossistema menor no contexto React, curva de aprendizado |

**Justificativa:** R3F é o padrão da indústria para Three.js com React. O ecossistema (@react-three/drei, @react-three/postprocessing) reduz significativamente o código boilerplate. A integração com GSAP é feita via Zustand store + `useFrame`, evitando re-renders desnecessários.

---

## D-03 — Animação de Scroll: GSAP ScrollTrigger vs Framer Motion scroll vs ScrollObserver nativo

**Decisão:** GSAP 3 + ScrollTrigger para o cérebro; Framer Motion para microinterações de seção

**Alternativas consideradas:**

| Opção | Prós | Contras |
|-------|------|---------|
| GSAP ScrollTrigger | Padrão da indústria, `pin` nativo, `scrub` preciso, integração com Three.js via refs | Licença comercial requer atenção (uso gratuito para portfólios pessoais) |
| Framer Motion scroll | Integração React nativa, bem documentado | Sem suporte nativo a `pin` sections; menos preciso para controle de timeline |
| Intersection Observer | Leve, nativo | Binário (dentro/fora); sem controle de progresso granular necessário para o cérebro |
| ScrollObserver (nativo) | Zero dependência | API ainda instável em alguns browsers |

**Justificativa:** A narrativa do cérebro exige controle de progresso contínuo (0→1) com seção fixada (pinned). GSAP ScrollTrigger é a solução mais robusta e testada para esse padrão. Framer Motion é mantido para animações de entrada de seções (mais simples e declarativo para esse uso).

**Nota de licença:** GSAP é gratuito para uso em projetos pessoais e portfólios. Para uso comercial ou SaaS, requer licença Club GreenSock.

---

## D-04 — Modelo do Cérebro: Modelo GLB vs Geometria Procedural

**Decisão:** Plano primário com GLB; fallback procedural implementado como contingência

**Plano primário:** Usar modelo `.glb` simplificado de cérebro humano (surface mesh) com licença CC0.  
**Plano de fallback:** Geometria procedural com dois hemisférios + cerebelo, com Simplex Noise aplicado às normais.

**Justificativa:** Um modelo 3D real de cérebro humano cria uma silhueta imediatamente reconhecível e mais convincente visualmente. A geometria procedural é a alternativa se o modelo não estiver disponível ou for muito pesado. O fallback preserva a experiência com qualidade aceitável.

**Critério de tamanho:** O modelo GLB deve ter menos de 2MB (otimizado com Draco compression).

---

## D-05 — Estilização: CSS Modules + Custom Properties vs Tailwind vs Styled-Components

**Decisão:** CSS Modules + CSS Custom Properties

**Alternativas consideradas:**

| Opção | Prós | Contras |
|-------|------|---------|
| CSS Modules + Custom Properties | Zero runtime; tokens centralizados; CSS padrão; fácil manutenção | Mais verboso para variações de estado |
| Tailwind CSS | Utilitário rápido, consistência forçada | Legibilidade de JSX reduzida; customização de design system peculiar; bundle de purge |
| Styled-Components / Emotion | Colocação com componente, props dinâmicas | Runtime overhead; incompatibilidade potencial com SSR; bundle maior |

**Justificativa:** Para um site com design system autoral (tokens não-padrão, animações CSS complexas, shaders), CSS Modules com Custom Properties oferece o máximo de controle sem overhead de runtime. Tailwind força convenções que conflitam com um design system único.

---

## D-06 — Estado Global: Zustand vs React Context vs Jotai

**Decisão:** Zustand

**Justificativa:** A comunicação entre GSAP (imperativo, fora do React) e R3F (`useFrame`, sem re-renders) exige um store que funcione fora do ciclo de render do React. Zustand permite `getState()` e `setState()` síncronos, sem trigger de re-render, o que é essencial para a integração GSAP → R3F em 60fps. React Context causaria re-renders a cada frame de scroll.

---

## D-07 — Paleta Visual: Neural Dark Premium

**Decisão:** Fundo ultra-escuro (#07070F) com paleta azul-elétrico + ciano neural + violeta como acentos

**Justificativa:**

A atuação de Douglas combina tecnologia, análise e inteligência aplicada. Uma paleta escura com iluminação de partículas comunica: processamento neural, fluxos de dados, profundidade tecnológica. O contraste com as partículas luminosas cria a sensação de um sistema "pensando".

Paletas alternativas consideradas:
- **Preto puro + branco**: excessivamente minimalista; perde profundidade e identidade
- **Gradiente escuro azul-verde**: risco de parecer genérico (muitos portfólios de dev usam)
- **Dark + dourado**: mais ligado a finanças/luxo que tecnologia

A escolha de violeta como terceiro acento evita a monotonia do azul/ciano e cria profundidade de cor no sistema de partículas.

---

## D-08 — Tipografia: Syne + Inter + JetBrains Mono

**Decisão:** Hierarquia de três famílias com papéis distintos

**Justificativa:**

| Fonte | Papel | Por quê |
|-------|-------|---------|
| Syne | Títulos de impacto, conceitos (IDENTIFICAR, etc.) | Geométrica, moderna, autoral; peso visual forte sem ser decorativa |
| Inter | Corpo, UI, parágrafos | Legível em qualquer tamanho, neutra, universalmente bem recebida por recrutadores técnicos |
| JetBrains Mono | Labels técnicos, nomes de tecnologia, diagramas | Remete a código/terminal; estabelece camada técnica sem usar fonte ilegível |

Alternativas rejeitadas: Space Grotesk (similar ao Syne mas menos impactante em display), Neue Machina (muito estilizada, pode prejudicar legibilidade), Dm Sans (neutra demais, sem personalidade).

---

## D-09 — Publicação: GitHub Pages vs Vercel vs Netlify

**Decisão:** GitHub Pages (configuração preparada; sem deploy até autorização)

**Alternativas consideradas:**

| Opção | Prós | Contras |
|-------|------|---------|
| GitHub Pages | Gratuito, integra com repositório GitHub existente, CI/CD via Actions | Requer configuração de base path; sem SSR |
| Vercel | Zero-config para Vite, preview automático, analytics | Requer conta Vercel; domínio .vercel.app |
| Netlify | Similar ao Vercel, bom CDN | Mais configuração manual |

**Justificativa:** GitHub Pages é a escolha natural para um portfólio hospedado no próprio repositório do GitHub, sem custo adicional e com CI/CD via GitHub Actions. Para uma SPA estática (Vite + React), não há limitação funcional.

---

## D-10 — Diagramas dos Cases: SVG inline vs Mermaid.js vs biblioteca de fluxogramas

**Decisão:** SVG inline com CSS animations

**Justificativa:** Os diagramas precisam ser visualmente consistentes com o design system do site (cores, fontes, animações). Mermaid.js e bibliotecas de fluxogramas geram estilos padrão difíceis de customizar sem conflito. SVG inline permite controle total de aparência e animações de entrada. O custo de desenvolvimento é maior, mas o resultado visual é superior e elimina uma dependência de bundle.

---

## Pendências Registradas

| ID | Descrição | Status |
|----|-----------|--------|
| P-01 | Fotografia `profile-main.webp` — aguardando arquivo do profissional | Aberta |
| P-02 | Modelo 3D do cérebro `.glb` — localizar ou usar fallback procedural | Aberta |
| P-03 | Node.js com npm não está no PATH do ambiente Windows | Aberta |
| P-04 | Nome completo do profissional aguarda confirmação de grafia | Aberta |
| P-05 | Nome do repositório GitHub — necessário para configurar base path do Vite | ✅ Resolvida: `portfolio-douglas` |

---

## Histórico de Versões

| Versão | Data | Descrição |
|--------|------|-----------|
| 1.0 | 2025 | Criação inicial após descoberta do workspace e análise do prompt |
