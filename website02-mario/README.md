# 🎮 Super Mario World - Edição Especial SENAI

Um jogo de plataforma 2D completo inspirado nos clássicos da franquia *Super Mario World*, desenvolvido com tecnologias web puras (**HTML5 Canvas**, **CSS3 moderno** e **JavaScript Vanilla**), sem dependência de bibliotecas externas ou frameworks.

O jogo traz uma homenagem ao **SENAI**, integrando a logomarca oficial como um item colecionável de alta tecnologia que concede superpoderes lendários ao personagem principal!

---

## 🚀 Como Executar o Jogo no Navegador

O projeto foi construído para funcionar de maneira 100% autônoma, sem necessidade de build ou compilação.

### Opção 1: Execução Direta (Mais simples)
1. Abra a pasta do projeto no seu computador.
2. Dê um duplo clique no arquivo [`index.html`](index.html) para abri-lo diretamente em qualquer navegador moderno (Google Chrome, Microsoft Edge, Mozilla Firefox, Opera, Safari).

### Opção 2: Servidor Local (Recomendado para melhor suporte de áudio e tela cheia)
Caso prefira rodar através de um servidor HTTP local:

- **Via Python:**
  ```bash
  python -m http.server 8080
  ```
  Acesse no navegador: `http://localhost:8080`

- **Via Node.js (npx):**
  ```bash
  npx serve .
  ```

- **Via VS Code:**
  Clique com o botão direito em `index.html` e selecione **"Open with Live Server"**.

---

## 🖼️ Configuração do Arquivo de Imagem da Logomarca SENAI

O projeto já inclui a imagem oficial da logomarca do SENAI configurada e pronta para uso:

1. **Localização dos arquivos de imagem**:
   - `senai-logo.png`: Localizado na raiz do projeto para carregamento direto.
   - `assets/logo-senai.png`: Cópia de backup em alta resolução dentro da pasta `assets/`.
   - `assets/logo-senai.svg`: Vetor SVG oficial.

2. **Como o jogo carrega a imagem**:
   - No arquivo [`js/sprites.js`](js/sprites.js), o objeto `SpriteRenderer` instancia um `new Image()` apontando para `senai-logo.png` com fallback automático para `assets/logo-senai.png`.
   - **Sistema de Fallback Vetorial em Canvas**: Caso a imagem seja movida, renomeada ou demore a carregar, o jogo possui um renderizador vetorial nativo em Canvas que desenha com exatidão matemática o retângulo vermelho oficial (`#ED1C24`), as faixas brancas horizontais e a tipografia "SENAI" estilizada, garantindo que o jogo **nunca quebre ou fique sem visual**.
3. **Substituição da imagem**:
   - Para utilizar qualquer outra versão do logo, basta substituir o arquivo `senai-logo.png` na raiz do projeto mantendo o mesmo nome.

---

## 🕹️ Controles do Jogo

O jogo é totalmente adaptável para **Desktop** e **Dispositivos Móveis (Smartphones e Tablets)**:

### 💻 Teclado (Desktop)
| Ação | Teclas |
| :--- | :--- |
| **Mover para a Esquerda** | Seta para a Esquerda `←` ou Tecla `A` |
| **Mover para a Direita** | Seta para a Direita `→` ou Tecla `D` |
| **Saltar (Pulo Variável)** | Seta para Cima `↑`, Tecla `W` ou `Barra de Espaço` |
| **Agachar** | Seta para Baixo `↓` ou Tecla `S` |
| **Correr / Acelerar** | Tecla `Shift`, `X` ou `J` |
| **Pausar / Despausar** | Tecla `P` ou `Esc` |

> 💡 **Pulo de Altura Variável**: Assim como no clássico Super Mario World, um toque rápido na tecla de pulo produz um pequeno salto, enquanto segurar a tecla permite alcançar a altura máxima!

### 📱 Dispositivos Móveis (Touch Screen)
O jogo detecta automaticamente telas sensíveis ao toque e exibe botões virtuais translúcidos na base da tela:
- **D-Pad `◀` e `▶`**: Movimentação horizontal.
- **Botão `A`**: Salto.
- **Botão `B`**: Corrida / Sprint.
- **Botão `⏸`**: Pausa.

---

## ⚡ O Item Especial: Logomarca SENAI e Superpoderes

