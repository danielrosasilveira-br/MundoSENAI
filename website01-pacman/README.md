# 🕹️ Pac-Man Arcade - Vanilla JavaScript

Um jogo clássico completo do **Pac-Man** desenvolvido exclusivamente com **HTML5 (Canvas)**, **CSS3** e **JavaScript puro (Vanilla JS)**, sem qualquer framework ou biblioteca externa.

---

## 🌟 Principais Recursos e Atualizações Recentes

- **Velocidade Calibrada & Fixed Timestep**:
  - Motor desacoplado da taxa de atualização do monitor através de *Fixed Timestep* (exatos 60 ticks de física por segundo).
  - Funciona na velocidade ideal e perfeita tanto em monitores padrão de 60 Hz quanto em monitores gamers de 120 Hz, 144 Hz, 165 Hz ou 240 Hz.
  - Seletor de velocidade dinâmico no painel (`⚡ Normal`, `⚡ Relaxado`, `⚡ Rápido`).
- **Design 100% Responsivo**:
  - Auto-dimensionamento dinâmico via CSS `clamp()` e `aspect-ratio: 19 / 21`.
  - O jogo se ajusta automaticamente à altura da tela em notebooks, desktops, tablets e smartphones sem cortar o canvas ou exigir rolagem excessiva.
  - Suporte a **gestos de deslize (Touch Swipe)** diretamente na tela/canvas e **D-Pad virtual**.
- **Identidade Visual SENAI**:
  - Logotipo oficial do SENAI aplicado no canto superior da tela com acabamento em moldura neon retrô e efeito glassmorphic responsivo.
- **Inteligência Artificial Clássica dos 4 Fantasmas**:
  - 🔴 **Blinky (Vermelho)**: Perseguidor incansável que busca diretamente a posição do Pac-Man.
  - 🌸 **Pinky (Rosa)**: Emboscador tático que antecipa a trajetória futura do jogador.
  - 🔷 **Inky (Ciano)**: Patrulheiro dinâmico com movimentação mista.
  - 🍊 **Clyde (Laranja)**: Fantasma tímido que se aproxima e recua para o canto inferior.
- **Modo Energizer (Pastilha de Poder)**:
  - Fantasmas ficam azuis e vulneráveis por 7 segundos cravados.
  - Pisca em branco nos momentos finais antes de acabar o efeito.
  - Multiplicador de combo: 200, 400, 800 e 1600 pontos ao devorar múltiplos fantasmas seguidos!
  - Olhinhos dos fantasmas comidos voltam voando para a base central para renascer.
- **Túnel Warp Clássico**: Pac-Man e fantasmas podem entrar pelo túnel da esquerda e sair imediatamente pela direita (e vice-versa).
- **Sistema de Som Retrô Sintetizado (Web Audio API)**:
  - Áudio 8-bit puro gerado proceduralmente em tempo real pelo navegador (sem arquivos `.mp3` ou dependências externas, evitando erros 404 e problemas de CORS).
- **Interface e Estética Arcade Neon**:
  - Gabinete com efeitos glow neon, linhas de varredura CRT suaves e tipografia arcade (*Press Start 2P*).
  - Placar em tempo real com **Pontos**, **Recorde (salvo no LocalStorage)** e **Vidas restantes** em sprites gráficos.
  - Barra de status dinâmica ("Pronto", "Jogando", "Pausado", "Game Over", "Você Venceu!").

---

## 🎮 Comandos e Teclas

| Tecla / Ação | Função |
| :--- | :--- |
| **Setas (`▲`, `▼`, `◀`, `▶`)** | Mover o Pac-Man nas 4 direções |
| **`W`, `A`, `S`, `D`** | Movimentação alternativa |
| **Deslize na Tela (Swipe)** | Controle por gestos em celulares e tablets |
| **Barra de Espaço (`Espaço`)** | Pausar / Continuar o jogo |
| **`M`** | Ligar / Desligar áudio (Mute) |
| **`R`** | Reiniciar a partida imediatamente |
| **Botão `⚡ Velocidade`** | Alternar entre Normal, Relaxado e Rápido |
| **D-Pad Virtual Touch** | Botões direcionais na tela para mobile |

---

## 🚀 Como Executar o Jogo

O jogo é **100% autocontido** em um único arquivo:

### Opção 1: Abrir Diretamente no Navegador
1. Dê um duplo clique no arquivo [`index.html`](file:///d:/Dev/MundoSENAI/website01-pacman/index.html).

### Opção 2: Servidor Local
```bash
python -m http.server 8080
# Acesse no navegador: http://localhost:8080
```
