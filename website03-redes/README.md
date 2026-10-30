# Missão: Mundo das Redes 🌐🎮

> **Aplicação Web Educativa Interativa** desenvolvida com a identidade institucional do **SENAI** para ensinar fundamentos de redes de computadores a estudantes de aproximadamente 12 anos através de uma experiência imersiva de videogame em uma cidade inteligente.

---

## 1. Descrição do Projeto

**“Missão: Mundo das Redes”** é uma aplicação web funcional, lúdica e responsiva que transforma o aprendizado de redes e internet em uma jornada de exploração de uma cidade digital conectada. 

O aluno assume o papel de um explorador tecnológico, descobrindo:
- O que são redes de computadores e por que os dispositivos se conectam.
- Como equipamentos (computadores, notebooks, smartphones, roteadores e switches) conversam entre si.
- Como uma mensagem é dividida em pacotes e roteada até o destino correto.
- Como a internet global funciona e o que acontece quando acessamos um site ou assistimos a vídeos.
- As diferenças práticas entre conexões cabeadas (estabilidade, cabos de rede) e transmissões sem fio por Wi-Fi (mobilidade, ondas eletromagnéticas).
- Um questionário final na **Arena do Conhecimento** com pontuação automática (0 a 100) e premiação por medalhas (Ouro, Prata, Bronze, Participação e Explorador Iniciante).

---

## 2. Objetivos Pedagógicos

- **Linguagem Apropriada:** Textos objetivos, conceitos simplificados e frases curtas sem abrir mão da precisão técnica.
- **Analogias Claras:** A cidade inteligente é comparada a uma rede onde computadores são casas e as conexões são avenidas por onde os dados trafegam.
- **Aprendizagem Ativa:** O estudante não apenas lê, mas interage com equipamentos, configura parâmetros de envio de pacotes e testa conexões.
- **Feedback Formativo Positivo:** Erros são tratados como oportunidades de aprendizado, com explicações imediatas e encorajamento constante.
- **Sem Mascotes Distrativos:** O protagonismo visual é dos próprios equipamentos de rede, dos fluxos de dados e da infraestrutura da cidade inteligente.

---

## 3. Tecnologias Utilizadas

- **HTML5 Semântico:** Estruturação acessível com títulos hierárquicos (`h1` a `h4`), tags semânticas (`header`, `main`, `section`, `article`, `footer`) e atributos ARIA.
- **CSS3 Moderno:** Variáveis CSS (`:root`), Flexbox, CSS Grid, filtros de vidro (*glassmorphism*), animações fluidas (`@keyframes`) e suporte a `prefers-reduced-motion`.
- **JavaScript Vanilla (ES6+):** Código limpo e modular sem frameworks pesados, garantindo execução ultrarrápida e compatibilidade com navegadores modernos.
- **SVG (Scalable Vector Graphics):** Ilustrações vetoriais nítidas em qualquer densidade de pixels para prédios, cabos de rede, equipamentos, roteadores, antenas e medalhas.
- **Canvas API:** Renderização leve de efeitos de celebração e confetes na tela de resultados.
- **Web Audio API:** Síntese de efeitos sonoros diretamente pelo navegador sem dependência de arquivos de áudio externos protegidos por direitos autorais, com botão de controle de áudio (Mudo/Ativado por padrão silencioso).

---

## 4. Estrutura de Diretórios

```
website03-redes/
├── index.html                  # Tela inicial de abertura do videogame
├── pages/
│   ├── mapa.html               # Mapa de fases da Cidade Inteligente
│   ├── missao-redes.html       # Missão 1: Conectando o Mundo (Redes Locais)
│   ├── missao-internet.html    # Missão 2: A Grande Rede Mundial (Internet)
│   ├── laboratorio.html        # Laboratório Virtual: Cabo vs Wi-Fi
│   ├── quiz.html               # Arena do Conhecimento (Questionário com 5 questões)
│   └── resultado.html          # Resultado Final e Conquista de Medalha
├── css/
│   ├── style.css               # Design system, variáveis, botões, modais e base
│   ├── animations.css          # Animações de pacotes, pulsos, ondas e transições
│   ├── map.css                 # Layout do mapa em grid desktop e trilha mobile
│   ├── missions.css            # Estilos do explorador, simulador e desafios
│   └── quiz.css                # Estilos da arena, alternativas, medalhas e resultado
├── js/
│   ├── storage.js              # Gerenciador de persistência (localStorage + fallback)
│   ├── progress.js             # Cálculo de avanço global e atualização do HUD
│   ├── main.js                 # Sintetizador de áudio Web Audio API e toasts
│   ├── navigation.js           # Controle acessível de modais e tecla ESC
│   ├── missions.js             # Lógica das Missões 1 e 2 e seus simuladores
│   ├── laboratory.js           # Lógica do Laboratório Virtual (Cabo vs Wi-Fi)
│   ├── quiz.js                 # Lógica de perguntas, validação e pontuação do quiz
│   └── results.js              # Classificação por medalhas e confetes em canvas
├── assets/
│   ├── logo/
│   │   └── senai-logo.png      # Logomarca oficial do SENAI
│   ├── images/                 # Diretório para imagens complementares
│   ├── icons/                  # Diretório para ícones vetoriais
│   └── sounds/                 # Diretório para efeitos sonoros opcionais
└── README.md                   # Documentação técnica e pedagógica completa
```