Ao longo da fase, o jogador encontrará o item especial da **Logomarca do SENAI** flutuando com uma aura de energia tecnológica pulsante e partículas douradas:

1. **Como encontrar**:
   - Flutuando em pedestais nobres em pontos estratégicos do mapa.
   - Escondido dentro de blocos de interrogação misteriosos `[?]` dourados que emergem ao serem golpeados por baixo.

2. **Superpoderes Concedidos (Modo Técnico SENAI - 15 segundos)**:
   - **Aura & Visual de Alta Tecnologia**: Mario veste o chapéu com o emblema "S" do SENAI, uma aura de energia elétrica neon (vermelha e ciano) o envolve, e ele deixa rastros luminosos (*after-images*) ao correr.
   - **Super Velocidade**: Aumento de 60% na velocidade máxima de corrida com aceleração turbo.
   - **Super Salto**: Impulso gravitacional aumentado em 25%, permitindo alcançar plataformas elevadas e atalhos aéreos.
   - **Invencibilidade Total**: O personagem destrói qualquer inimigo ao mero contato físico, gerando explosões de partículas, sons de impacto cibernético e bônus de **+1000 pontos**!
   - **Destruição de Tijolos**: Mario pode quebrar blocos de tijolos apenas batendo a cabeça neles, estilhaçando-os em fragmentos de pedra com pontuação extra!
   - **HUD & Cronômetro Dinâmico**: Uma barra de energia no topo da tela exibe o tempo restante do superpoder em tempo real.

---

## 🌟 Recursos e Mecânicas Implementadas

- **Física de Plataforma Completa**: Gravidade realista, inércia, desaceleração por atrito com o solo, detecção de colisões separada nos eixos X e Y (*Axis-Aligned Bounding Box* - AABB), *Coyote Time* e *Jump Buffering* para controles responsivos e suaves.
- **Inimigos Clássicos**:
  - *Goomba*: Patrulha o solo e é esmagado quando o jogador pula em sua cabeça (+200 pontos).
  - *Koopa Troopa*: Ao levar um pisão, encolhe-se em seu casco verde (+300 pontos). O casco pode ser chutado pelo jogador para derrotar outros obstáculos!
- **Sistema de Áudio 100% Procedural (Web Audio API)**:
  - Síntese de ondas (quadrada, triangular, senoidal e ruído branco) para criar efeitos sonoros de 16-bits idênticos aos videogames retrô: pulo, coleta de moedas, fanfarra do power-up SENAI, impactos, dano, vitória e game over.
  - Música de fundo temática retrô chiptune em tempo real com botão de ligar/desligar.
  - **Zero arquivos MP3/WAV externos**: O jogo nunca apresentará erros de carregamento de áudio (*404* ou falhas de codec).
- **Cenário Parallax em Múltiplas Camadas**:
  - Céu em gradiente suave.
  - Nuvens no estilo Super Mario World.
  - Montanhas distantes com sombreamento e colinas verdes médias com arbustos.
- **Reta Final e Mastro da Vitória**:
  - Escadaria clássica de blocos de pedra.
  - Mastro com bandeira do SENAI que desliza ao ser tocada pelo jogador.
  - Animação de nível concluído, fanfarra de vitória, chuva de confetes e tela de pontuação com classificação por Rank (*S+ Mestre SENAI*, *A Especialista*, etc.).

---

## 📁 Estrutura do Projeto

```
website02-mario/
├── index.html          # Estrutura principal da página, HUD, telas e modais
├── README.md           # Documentação completa de uso e execução
├── senai-logo.png      # Imagem oficial da Logomarca SENAI (raiz)
├── senai-logo.svg      # Vetor SVG oficial da Logomarca SENAI
├── assets/
│   ├── logo-senai.png  # Cópia em alta resolução da Logomarca SENAI
│   └── logo-senai.svg  # Vetor SVG na pasta de assets
├── css/
│   └── style.css       # Estilos CSS3 modernos, responsividade, glassmorphism e HUD
└── js/
    ├── audio.js        # Sintetizador de áudio procedural 16-bit com Web Audio API
    ├── sprites.js      # Motor gráfico e gerador de sprites e partículas em Canvas
    └── game.js         # Lógica do jogo, física, câmera, colisões e gerenciamento de estado
```
