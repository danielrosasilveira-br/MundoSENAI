# Missão Hardware — Aventura Dentro do Computador

> Uma experiência gamificada, interativa e offline desenvolvida para estudantes de aproximadamente 12 anos desvendarem o funcionamento interno do computador.
> Projeto educativo desenvolvido com a identidade visual institucional do **SENAI**.

---

## 1. Descrição do Projeto

**Missão Hardware** transforma o aprendizado de informática em uma jornada épica. O estudante é convidado a "encolher de tamanho" e explorar uma metrópole de silício construída sobre placas de circuito impresso. Em vez de aulas puramente teóricas ou diagramas estáticos, o estudante interage diretamente com simulações táteis:
- Envia contas aritméticas para a Unidade Lógica e Aritmética (ULA) do processador;
- Abre programas e desliga a máquina para vivenciar a volatilidade da memória RAM;
- Inspeciona os soquetes e conectores da placa-mãe;
- Compara a velocidade eletrônica de chips SSD com o giro mecânico de discos HD;
- Distribui tensões estabilizadas de 12V, 5V e 3.3V a partir da fonte de alimentação;
- Classifica periféricos de entrada, saída e mistos;
- Monta um computador peça por peça no laboratório virtual;
- Desafia a Arena do Conhecimento em um quiz dinâmico com pontuação de 0 a 10.

---

## 2. Objetivo Educativo

- **Público-alvo:** Estudantes do Ensino Fundamental II (aproximadamente 12 anos).
- **Abordagem Pedagógica:** Metodologia ativa e gamificação construtiva. Erros não geram punição ou desconto de pontos; servem como oportunidade explicativa de aprendizado.
- **Competências Trabalhadas:**
  - Compreensão da arquitetura básica de Von Neumann (entrada, processamento, memória temporária, armazenamento persistente e saída);
  - Diferenciação clara entre processar (CPU), memorizar temporariamente (RAM) e armazenar permanentemente (SSD/HD);
  - Noções de compatibilidade física e segurança elétrica em hardware;
  - Raciocínio lógico e classificação funcional.

---

## 3. Tecnologias Utilizadas

- **HTML5 Semântico:** Estruturação acessível com marcos WAI-ARIA, `aria-live`, títulos hierárquicos e suporte a leitores de tela.
- **CSS3 Moderno:** Mobile-first, CSS Grid, Flexbox, variáveis customizadas globais e `@media (prefers-reduced-motion: reduce)`.
- **Vanilla JavaScript (ES6+):** Arquitetura modular sem frameworks pesados, garantindo carregamento ultrarrápido e zero dependências externas.
- **Web Audio API:** Motor sintetizador de efeitos sonoros com geração procedural de timbres (sem arquivos de áudio externos propensos a erros de codec ou 404).
- **LocalStorage com Fallback em Memória:** Persistência transparente de progresso, estrelas, melhor pontuação e preferências.
- **Progressive Web App (PWA):** `manifest.webmanifest` e `service-worker.js` com estratégia Cache-First para funcionamento 100% offline.

---

## 4. Estrutura de Pastas e Arquivos

