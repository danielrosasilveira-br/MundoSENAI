/**
 * WEBSITE 01 — PAC-MAN SENAI (js/pacman.js)
 * Jogo 2D em Canvas HTML5 e Vanilla JavaScript puro
 * Desenvolvido para o Projeto Educacional SENAI
 */

(function () {
  'use strict';

  // Configuração e Estado Global do Jogo
  const CANVAS_WIDTH = 532;   // 19 colunas * 28px
  const CANVAS_HEIGHT = 588;  // 21 linhas * 28px
  const TILE_SIZE = 28;
  const COLS = 19;
  const ROWS = 21;

  // Mapa do Labirinto (19x21)
  // 1: Parede, 0: Ponto (10pts), 2: Item Especial / Chip (50pts), 3: Corredor vazio, 4: Porta da casa dos fantasmas, 9: Interior da casa
  const INITIAL_MAP = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,2,1],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,3,1,3,1,1,1,0,1,1,1,1],
    [3,3,3,1,0,1,3,3,3,3,3,3,3,1,0,1,3,3,3],
    [1,1,1,1,0,1,3,1,1,4,1,1,3,1,0,1,1,1,1],
    [3,3,3,3,0,3,3,1,9,9,9,1,3,3,0,3,3,3,3],
    [1,1,1,1,0,1,3,1,1,1,1,1,3,1,0,1,1,1,1],
    [3,3,3,1,0,1,3,3,3,3,3,3,3,1,0,1,3,3,3],
    [1,1,1,1,0,1,3,1,1,1,1,1,3,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
    [1,2,0,1,0,0,0,0,0,3,0,0,0,0,0,1,0,2,1],
    [1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  // Níveis de Dificuldade
  const DIFFICULTY_SETTINGS = {
    1: { name: 'Iniciante', playerSpeed: 2.3, ghostSpeed: 1.5, multiplier: 1.0, frightenedTime: 8000 },
    2: { name: 'Intermediário', playerSpeed: 2.6, ghostSpeed: 2.1, multiplier: 1.5, frightenedTime: 6500 },
    3: { name: 'Avançado', playerSpeed: 3.0, ghostSpeed: 2.7, multiplier: 2.0, frightenedTime: 5000 },
    4: { name: 'Desafio SENAI', playerSpeed: 3.4, ghostSpeed: 3.2, multiplier: 3.0, frightenedTime: 3500 }
  };

  // Sintetizador de Áudio Nativo com Web Audio API
  class SoundFX {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq, duration, type = 'sine', gainVal = 0.08) {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    }

    munch() {
      this.playTone(320, 0.06, 'triangle', 0.05);
    }

    powerup() {
      if (!this.enabled || !this.ctx) return;
      [440, 554, 659, 880].forEach((freq, i) => {
        setTimeout(() => this.playTone(freq, 0.12, 'square', 0.08), i * 60);
      });
    }

    ghostEat() {
      if (!this.enabled || !this.ctx) return;
      [300, 450, 600, 750].forEach((freq, i) => {
        setTimeout(() => this.playTone(freq, 0.08, 'sawtooth', 0.09), i * 50);
      });
    }

    death() {
      if (!this.enabled || !this.ctx) return;
      [400, 350, 300, 250, 200, 150].forEach((freq, i) => {
        setTimeout(() => this.playTone(freq, 0.1, 'sawtooth', 0.09), i * 80);
      });
    }

    victory() {
      if (!this.enabled || !this.ctx) return;
      [523, 659, 784, 1046].forEach((freq, i) => {
        setTimeout(() => this.playTone(freq, 0.2, 'triangle', 0.1), i * 100);
      });
    }
  }

  const sfx = new SoundFX();

  // Variáveis Principais
  let canvas, ctx;
  let mapData = [];
  let totalItemsCount = 0;
  let collectedItemsCount = 0;
  let baseScore = 0;
  let lives = 3;
  let selectedDifficulty = 1;
  let currentMultiplier = 1.0;
  let highScore = 0;

  let gameState = 'START'; // 'START', 'PLAYING', 'PAUSED', 'GAMEOVER', 'WIN'
  let animationFrameId = null;
  let lastTime = 0;
  let frightenedTimer = null;
  let frightenedUntil = 0;

  // Entidades
  let player;
  let ghosts = [];
  let particles = [];

  // Classe do Jogador (ByteBot SENAI)
  class Player {
    constructor() {
      this.resetPosition();
      this.mouthAngle = 0.2;
      this.mouthDir = 1;
    }

    resetPosition() {
      this.x = 9 * TILE_SIZE + TILE_SIZE / 2;
      this.y = 16 * TILE_SIZE + TILE_SIZE / 2;
      this.dirX = 0;
      this.dirY = 0;
      this.nextDirX = 0;
      this.nextDirY = 0;
      this.radius = TILE_SIZE / 2 - 2;
    }

    setNextDirection(dx, dy) {
      this.nextDirX = dx;
      this.nextDirY = dy;
      // Se estiver parado ou invertendo sentido direto, aplica imediatamente se livre
      if (this.dirX === 0 && this.dirY === 0) {
        if (canMoveTo(this.x + dx * 4, this.y + dy * 4, this.radius)) {
          this.dirX = dx;
          this.dirY = dy;
        }
      } else if (this.dirX === -dx && this.dirY === -dy) {
        this.dirX = dx;
        this.dirY = dy;
      }
    }

    update(speed) {
      // Animação da boca
      this.mouthAngle += 0.04 * this.mouthDir;
      if (this.mouthAngle > 0.45) this.mouthDir = -1;
      if (this.mouthAngle < 0.05) this.mouthDir = 1;

      // Tenta aplicar a próxima direção se estiver alinhado com a grade
      if (this.nextDirX !== 0 || this.nextDirY !== 0) {
        const currentTileX = Math.floor(this.x / TILE_SIZE);
        const currentTileY = Math.floor(this.y / TILE_SIZE);
        const centerX = currentTileX * TILE_SIZE + TILE_SIZE / 2;
        const centerY = currentTileY * TILE_SIZE + TILE_SIZE / 2;

        const distToCenter = Math.hypot(this.x - centerX, this.y - centerY);

        if (distToCenter < speed + 1) {
          if (canMoveTo(centerX + this.nextDirX * TILE_SIZE, centerY + this.nextDirY * TILE_SIZE, this.radius)) {
            this.x = centerX;
            this.y = centerY;
            this.dirX = this.nextDirX;
            this.dirY = this.nextDirY;
          }
        }
      }

      // Movimentação contínua
      if (this.dirX !== 0 || this.dirY !== 0) {
        const nextX = this.x + this.dirX * speed;
        const nextY = this.y + this.dirY * speed;

        if (canMoveTo(nextX, nextY, this.radius)) {
          this.x = nextX;
          this.y = nextY;
        } else {
          // Centraliza no tile ao bater na parede
          const currentTileX = Math.floor(this.x / TILE_SIZE);
          const currentTileY = Math.floor(this.y / TILE_SIZE);
          this.x = currentTileX * TILE_SIZE + TILE_SIZE / 2;
          this.y = currentTileY * TILE_SIZE + TILE_SIZE / 2;
          this.dirX = 0;
          this.dirY = 0;
        }
      }

      // Túnel horizontal lateral (wrap-around)
      if (this.x < 0) this.x = CANVAS_WIDTH - 2;
      else if (this.x > CANVAS_WIDTH) this.x = 2;

      // Coleta de itens
      this.checkCollectibles();
    }

    checkCollectibles() {
      const tileX = Math.floor(this.x / TILE_SIZE);
      const tileY = Math.floor(this.y / TILE_SIZE);

      if (tileX >= 0 && tileX < COLS && tileY >= 0 && tileY < ROWS) {
        const cell = mapData[tileY][tileX];
        if (cell === 0) {
          // Ponto comum (10 pontos)
          mapData[tileY][tileX] = 3;
          baseScore += 10;
          collectedItemsCount++;
          sfx.munch();
          createSparkle(this.x, this.y, '#fbbf24');
          checkGameCompletion();
        } else if (cell === 2) {
          // Item especial / Chip de energia (50 pontos + atemoriza inimigos)
          mapData[tileY][tileX] = 3;
          baseScore += 50;
          collectedItemsCount++;
          sfx.powerup();
          createSparkle(this.x, this.y, '#38bdf8', 12);
          activateFrightenedMode();
          checkGameCompletion();
        }
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);

      // Rotação conforme direção
      let angle = 0;
      if (this.dirX === 1) angle = 0;
      else if (this.dirX === -1) angle = Math.PI;
      else if (this.dirY === 1) angle = Math.PI / 2;
      else if (this.dirY === -1) angle = -Math.PI / 2;

      ctx.rotate(angle);

      // Brilho do ByteBot SENAI
      ctx.shadowColor = '#005caa';
      ctx.shadowBlur = 10;

      // Corpo Principal do Personagem (ByteBot)
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, this.mouthAngle * Math.PI, (2 - this.mouthAngle) * Math.PI);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();

      // Borda do Robô
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#d97706';
      ctx.stroke();

      // Olho Tecnológico com reflexo
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(this.radius * 0.25, -this.radius * 0.45, 3.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(this.radius * 0.25 + 0.5, -this.radius * 0.45, 1.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // Classe dos Inimigos (Patrulheiros Robóticos)
  class Ghost {
    constructor(id, name, color, homeTileX, homeTileY) {
      this.id = id;
      this.name = name;
      this.color = color;
      this.homeTileX = homeTileX;
      this.homeTileY = homeTileY;
      this.resetPosition();
    }

    resetPosition() {
      this.x = this.homeTileX * TILE_SIZE + TILE_SIZE / 2;
      this.y = this.homeTileY * TILE_SIZE + TILE_SIZE / 2;
      this.dirX = 0;
      this.dirY = -1;
      this.radius = TILE_SIZE / 2 - 3;
      this.isFrightened = false;
      this.isEaten = false;
    }

    update(speed) {
      let currentSpeed = speed;

      if (this.isEaten) {
        currentSpeed = speed * 1.8; // Volta rápido pra casa
        // Chegou na casa?
        const homeCenterX = this.homeTileX * TILE_SIZE + TILE_SIZE / 2;
        const homeCenterY = this.homeTileY * TILE_SIZE + TILE_SIZE / 2;
        if (Math.hypot(this.x - homeCenterX, this.y - homeCenterY) < 6) {
          this.isEaten = false;
          this.isFrightened = false;
          this.dirY = -1;
        }
      } else if (this.isFrightened) {
        currentSpeed = speed * 0.65; // Mais lento assustado
      }

      // Ao chegar no centro de um tile, escolhe próxima direção válida
      const currentTileX = Math.floor(this.x / TILE_SIZE);
      const currentTileY = Math.floor(this.y / TILE_SIZE);
      const centerX = currentTileX * TILE_SIZE + TILE_SIZE / 2;
      const centerY = currentTileY * TILE_SIZE + TILE_SIZE / 2;

      const distToCenter = Math.hypot(this.x - centerX, this.y - centerY);

      if (distToCenter < currentSpeed + 1) {
        this.x = centerX;
        this.y = centerY;
        this.chooseNextDirection();
      }

      this.x += this.dirX * currentSpeed;
      this.y += this.dirY * currentSpeed;

      // Túnel horizontal lateral
      if (this.x < 0) this.x = CANVAS_WIDTH - 2;
      else if (this.x > CANVAS_WIDTH) this.x = 2;
    }

    chooseNextDirection() {
      const tileX = Math.floor(this.x / TILE_SIZE);
      const tileY = Math.floor(this.y / TILE_SIZE);

      const possibleDirections = [
        { dx: 0, dy: -1 }, // Cima
        { dx: 0, dy: 1 },  // Baixo
        { dx: -1, dy: 0 }, // Esquerda
        { dx: 1, dy: 0 }   // Direita
      ];

      // Filtra direções livres (não parede e sem inversão imediata de 180° a menos que travado)
      const valid = possibleDirections.filter(dir => {
        if (dir.dx === -this.dirX && dir.dy === -this.dirY) return false; // Evita vaivém imediato
        const nextX = (tileX + dir.dx) * TILE_SIZE + TILE_SIZE / 2;
        const nextY = (tileY + dir.dy) * TILE_SIZE + TILE_SIZE / 2;
        return canGhostMoveTo(nextX, nextY, this.isEaten);
      });

      if (valid.length === 0) {
        // Se sem opção, permite inverter
        this.dirX = -this.dirX;
        this.dirY = -this.dirY;
        return;
      }

      let chosenDir;

      if (this.isEaten) {
        // Alvo: casa dos fantasmas
        chosenDir = this.findBestDirection(valid, this.homeTileX, this.homeTileY);
      } else if (this.isFrightened) {
        // Movimento aleatório desorientado
        chosenDir = valid[Math.floor(Math.random() * valid.length)];
      } else {
        // Perseguição inteligente com comportamento por inimigo
        let targetX = Math.floor(player.x / TILE_SIZE);
        let targetY = Math.floor(player.y / TILE_SIZE);

        if (this.id === 2) { // Cyan intercepta à frente
          targetX += player.dirX * 3;
          targetY += player.dirY * 3;
        } else if (this.id === 3) { // Pink embosca
          targetX += player.dirX * 4;
          targetY += player.dirY * 4;
        } else if (this.id === 4) { // Orange alterna entre rondar e fugir
          const distToPlayer = Math.hypot(tileX - targetX, tileY - targetY);
          if (distToPlayer < 4) {
            targetX = 1;
            targetY = 19;
          }
        }

        // Escolhe o passo mais próximo do alvo com leve probabilidade aleatória para permitir desvio
        if (Math.random() < 0.85) {
          chosenDir = this.findBestDirection(valid, targetX, targetY);
        } else {
          chosenDir = valid[Math.floor(Math.random() * valid.length)];
        }
      }

      this.dirX = chosenDir.dx;
      this.dirY = chosenDir.dy;
    }

    findBestDirection(validDirections, targetTileX, targetTileY) {
      let bestDir = validDirections[0];
      let minDistance = Infinity;

      for (const dir of validDirections) {
        const nextTileX = Math.floor(this.x / TILE_SIZE) + dir.dx;
        const nextTileY = Math.floor(this.y / TILE_SIZE) + dir.dy;
        const dist = Math.hypot(nextTileX - targetTileX, nextTileY - targetTileY);
        if (dist < minDistance) {
          minDistance = dist;
          bestDir = dir;
        }
      }

      return bestDir;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);

      let bodyColor = this.color;
      if (this.isFrightened) {
        const timeLeft = frightenedUntil - Date.now();
        if (timeLeft < 2000 && Math.floor(Date.now() / 200) % 2 === 0) {
          bodyColor = '#ffffff'; // Pisca antes de acabar
        } else {
          bodyColor = '#2563eb'; // Azul assustado
        }
      }

      if (!this.isEaten) {
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        // Cúpula superior
        ctx.arc(0, -2, this.radius, Math.PI, 0, false);
        // Base ondulada estilo tentáculo robótico
        ctx.lineTo(this.radius, this.radius - 2);
        const segments = 3;
        const segWidth = (this.radius * 2) / segments;
        for (let i = segments; i > 0; i--) {
          const xEnd = this.radius - (segments - i + 1) * segWidth;
          const xMid = this.radius - (segments - i + 0.5) * segWidth;
          ctx.quadraticCurveTo(xMid, this.radius + 3, xEnd, this.radius - 2);
        }
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Olhos do Inimigo
      const eyeOffsetX = this.dirX * 2.5;
      const eyeOffsetY = this.dirY * 2.5;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-4 + eyeOffsetX, -4 + eyeOffsetY, 3.5, 0, Math.PI * 2);
      ctx.arc(4 + eyeOffsetX, -4 + eyeOffsetY, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Pupilas
      ctx.fillStyle = this.isFrightened && !this.isEaten ? '#ef4444' : '#0f172a';
      ctx.beginPath();
      ctx.arc(-4 + eyeOffsetX * 1.5, -4 + eyeOffsetY * 1.5, 1.8, 0, Math.PI * 2);
      ctx.arc(4 + eyeOffsetX * 1.5, -4 + eyeOffsetY * 1.5, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // Partículas Visuais
  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.vx = (Math.random() - 0.5) * 4;
      this.vy = (Math.random() - 0.5) * 4;
      this.alpha = 1;
      this.life = 0.9;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.035;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function createSparkle(x, y, color, count = 5) {
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y, color));
    }
  }

  // Verificação de Colisão com Paredes
  function canMoveTo(targetX, targetY, radius) {
    const minTileX = Math.floor((targetX - radius + 2) / TILE_SIZE);
    const maxTileX = Math.floor((targetX + radius - 2) / TILE_SIZE);
    const minTileY = Math.floor((targetY - radius + 2) / TILE_SIZE);
    const maxTileY = Math.floor((targetY + radius - 2) / TILE_SIZE);

    for (let y = minTileY; y <= maxTileY; y++) {
      for (let x = minTileX; x <= maxTileX; x++) {
        if (y < 0 || y >= ROWS) continue;
        if (x < 0 || x >= COLS) continue; // Permite túnel
        const cell = mapData[y][x];
        if (cell === 1 || cell === 4 || cell === 9) {
          return false; // Bloqueado
        }
      }
    }
    return true;
  }

  function canGhostMoveTo(targetX, targetY, isEaten) {
    const tileX = Math.floor(targetX / TILE_SIZE);
    const tileY = Math.floor(targetY / TILE_SIZE);

    if (tileY < 0 || tileY >= ROWS) return false;
    if (tileX < 0 || tileX >= COLS) return true; // Túnel

    const cell = mapData[tileY][tileX];
    if (cell === 1) return false;
    if (cell === 4) return isEaten; // Porta só para fantasmas comidos
    return true;
  }

  // Ativação do Modo Vulnerável
  function activateFrightenedMode() {
    const duration = DIFFICULTY_SETTINGS[selectedDifficulty].frightenedTime;
    frightenedUntil = Date.now() + duration;

    ghosts.forEach(g => {
      if (!g.isEaten) g.isFrightened = true;
    });

    if (frightenedTimer) clearTimeout(frightenedTimer);
    frightenedTimer = setTimeout(() => {
      ghosts.forEach(g => {
        g.isFrightened = false;
      });
    }, duration);
  }

  // Inicialização do Labirinto
  function initMaze() {
    mapData = [];
    totalItemsCount = 0;
    collectedItemsCount = 0;

    for (let r = 0; r < ROWS; r++) {
      const row = [];
      for (let c = 0; c < COLS; c++) {
        const val = INITIAL_MAP[r][c];
        row.push(val);
        if (val === 0 || val === 2) {
          totalItemsCount++;
        }
      }
      mapData.push(row);
    }
  }

  // Reiniciar Posições dos Personagens
  function resetPositions() {
    player.resetPosition();
    ghosts.forEach(g => g.resetPosition());
  }

  // Inicialização do Jogo
  function initGame() {
    canvas = document.getElementById('pacman-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Carrega recorde
    try {
      highScore = parseInt(localStorage.getItem('senai_pacman_highscore'), 10) || 0;
    } catch (e) {
      highScore = 0;
    }

    // Instancia entidades
    player = new Player();
    ghosts = [
      new Ghost(1, 'Blinky-Tech', '#ef4444', 9, 8),
      new Ghost(2, 'Inky-Tech', '#00d2ff', 8, 10),
      new Ghost(3, 'Pinky-Tech', '#ec4899', 9, 10),
      new Ghost(4, 'Clyde-Tech', '#f97316', 10, 10)
    ];

    initMaze();
    setupEventListeners();
    updateHUD();
    render();
  }

  // Configuração dos Eventos de Interface e Teclado
  function setupEventListeners() {
    // Controles por teclado (Setas, WASD, Espaço, Enter)
    window.addEventListener('keydown', (e) => {
      // Bloqueia rolagem indesejada da página com setas e espaço
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      sfx.init();

      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        player.setNextDirection(0, -1);
      } else if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        player.setNextDirection(0, 1);
      } else if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        player.setNextDirection(-1, 0);
      } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        player.setNextDirection(1, 0);
      } else if (e.code === 'Space') {
        togglePause();
      } else if (e.code === 'Enter') {
        if (gameState === 'START' || gameState === 'GAMEOVER' || gameState === 'WIN') {
          startNewGame();
        }
      }
    });

    // Botões de Interface
    const btnStart = document.getElementById('btn-start-game');
    if (btnStart) btnStart.addEventListener('click', () => { sfx.init(); startNewGame(); });

    const btnPause = document.getElementById('btn-pause-game');
    if (btnPause) btnPause.addEventListener('click', togglePause);

    const btnResume = document.getElementById('btn-resume-game');
    if (btnResume) btnResume.addEventListener('click', togglePause);

    const btnRestart = document.getElementById('btn-restart-game');
    if (btnRestart) btnRestart.addEventListener('click', () => { sfx.init(); startNewGame(); });

    const btnPlayAgainOver = document.getElementById('btn-play-again-over');
    if (btnPlayAgainOver) btnPlayAgainOver.addEventListener('click', () => { sfx.init(); startNewGame(); });

    const btnPlayAgainWin = document.getElementById('btn-play-again-win');
    if (btnPlayAgainWin) btnPlayAgainWin.addEventListener('click', () => { sfx.init(); startNewGame(); });

    // Alternador de Som
    const btnAudio = document.getElementById('btn-audio-toggle');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        sfx.init();
        sfx.enabled = !sfx.enabled;
        btnAudio.textContent = sfx.enabled ? '🔊' : '🔇';
        btnAudio.title = sfx.enabled ? 'Desativar Sons' : 'Ativar Sons';
      });
    }

    // Seletor de Dificuldade
    const diffButtons = document.querySelectorAll('.diff-btn');
    diffButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        diffButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedDifficulty = parseInt(btn.dataset.level, 10);
        currentMultiplier = DIFFICULTY_SETTINGS[selectedDifficulty].multiplier;
        updateHUD();
      });
    });
  }

  function startNewGame() {
    baseScore = 0;
    lives = 3;
    currentMultiplier = DIFFICULTY_SETTINGS[selectedDifficulty].multiplier;
    initMaze();
    resetPositions();

    hideOverlays();
    gameState = 'PLAYING';
    updateHUD();

    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    lastTime = performance.now();
    animationFrameId = requestAnimationFrame(gameLoop);
  }

  function togglePause() {
    if (gameState === 'PLAYING') {
      gameState = 'PAUSED';
      showOverlay('overlay-pause');
    } else if (gameState === 'PAUSED') {
      gameState = 'PLAYING';
      hideOverlays();
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(gameLoop);
    }
  }

  function hideOverlays() {
    document.querySelectorAll('.game-overlay-screen').forEach(el => el.classList.remove('active'));
  }

  function showOverlay(id) {
    hideOverlays();
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  }

  function checkGameCompletion() {
    updateHUD();
    if (collectedItemsCount >= totalItemsCount) {
      // Conclusão com bônus de 500 pontos base
      baseScore += 500;
      sfx.victory();
      gameState = 'WIN';
      saveHighScore();

      const finalScore = Math.round(baseScore * currentMultiplier);
      const elFinalWinScore = document.getElementById('win-final-score');
      if (elFinalWinScore) elFinalWinScore.textContent = finalScore.toLocaleString('pt-BR');
      showOverlay('overlay-win');
    }
  }

  function handlePlayerDeath() {
    lives--;
    sfx.death();
    updateHUD();

    if (lives <= 0) {
      gameState = 'GAMEOVER';
      saveHighScore();

      const finalScore = Math.round(baseScore * currentMultiplier);
      const elFinalOverScore = document.getElementById('gameover-final-score');
      if (elFinalOverScore) elFinalOverScore.textContent = finalScore.toLocaleString('pt-BR');
      showOverlay('overlay-gameover');
    } else {
      resetPositions();
    }
  }

  function saveHighScore() {
    const finalScore = Math.round(baseScore * currentMultiplier);
    if (finalScore > highScore) {
      highScore = finalScore;
      try {
        localStorage.setItem('senai_pacman_highscore', highScore);
      } catch (e) {}
    }
    updateHUD();
  }

  function updateHUD() {
    const finalScore = Math.round(baseScore * currentMultiplier);
    const elScore = document.getElementById('hud-score');
    if (elScore) elScore.textContent = finalScore.toLocaleString('pt-BR');

    const elRecord = document.getElementById('hud-record');
    if (elRecord) elRecord.textContent = highScore.toLocaleString('pt-BR');

    const elDiff = document.getElementById('hud-difficulty');
    if (elDiff) elDiff.textContent = `${DIFFICULTY_SETTINGS[selectedDifficulty].name} (${currentMultiplier}x)`;

    const elItems = document.getElementById('hud-items');
    if (elItems) elItems.textContent = `${collectedItemsCount}/${totalItemsCount}`;

    const elLives = document.getElementById('hud-lives');
    if (elLives) {
      elLives.innerHTML = '';
      for (let i = 0; i < lives; i++) {
        const icon = document.createElement('span');
        icon.className = 'life-icon';
        elLives.appendChild(icon);
      }
    }
  }

  // Loop Principal do Jogo
  function gameLoop(time) {
    if (gameState !== 'PLAYING') return;

    update();
    render();

    animationFrameId = requestAnimationFrame(gameLoop);
  }

  function update() {
    const settings = DIFFICULTY_SETTINGS[selectedDifficulty];
    player.update(settings.playerSpeed);

    // Atualiza fantasmas e testa colisões
    ghosts.forEach(ghost => {
      ghost.update(settings.ghostSpeed);

      // Distância de colisão com o jogador
      const dist = Math.hypot(player.x - ghost.x, player.y - ghost.y);
      if (dist < player.radius + ghost.radius - 2) {
        if (ghost.isFrightened && !ghost.isEaten) {
          // Fantasma devorado pelo jogador (+100 pontos)
          ghost.isEaten = true;
          baseScore += 100;
          sfx.ghostEat();
          createSparkle(ghost.x, ghost.y, '#38bdf8', 15);
          updateHUD();
        } else if (!ghost.isFrightened && !ghost.isEaten) {
          // Jogador atingido
          handlePlayerDeath();
        }
      }
    });

    // Atualiza partículas
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      if (particles[i].alpha <= 0) particles.splice(i, 1);
    }
  }

  // Renderização Gráfica do Canvas
  function render() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Fundo escuro tecnológico
    ctx.fillStyle = '#060d1a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Desenha Paredes e Itens
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = mapData[r][c];
        const px = c * TILE_SIZE;
        const py = r * TILE_SIZE;

        if (cell === 1) {
          // Paredes Neon Azul SENAI
          ctx.fillStyle = '#0a1d3b';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = '#005caa';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(px + 0.5, py + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
        } else if (cell === 4) {
          // Porta da Casa dos Fantasmas
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(px, py + TILE_SIZE / 2 - 2, TILE_SIZE, 4);
        } else if (cell === 0) {
          // Ponto comum (10 pts)
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (cell === 2) {
          // Chip Especial / Item de Energia (50 pts)
          const pulse = Math.sin(Date.now() / 150) * 1.5;
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#00d2ff';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 6 + pulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }

    // Desenha Partículas
    particles.forEach(p => p.draw(ctx));

    // Desenha Jogador e Inimigos
    player.draw(ctx);
    ghosts.forEach(g => g.draw(ctx));
  }

  // Inicializa quando a página carrega
  window.addEventListener('DOMContentLoaded', initGame);

})();