---

## 5. Como Abrir e Executar o Projeto

O projeto é 100% estático e não exige instalação de Node.js, banco de dados ou compiladores.

### Opção 1: Via VS Code com a Extensão Live Server (Recomendado)
1. Abra a pasta do projeto no **Visual Studio Code**.
2. Certifique-se de que a extensão **Live Server** (de *Ritwick Dey*) esteja instalada.
3. Clique com o botão direito sobre o arquivo `index.html` e selecione **“Open with Live Server”** (ou clique em *Go Live* no canto inferior direito).
4. O navegador abrirá automaticamente no endereço local (ex.: `http://127.0.0.1:5500/index.html`).

### Opção 2: Via Servidor HTTP Local (Python ou equivalente)
No terminal do Windows (PowerShell), execute na pasta do projeto:
```powershell
python -m http.server 8000
```
Em seguida, abra o navegador em `http://localhost:8000`.

### Opção 3: Execução Direta
Dê um duplo clique no arquivo `index.html` para abrir diretamente no navegador padrão.

---

## 6. Identidade Visual e Logomarca Oficial do SENAI

- O projeto utiliza o arquivo oficial da logomarca do SENAI salvo em `assets/logo/senai-logo.png`.
- A imagem é exibida de forma proporcional, sem distorções, com altura controlada e textos alternativos acessíveis em todas as páginas.
- **Para atualizar a logomarca:** Basta substituir o arquivo `assets/logo/senai-logo.png` preservando o mesmo nome e formato, ou atualizar o caminho na tag `<img>` presente no `<header>` de cada arquivo HTML.

---

## 7. Como Modificar as Perguntas do Questionário