```text
website04-hardware/
│
├── index.html                 # Mapa interativo da cidade tecnológica e hub central
├── processador.html           # Módulo 01: Processador (CPU), instruções e ULA
├── memoria-ram.html           # Módulo 02: Memória RAM, alocação e volatilidade
├── placa-mae.html             # Módulo 03: Placa-mãe, soquetes, slots e compatibilidade
├── armazenamento.html         # Módulo 04: Armazenamento persistente SSD vs HD
├── fonte.html                 # Módulo 05: Fonte de alimentação e rede elétrica
├── perifericos.html           # Módulo 06: Periféricos de entrada, saída e híbridos
├── montagem.html              # Bancada de montagem virtual (2 etapas)
├── quiz.html                  # Arena do Conhecimento (5 perguntas dinâmicas)
├── resultado.html             # Tela de conquistas, troféus e celebração pedagógica
│
├── manifest.webmanifest       # Manifesto de instalação da PWA
├── service-worker.js          # Cache e suporte offline completo
├── test-runner.js             # Suíte de testes automatizados (389 verificações)
├── README.md                  # Documentação completa do projeto
│
├── assets/
│   ├── images/
│   │   └── logo-senai.png     # Logomarca oficial do SENAI anexada ao projeto
│   ├── icons/
│   │   ├── favicon.svg        # Favicon vetorial com circuito integrado
│   │   ├── icon-192.png       # Ícone PWA 192x192 px
│   │   ├── icon-512.png       # Ícone PWA 512x512 px
│   │   └── icon-maskable.png  # Ícone PWA adaptável 512x512 px
│   └── fonts/
│       ├── fonts.css          # Declaração @font-face local
│       ├── NunitoSans-*.ttf   # Família Nunito Sans (Regular, SemiBold, Bold)
│       ├── Oxanium-*.ttf      # Família Oxanium (SemiBold, Bold, ExtraBold)
│       └── SpaceMono-*.ttf    # Família Space Mono (Regular, Bold)
│
├── css/
│   ├── base.css               # Variáveis da paleta, reset, tipografia e acessibilidade
│   ├── layout.css             # Cabeçalho SENAI, HUD de progresso, grid e rodapé
│   ├── components.css         # Botões gamificados 3D, painéis, modais e alertas
│   ├── animations.css         # Pulsos de circuito, fluxos de dados e confetes
│   └── pages.css              # Estilos específicos para mapa, simuladores e bancada
│
└── js/
    ├── storage.js             # Gerenciamento de LocalStorage e progresso persistente
    ├── audio.js               # Sintetizador sonoro Web Audio API (mudo por padrão)
    ├── progress.js            # HUD em tempo real, cálculo de progresso e notificações
    ├── navigation.js          # Menu ativo, controle de áudio e modal de reset
    ├── map.js                 # Mapa interativo em SVG e navegação por pontos de interesse
    ├── components.js          # Simuladores interativos dos 6 módulos educativos
    ├── assembly.js            # Lógica da bancada de montagem virtual em 2 etapas
    ├── quiz.js                # Mecânica da Arena do Conhecimento (IDs estáveis)
    ├── results.js             # Cálculo de troféus, mensagens de incentivo e confetes
    ├── pwa.js                 # Registro de Service Worker e botão de instalação
    ├── app.js                 # Inicializador e orquestrador global
    └── data/
        └── questions.js       # Banco local de questões educativas
```

---

## 5. Funcionalidades Implementadas

1. **Mapa Interativo (Cidade do Silício):** Cenário SVG explorável com 8 pontos de interesse clicáveis e navegáveis por teclado.
2. **Simulador de Ciclo de Instrução (CPU):** Execução passo a passo (Busca, Decodificação, Execução na ULA e Gravação) com cálculo personalizável.
3. **Simulador de Memória RAM:** Abertura e fechamento de programas ocupando blocos de memória e botão de desligamento para comprovação prática da volatilidade.
4. **Explorador da Placa-Mãe:** Inspeção detalhada de soquetes de CPU, slots DDR, slots PCIe, portas SATA/M.2, conector ATX e conexões traseiras.
5. **Comparador SSD vs HD:** Confronto técnico lado a lado e simulação de gravação de 500 MB comparando pratos magnéticos e chips de silício.
6. **Distribuidor de Energia (Fonte):** Ativação de chave geral com energização das linhas de 12V, 5V e 3.3V com alerta de segurança sobre capacitores.
7. **Classificador de Periféricos:** Separação de Monitor, Teclado, Mouse, Webcam, Impressora e Fones por drag-and-drop ou seleção acessível com feedback imediato.
8. **Montagem Virtual em 2 Etapas:**
   - *Etapa 1:* Encaixe no chassi da Placa-Mãe, CPU, Memória RAM, SSD e Fonte.
   - *Etapa 2:* Conexão traseira dos periféricos (HDMI, USBs, Áudio P2).
9. **Quiz Arena Dinâmico:** Sorteio de 5 perguntas a cada rodada a partir do banco de dados, alternativas embaralhadas com IDs estáveis, 2 pontos por questão (total 10) e feedback explicativo.
10. **Painel de Resultados e Conquistas:** Mensagens pedagógicas personalizadas por faixa de desempenho (0-4, 6, 8 e 10 pontos), troféu ilustrado e confetes moderados.
11. **Áudio Procedural:** Sons sintetizados para cliques, encaixes, acertos e fanfarras (desativado por padrão, com botão de ativação e controle de volume).
12. **Persistência Completa:** Salva módulos visitados, estrelas, melhor pontuação e progresso da montagem sem necessidade de login.

---

## 6. Como Executar Localmente

Como o projeto utiliza recursos modernos de PWA e Service Worker, ele deve ser executado através de um servidor HTTP local (e não abrindo diretamente por `file://`, pois navegadores bloqueiam Service Workers nesse protocolo por segurança).

### Opção 1: Usando Node.js (Recomendado)
Se tiver Node.js instalado:
```bash
# Na pasta raiz do projeto:
npx serve .
# ou:
npx http-server -p 8080 .
```
Abra seu navegador em `http://localhost:3000` (ou na porta informada no terminal).

### Opção 2: Usando Python
Se tiver Python instalado:
```bash
# Python 3:
python -m http.server 8000
```
Abra seu navegador em `http://localhost:8000`.

### Opção 3: Extensão do VS Code / Antigravity
Utilize extensões como **Live Server** clicando com o botão direito em `index.html` -> "Open with Live Server".

---

## 7. Como Testar a Aplicação

Para executar a suíte de testes automatizados inclusa no projeto:
```bash
node test-runner.js
```
A suíte verifica automaticamente:
- A sintaxe e compilação de todos os arquivos JavaScript;
- A existência e integridade das 10 páginas HTML;
- Todos os links internos e recursos vinculados (imagens, ícones, CSS, JS);
- A presença e integridade da imagem oficial da logomarca do SENAI;
- O carregamento de todas as fontes locais (Nunito Sans, Oxanium, Space Mono);
- A integridade do banco de questões do Quiz;
- A estrutura do `manifest.webmanifest` e os arquivos pré-cacheados do Service Worker.

---

## 8. Como Testar a Montagem Virtual e o Quiz

### Montagem Virtual (`montagem.html`):
1. Acesse `montagem.html` pelo menu ou pelo mapa.
2. **Método Mouse:** Arraste uma peça da bancada à esquerda para a área correspondente no gabinete.
3. **Método Teclado / Toque Acessível:** Clique na peça desejada (ela ficará com destaque coral). Em seguida, clique no local correspondente no chassi.
4. Experimente encaixar uma peça no local errado: observe a mensagem explicativa sem qualquer punição.
5. Ao concluir os 5 componentes internos, o sistema transita automaticamente para a Etapa 2 (cabos e periféricos). Conecte todos para receber a celebração de campeão da montagem.

### Arena do Quiz (`quiz.html`):
1. Acesse `quiz.html`.
2. O sistema sorteia 5 questões aleatórias do banco de 12 perguntas e embaralha as alternativas.
3. Selecione uma resposta e clique em **"Confirmar Resposta"**.
4. Veja a explicação detalhada da alternativa e o som correspondente (se ativado).
5. Ao responder as 5 questões, avance para `resultado.html` para consultar sua nota (0 a 10) e medalha.

---

## 9. Como Instalar a PWA