As questões da **Arena do Conhecimento** estão centralizadas no arquivo [`js/quiz.js`](file:///d:/Dev/MundoSENAI/website03-redes/js/quiz.js) no array `QUIZ_QUESTIONS`.

Cada questão possui a seguinte estrutura:
```javascript
{
  id: 1,
  title: 'Título da Questão',
  prompt: 'Texto do enunciado com linguagem adequada para 12 anos',
  illustrationSvg: `<svg>...</svg>`, // Ilustração em SVG incorporada
  options: [
    { letter: 'A', text: 'Opção correta', correct: true },
    { letter: 'B', text: 'Opção incorreta', correct: false },
    { letter: 'C', text: 'Opção incorreta', correct: false },
    { letter: 'D', text: 'Opção incorreta', correct: false }
  ],
  explanation: 'Explicação pedagógica amigável da resposta correta'
}
```
Para alterar ou adicionar perguntas, basta editar os textos e a propriedade `correct: true` na alternativa correta.

---

## 8. Sistema de Pontuação e Medalhas

O questionário final avalia o aprendizado por meio de 5 perguntas objetivas valendo **20 pontos cada**:

| Acertos | Nota Final | Medalha Conquistada | Efeito / Celebração |
|:---:|:---:|:---|:---|
| **5** | **100** | 🥇 **MEDALHA DE OURO** | Troféu Dourado, Fanfarra de Vitória e Chuva de Confetes |
| **4** | **80** | 🥈 **MEDALHA DE PRATA** | Brasão Prateado com Estrela e Confetes |
| **3** | **60** | 🥉 **MEDALHA DE BRONZE** | Medalha de Bronze com Engrenagem Tecnológica |
| **2** | **40** | 🎖️ **MEDALHA DE PARTICIPAÇÃO** | Insígnia Azul de Incentivo |
| **1 ou 0** | **20 ou 0** | 🧭 **EXPLORADOR INICIANTE** | Bússola Tecnológica de Aprendizado |

O sistema incentiva o estudante a refazer o questionário ou revisar as missões para alcançar a pontuação máxima, sem penalizações ou mensagens depreciativas.

---

## 9. Armazenamento Local (localStorage)

O estado do progresso do jogo é gerenciado por [`js/storage.js`](file:///d:/Dev/MundoSENAI/website03-redes/js/storage.js):
- **O que é salvo:** Conclusão da Missão 1, Missão 2 e Laboratório; última nota do questionário; melhor nota obtida; preferência de áudio ativado/mudo.
- **Sem Coleta de Dados:** O sistema não solicita login, cadastro, e-mails, nomes ou dados pessoais.
- **Privacidade e Segurança:** O armazenamento é estritamente local ao navegador do aluno. O professor ou instrutor não tem acesso remoto a essas informações via rede externa.
- **Reinício do Progresso:** Na página do Mapa há um botão para reiniciar o progresso, que exige confirmação modal explícita antes de limpar os dados.
- **Tolerância a Falhas:** Caso o navegador esteja com cookies/armazenamento desativado ou em modo anônimo com restrições rígidas, o sistema utiliza automaticamente uma memória interna (*in-memory fallback*), mantendo a navegabilidade sem gerar erros no console.

---

## 10. Responsividade: Desktop, Tablets e Smartphones

O layout foi desenvolvido seguindo a abordagem **Mobile First** e validado em diversos formatos de tela:

- **Smartphones (360px, 390px, 430px):**
  - O mapa da cidade adapta-se automaticamente para uma trilha vertical contínua, conectada por conectores visuais.
  - Textos e botões possuem áreas de toque amplas (mínimo de 44px de altura).
  - O questionário exibe uma alternativa por linha com espaçamento confortável.
  - Eliminação completa de rolagem horizontal acidental.
- **Tablets (768px e 1024px):**
  - Grades adaptativas de 2 colunas para cards de dispositivos e recursos.
  - Aproveitamento balanceado do espaço em modo retrato e paisagem.
- **Desktop e Laptops (1280px, 1366px, 1440px e 1920px):**
  - Visual imersivo com mapa em grade distribuída e conexões luminosas vetoriais.
  - Painéis centralizados com largura máxima confortável (`max-width: 1300px`) evitando espaçamento excessivo.

---

## 11. Acessibilidade Implementada

- **Navegação por Teclado:** Todos os botões, links, alternativas do quiz e modais podem ser operados via tecla `Tab`, `Enter` e `Espaço`. A tecla `Escape` fecha os modais imediatamente.
- **Foco Visível:** Indicador de foco destacado com contorno em ciano neon (`:focus-visible`).
- **Contraste de Cores:** Combinações de alto contraste entre texto claro e fundos escuros da cidade digital.
- **Redução de Movimento:** Respeito integral à diretiva `@media (prefers-reduced-motion: reduce)`, desativando animações e transições quando solicitado pelo sistema operacional do usuário.
- **Controle de Som:** O áudio inicia mudo por padrão e só emite sons após ativação intencional pelo usuário.

---

## 12. Testes Funcionais Executados

Durante a homologação técnica da aplicação, os seguintes testes foram realizados:
1. Carregamento e renderização da página inicial com cenário da cidade inteligente e logotipo SENAI.
2. Abertura e fechamento acessível do modal "Como Jogar" via clique no botão e tecla `Esc`.
3. Navegação para o Mapa e verificação do bloqueio inicial (Missão 2 e Arena bloqueadas até concluir a Missão 1).
4. Exploração dos 5 equipamentos da Missão 1 com atualização de descrições.
5. Simulação de envio de pacotes na Missão 1 (Origem -> Roteador -> Destino) com animação de trajeto e áudio.
6. Resolução do desafio da Missão 1 e liberação automática da Missão 2 no Mapa.
7. Execução do simulador de requisição web em 5 etapas da Missão 2 com controles de Iniciar, Pausar e Reiniciar.
8. Conclusão da Missão 2 e liberação da Arena do Conhecimento.
9. Experimentação no Laboratório Virtual nos modos Cabo Físico e Wi-Fi sem fio, testando inspeção e disparos.
10. Execução completa do Questionário Final com as 5 perguntas, confirmação de alternativa única e cálculo de notas em todas as faixas (0, 20, 40, 60, 80 e 100 pontos).
11. Verificação da exibição das medalhas correspondentes (Ouro aos 100 pts, Prata aos 80 pts, Bronze aos 60 pts, Participação aos 40 pts e Iniciante abaixo de 40 pts).
12. Teste de persistência: recarregamento de página mantendo o progresso e melhor nota salva no navegador.
13. Teste do modal de confirmação para reiniciar o progresso.
14. Teste de áudio: alternância entre ligado e mudo, garantindo funcionamento ininterrupto mesmo com som desativado.
15. Validação de responsividade em larguras de 360px, 390px, 430px, 768px, 1024px, 1366px e 1920px.

---

## 13. Limitações Conhecidas

- O progresso é registrado exclusivamente no navegador do dispositivo utilizado pelo aluno (`localStorage`). Caso o aluno troque de computador ou limpe os dados de navegação, o progresso retornará ao início.
- Os efeitos sonoros utilizam a **Web Audio API**, que pode ter seu volume atenuado de acordo com as permissões de multimídia do navegador caso o usuário não tenha interagido com a tela.