1. Abra a aplicação em um navegador compatível (Google Chrome, Microsoft Edge, Brave, Safari no iOS ou Chrome no Android) através de um endereço seguro (`localhost` ou hospedagem HTTPS).
2. Na barra de navegação superior, clique no botão **"📥 Instalar PWA"** (ou no ícone de instalação na barra de endereços do navegador).
3. Confirme a instalação. O aplicativo será adicionado à sua área de trabalho ou tela inicial como um app independente de janela própria.

---

## 10. Como Verificar o Funcionamento Offline

1. Abra a aplicação e navegue por 2 ou 3 páginas para que o Service Worker instale e grave os recursos essenciais em cache.
2. Abra o Painel do Desenvolvedor (F12) -> aba **Application** (ou Rede/Network).
3. Em **Network**, marque a opção **Offline** (ou desconecte o Wi-Fi do seu dispositivo).
4. Atualize a página (`F5` ou `Ctrl + R`).
5. Observe que:
   - Todas as 10 páginas continuam carregando instantaneamente;
   - A logomarca oficial do SENAI continua visível;
   - As fontes Oxanium, Nunito Sans e Space Mono continuam estilizadas;
   - O mapa interativo, a montagem virtual e o quiz funcionam 100%;
   - O indicador no rodapé exibe `Trabalhando 100% Offline 🚀`.

---

## 11. Requisitos para Publicação em Hospedagem HTTPS

Para publicar em servidores de produção (ex.: GitHub Pages, Vercel, Netlify, servidores institucionais SENAI):
1. **Protocolo Seguro (HTTPS):** É obrigatório para o registro do Service Worker e para o prompt de instalação de PWA (exceto em `localhost`).
2. **Caminhos Relativos:** Toda a estrutura de arquivos utiliza caminhos relativos (`./css/`, `./assets/`), permitindo que o site funcione tanto na raiz do domínio quanto em subdiretórios (ex.: `https://senai.br/missao-hardware/`).
3. **MIME Types Recomendados:**
   - `.webmanifest`: `application/manifest+json`
   - `.ttf`: `font/ttf`
   - `.svg`: `image/svg+xml`

---

## 12. Como Atualizar os Arquivos e o Cache

No arquivo `service-worker.js`:
1. Quando realizar alterações nos arquivos HTML, CSS ou JS, incremente a constante de versão:
   ```javascript
   const CACHE_NAME = 'missao-hardware-v1.0.1'; // incremente a versão
   ```
2. O Service Worker ativará o novo ciclo de instalação e apagará automaticamente caches antigos na inicialização seguinte, sem comprometer o progresso do estudante salvo no LocalStorage.

---

## 13. Onde Alterar a Paleta de Cores

Todas as cores da identidade visual estão centralizadas no arquivo `css/base.css` no seletor `:root`:

```css
:root {
  --verde-floresta: #173F35;  /* Navegação, cabeçalhos e áreas estruturais */
  --verde-lima:     #C5F05A;  /* Botões principais, progresso e conclusão */
  --coral:          #FF765E;  /* Desafios, interações e chamadas de atenção */
  --amarelo-manga:  #FFD166;  /* Estrelas, medalhas, troféus e recompensas */
  --turquesa:       #43C6B7;  /* Circuitos, conexões e fluxos de dados */
  --creme-claro:    #FFF6E5;  /* Superfícies de leitura e painéis educativos */
}
```

---

## 14. Onde Alterar as Fontes Tipográficas

- **Declaração @font-face:** `assets/fonts/fonts.css`.
- **Arquivos físicos:** Armazenados localmente em `assets/fonts/` (extensão `.ttf`).
- **Definição de variáveis:** No topo de `css/base.css`:
  - `--fonte-titulos`: `"Oxanium", sans-serif;`
  - `--fonte-textos`: `"Nunito Sans", sans-serif;`
  - `--fonte-indicadores`: `"Space Mono", monospace;`

---

## 15. Onde Editar o Conteúdo Educativo

Os textos e explicações pedagógicas de cada componente de hardware estão diretamente em seus respectivos arquivos HTML, organizados por seções semânticas:
- Processador: `processador.html`
- Memória RAM: `memoria-ram.html`
- Placa-Mãe: `placa-mae.html`
- Armazenamento SSD/HD: `armazenamento.html`
- Fonte de Alimentação: `fonte.html`
- Periféricos: `perifericos.html`

---

## 16. Onde Adicionar Perguntas ao Quiz

O banco de dados das questões está localizado no arquivo:
`js/data/questions.js`

Para adicionar uma nova pergunta, insira um novo objeto na lista `HARDWARE_QUESTIONS` seguindo o modelo:

```javascript
{
  id: 'q_novo_identificador',
  topic: 'processador', // ou memoria-ram, placa-mae, armazenamento, fonte, perifericos, montagem
  question: 'Enunciado claro e adequado para estudantes de 12 anos?',
  explanation: 'Explicação pedagógica amigável apresentada após a resposta.',
  options: [
    { id: 'opt_1', text: 'Alternativa correta.', correct: true },
    { id: 'opt_2', text: 'Alternativa incorreta 1.', correct: false },
    { id: 'opt_3', text: 'Alternativa incorreta 2.', correct: false },
    { id: 'opt_4', text: 'Alternativa incorreta 3.', correct: false }
  ]
}
```

---

## 17. Como Funciona o Armazenamento Local

- Toda a persistência é gerenciada por `js/storage.js` utilizando a API nativa `window.localStorage`.
- Se o navegador estiver em navegação anônima estrita com armazenamento bloqueado, o sistema ativa automaticamente um fallback em memória transitória, permitindo que a sessão atual funcione sem erros.
- **Chaves Utilizadas:**
  - `missao_hardware_visited`: Lista de módulos já explorados pelo aluno;
  - `missao_hardware_stars`: Estrelas de conquistas adquiridas;
  - `missao_hardware_quiz_best`: Melhor pontuação obtida no Quiz (0 a 10);
  - `missao_hardware_quiz_attempts`: Contador de tentativas realizadas;
  - `missao_hardware_assembly`: Estado das etapas da montagem virtual;
  - `missao_hardware_sound_enabled`: Preferência de som ligada/desligada;
  - `missao_hardware_sound_volume`: Nível de volume ajustado.
- Nenhum dado pessoal do estudante é solicitado ou armazenado.

---

## 18. Onde Está Armazenada a Logomarca do SENAI

A logomarca está localizada em:
`assets/images/logo-senai.png`

---

## 19. Qual Arquivo da Logomarca Foi Utilizado

- **Arquivo de Origem:** Imagem oficial fornecida em anexo pelo usuário (`media_1793296793493_7d1ced2a.png`).
- **Arquivo no Projeto:** Preservado integralmente sem distorções, sem filtros de cor e sem cortes em `assets/images/logo-senai.png` (29.439 bytes).
- **Tratamento Visual:** Apresentada em um box branco de cantos arredondados no cabeçalho institucional com margem de respiro, preservando o contraste e a visibilidade em qualquer dispositivo.

---

## 20. Limitações Conhecidas

1. **Protocolo Local `file://`:** Por políticas rígidas de segurança de navegadores modernos, Service Workers e manifestos PWA só ativam através de `http://localhost` ou conexões criptografadas `https://`.
2. **Autoplay de Áudio:** Navegadores modernos proíbem a reprodução automática de som antes do primeiro clique do usuário. O projeto respeita rigorosamente essa regra: o som começa desativado por padrão e só emite sons após o estudante clicar no botão de ativação de som ou em qualquer elemento interativo da tela.
3. **Sensores de Hardware Externos:** Por motivos de privacidade e conformidade educativa para menores, a aplicação não solicita permissão para acessar a câmera ou microfone físicos do estudante, utilizando simulações gráficas e lógicas.

---

*Desenvolvido com excelência técnica e pedagógica para o ecossistema educativo do SENAI.*

