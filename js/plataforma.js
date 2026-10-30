/**
 * WEBSITE 02 — AVENTURA DE PLATAFORMA (js/plataforma.js)
 * Motor 2D de física, pulos, inimigos, moedas e 3 fases distintas.
 * 100% Vanilla JavaScript e Canvas HTML5.
 */

(function () {
  'use strict';

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 450;
  const GRAVITY = 0.65;

  // Sintetizador de Áudio Nativo
  class PlatformAudio {
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

    jump() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(420, this.ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
      } catch (e) {}
    }

    coin() {
      if (!this.enabled || !this.ctx) return;
      this.playTone(987, 0.08, 'sine', 0.07);
      setTimeout(() => this.playTone(1318, 0.15, 'sine', 0.07), 70);
    }

    stomp() {
      this.playTone(180, 0.12, 'sawtooth', 0.1);
    }

    hurt() {
      if (!this.enabled || !this.ctx) return;
      [220, 180, 140].forEach((f, i) => {
        setTimeout(() => this.playTone(f, 0.09, 'sawtooth', 0.09), i * 60);
      });
    }

    stageWin() {
      if (!this.enabled || !this.ctx) return;
      [523, 659, 784, 1046, 1318].forEach((f, i) => {
        setTimeout(() => this.playTone(f, 0.2, 'triangle', 0.09), i * 110);
      });
    }
  }

  const sfx = new PlatformAudio();

  // Definição das 3 Fases
  const STAGES_CONFIG = {
    1: {
      name: 'Mundo da Aprendizagem',
      subtitle: 'Aprenda os comandos e domine os saltos iniciais',
      width: 2400,
      bgColor: '#60a5fa',
      theme: 'learn',
      platforms: [
        { x: 0, y: 390, w: 700, h: 60 },
        { x: 250, y: 310, w: 120, h: 20 },
        { x: 440, y: 240, w: 130, h: 20 },
        { x: 780, y: 390, w: 600, h: 60 },
        { x: 920, y: 310, w: 140, h: 20 },
        { x: 1150, y: 230, w: 150, h: 20 },
        { x: 1460, y: 390, w: 940, h: 60 },
        { x: 1600, y: 300, w: 120, h: 20 },
        { x: 1800, y: 220, w: 140, h: 20 },
        { x: 2020, y: 310, w: 130, h: 20 }
      ],
      movingPlatforms: [],
      hazards: [
        { x: 700, y: 440, w: 80, h: 20 }, // Fosso
        { x: 1380, y: 440, w: 80, h: 20 }
      ],
      coins: [
        { x: 270, y: 270 }, { x: 310, y: 270 }, { x: 350, y: 270 },
        { x: 460, y: 200 }, { x: 500, y: 200 }, { x: 540, y: 200 },
        { x: 840, y: 350 }, { x: 880, y: 350 },
        { x: 950, y: 270 }, { x: 1000, y: 270 },
        { x: 1180, y: 190 }, { x: 1240, y: 190 },
        { x: 1620, y: 260 }, { x: 1680, y: 260 },
        { x: 1830, y: 180 }, { x: 1890, y: 180 },
        { x: 2040, y: 270 }, { x: 2100, y: 270 }
      ],
      enemies: [
        { x: 520, y: 360, minX: 420, maxX: 640, speed: 1.2 },
        { x: 1050, y: 360, minX: 950, maxX: 1280, speed: 1.4 },
        { x: 1750, y: 360, minX: 1620, maxX: 1900, speed: 1.3 }
      ],
      finishX: 2280
    },
    2: {
      name: 'Desafio da Tecnologia',
      subtitle: 'Plataformas móveis e saltos com precisão',
      width: 2900,
      bgColor: '#1e1b4b',
      theme: 'tech',
      platforms: [
        { x: 0, y: 390, w: 550, h: 60 },
        { x: 220, y: 300, w: 100, h: 20 },
        { x: 390, y: 210, w: 120, h: 20 },
        { x: 620, y: 390, w: 350, h: 60 },
        { x: 1150, y: 390, w: 400, h: 60 },
        { x: 1300, y: 280, w: 130, h: 20 },
        { x: 1750, y: 390, w: 400, h: 60 },
        { x: 1900, y: 260, w: 130, h: 20 },
        { x: 2320, y: 390, w: 580, h: 60 },
        { x: 2480, y: 290, w: 120, h: 20 }
      ],
      movingPlatforms: [
        { x: 980, y: 320, w: 110, h: 18, minX: 980, maxX: 1130, speed: 1.8, dir: 1 },
        { x: 1560, y: 300, w: 110, h: 18, minX: 1560, maxX: 1730, speed: 2.0, dir: 1 },
        { x: 2160, y: 310, w: 110, h: 18, minX: 2160, maxX: 2300, speed: 2.2, dir: 1 }
      ],
      hazards: [
        { x: 550, y: 440, w: 70, h: 20 },
        { x: 970, y: 440, w: 180, h: 20 },
        { x: 1550, y: 440, w: 200, h: 20 },
        { x: 2150, y: 440, w: 170, h: 20 }
      ],
      coins: [
        { x: 250, y: 260 }, { x: 420, y: 170 }, { x: 460, y: 170 },
        { x: 700, y: 350 }, { x: 750, y: 350 }, { x: 800, y: 350 },
        { x: 1030, y: 270 },
        { x: 1220, y: 350 }, { x: 1330, y: 240 }, { x: 1380, y: 240 },
        { x: 1610, y: 250 },
        { x: 1820, y: 350 }, { x: 1930, y: 220 }, { x: 1980, y: 220 },
        { x: 2210, y: 260 },
        { x: 2380, y: 350 }, { x: 2510, y: 250 }, { x: 2560, y: 250 }
      ],
      enemies: [
        { x: 300, y: 360, minX: 100, maxX: 480, speed: 1.8 },
        { x: 780, y: 360, minX: 660, maxX: 920, speed: 2.0 },
        { x: 1250, y: 360, minX: 1170, maxX: 1480, speed: 2.1 },
        { x: 1850, y: 360, minX: 1760, maxX: 2080, speed: 2.2 },
        { x: 2450, y: 360, minX: 2350, maxX: 2680, speed: 2.3 }
      ],
      finishX: 2780
    },
    3: {
      name: 'Missão SENAI',
      subtitle: 'O grande teste industrial com desafios combinados',
      width: 3300,
      bgColor: '#07101f',
      theme: 'senai',
      platforms: [
        { x: 0, y: 390, w: 500, h: 60 },
        { x: 200, y: 280, w: 110, h: 20 },
        { x: 380, y: 180, w: 120, h: 20 },
        { x: 580, y: 390, w: 320, h: 60 },
        { x: 1060, y: 390, w: 420, h: 60 },
        { x: 1200, y: 270, w: 140, h: 20 },
        { x: 1680, y: 390, w: 350, h: 60 },
        { x: 2180, y: 390, w: 400, h: 60 },
        { x: 2320, y: 280, w: 130, h: 20 },
        { x: 2500, y: 190, w: 140, h: 20 },
        { x: 2760, y: 390, w: 540, h: 60 }
      ],
      movingPlatforms: [
        { x: 910, y: 300, w: 110, h: 18, minX: 910, maxX: 1045, speed: 2.4, dir: 1 },
        { x: 1490, y: 290, w: 110, h: 18, minX: 1490, maxX: 1665, speed: 2.6, dir: 1 },
        { x: 2040, y: 310, w: 110, h: 18, minX: 2040, maxX: 2165, speed: 2.8, dir: 1 }
      ],
      hazards: [
        { x: 500, y: 440, w: 80, h: 20 },
        { x: 900, y: 440, w: 160, h: 20 },
        { x: 1480, y: 440, w: 200, h: 20 },
        { x: 2030, y: 440, w: 150, h: 20 },
        { x: 2580, y: 440, w: 180, h: 20 }
      ],
      coins: [
        { x: 230, y: 240 }, { x: 410, y: 140 }, { x: 450, y: 140 },
        { x: 650, y: 350 }, { x: 720, y: 350 },
        { x: 960, y: 250 },
        { x: 1120, y: 350 }, { x: 1240, y: 230 }, { x: 1290, y: 230 },
        { x: 1540, y: 240 },
        { x: 1740, y: 350 }, { x: 1820, y: 350 },
        { x: 2090, y: 260 },
        { x: 2240, y: 350 }, { x: 2350, y: 240 }, { x: 2530, y: 150 }, { x: 2580, y: 150 },
        { x: 2840, y: 350 }, { x: 2920, y: 350 }, { x: 3000, y: 350 }
      ],
      enemies: [
        { x: 260, y: 360, minX: 80, maxX: 460, speed: 2.0 },
        { x: 680, y: 360, minX: 600, maxX: 860, speed: 2.2 },
        { x: 1180, y: 360, minX: 1080, maxX: 1420, speed: 2.4 },
        { x: 1760, y: 360, minX: 1700, maxX: 1980, speed: 2.5 },
        { x: 2280, y: 360, minX: 2200, maxX: 2520, speed: 2.6 },
        { x: 2880, y: 360, minX: 2790, maxX: 3120, speed: 2.8 }
      ],
      finishX: 3200
    }
  };

  // Variáveis do Estado do Jogo
  let canvas, ctx;
  let currentStageIndex = 1;
  let totalCumulativeScore = 0;
  let stageScore = 0;
  let stageCoinsCollected = 0;
  let stageStartTime = 0;
  let lives = 3;
  let highScore = 0;
  let maxStageReached = 1;

  let gameState = 'START'; // 'START', 'PLAYING', 'PAUSED', 'STAGE_CLEAR', 'GAMEOVER', 'ALL_CLEAR'
  let animationId = null;

  let cameraX = 0;
  let currentStageData = null;

  // Entidades
  let player;
  let currentCoins = [];
  let currentEnemies = [];
  let currentMovingPlatforms = [];
  let particles = [];

  // Entrada do Usuário
  const keys = {
    left: false,
    right: false,
    up: false
  };

  // Classe do Personagem Principal (TechHero SENAI)
  class HeroPlayer {
    constructor() {
      this.w = 26;
      this.h = 38;
      this.reset(50, 320);
    }

    reset(x, y) {
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      this.isGrounded = false;
      this.facing = 1; // 1: direita, -1: esquerda
      this.animFrame = 0;
      this.invulnerableTimer = 0;
    }

    update() {
      // Movimento horizontal
      const maxSpeed = 4.8;
      const accel = 0.8;
      const friction = 0.82;

      if (keys.left) {
        this.vx -= accel;
        this.facing = -1;
      } else if (keys.right) {
        this.vx += accel;
        this.facing = 1;
      } else {
        this.vx *= friction;
      }

      this.vx = Math.max(-maxSpeed, Math.min(maxSpeed, this.vx));
      if (Math.abs(this.vx) < 0.05) this.vx = 0;

      // Pulo
      if (keys.up && this.isGrounded) {
        this.vy = -12.8;
        this.isGrounded = false;
        sfx.jump();
        createDust(this.x + this.w / 2, this.y + this.h, '#ffffff', 6);
      }

      // Gravidade
      this.vy += GRAVITY;

      // Atualiza Posição X e testa colisão com plataformas
      this.x += this.vx;
      this.checkHorizontalCollisions();

      // Limite lateral da fase
      if (this.x < 0) this.x = 0;
      if (this.x + this.w > currentStageData.width) this.x = currentStageData.width - this.w;

      // Atualiza Posição Y e testa colisão com plataformas
      this.y += this.vy;
      this.isGrounded = false;
      this.checkVerticalCollisions();

      // Queda em fosso
      if (this.y > CANVAS_HEIGHT + 50) {
        handleHeroFall();
      }

      // Animação de caminhada
      if (Math.abs(this.vx) > 0.5 && this.isGrounded) {
        this.animFrame += 0.2;
      }

      if (this.invulnerableTimer > 0) {
        this.invulnerableTimer--;
      }
    }

    checkHorizontalCollisions() {
      const allPlats = [...currentStageData.platforms, ...currentMovingPlatforms];
      for (const p of allPlats) {
        if (checkOverlap(this.x, this.y, this.w, this.h, p.x, p.y, p.w, p.h)) {
          if (this.vx > 0) {
            this.x = p.x - this.w;
            this.vx = 0;
          } else if (this.vx < 0) {
            this.x = p.x + p.w;
            this.vx = 0;
          }
        }
      }
    }

    checkVerticalCollisions() {
      const allPlats = [...currentStageData.platforms, ...currentMovingPlatforms];
      for (const p of allPlats) {
        if (checkOverlap(this.x, this.y, this.w, this.h, p.x, p.y, p.w, p.h)) {
          if (this.vy > 0) {
            // Aterrissagem
            this.y = p.y - this.h;
            this.vy = 0;
            this.isGrounded = true;

            // Se for plataforma móvel, acompanha o deslocamento
            if (p.speed && p.dir) {
              this.x += p.speed * p.dir;
            }
          } else if (this.vy < 0) {
            // Cabeçada por baixo
            this.y = p.y + p.h;
            this.vy = 0;
          }
        }
      }
    }

    draw(ctx) {
      if (this.invulnerableTimer > 0 && Math.floor(this.invulnerableTimer / 4) % 2 === 0) {
        return; // Efeito de piscar ao ser ferido
      }

      ctx.save();
      ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
      if (this.facing === -1) ctx.scale(-1, 1);

      // Sombra
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.beginPath();
      ctx.ellipse(0, this.h / 2 - 2, this.w / 2, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Capacete / Boné SENAI Tecnológico (Azul SENAI)
      ctx.fillStyle = '#005caa';
      ctx.beginPath();
      ctx.arc(0, -this.h / 2 + 10, 10, Math.PI, 0, false);
      ctx.fill();

      // Aba do boné
      ctx.fillStyle = '#e30613';
      ctx.fillRect(0, -this.h / 2 + 7, 12, 4);

      // Rosto do TechHero
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(0, -this.h / 2 + 13, 8, 0, Math.PI * 2);
      ctx.fill();

      // Olho e visor
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(3, -this.h / 2 + 10, 3, 4);

      // Macacão de Trabalho / Traje Tecnológico
      ctx.fillStyle = '#005caa';
      ctx.fillRect(-8, -this.h / 2 + 20, 16, 12);

      // Cinto de ferramentas
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-8, -this.h / 2 + 28, 16, 3);

      // Pernas com animação de passada
      const legOffset = this.isGrounded ? Math.sin(this.animFrame) * 4 : 4;
      ctx.fillStyle = '#0f172a';
      // Perna esquerda
      ctx.fillRect(-7, -this.h / 2 + 31, 6, 7 - legOffset);
      // Perna direita
      ctx.fillRect(1, -this.h / 2 + 31, 6, 7 + legOffset);

      ctx.restore();
    }
  }

  // Classe dos Inimigos (PatrolBots)
  class StageEnemy {
    constructor(cfg) {
      this.x = cfg.x;
      this.y = cfg.y;
      this.w = 26;
      this.h = 26;
      this.minX = cfg.minX;
      this.maxX = cfg.maxX;
      this.speed = cfg.speed;
      this.dir = 1;
      this.alive = true;
      this.squashTimer = 0;
    }

    update() {
      if (!this.alive) {
        if (this.squashTimer > 0) this.squashTimer--;
        return;
      }

      this.x += this.speed * this.dir;
      if (this.x >= this.maxX) {
        this.x = this.maxX;
        this.dir = -1;
      } else if (this.x <= this.minX) {
        this.x = this.minX;
        this.dir = 1;
      }
    }

    draw(ctx) {
      if (!this.alive && this.squashTimer <= 0) return;

      ctx.save();
      ctx.translate(this.x + this.w / 2, this.y + this.h / 2);

      if (!this.alive) {
        // Esmagado
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(-this.w / 2, 4, this.w, 6);
        ctx.restore();
        return;
      }

      // Corpo Robô Inimigo
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);

      // Visor Inimigo
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-this.w / 2 + 4, -this.h / 2 + 4, this.w - 8, 8);

      // Luz Vermelha do Visor
      ctx.fillStyle = '#f87171';
      ctx.fillRect(this.dir === 1 ? 2 : -8, -this.h / 2 + 6, 6, 4);

      // Esteiras
      ctx.fillStyle = '#334155';
      ctx.fillRect(-this.w / 2 - 2, this.h / 2 - 6, this.w + 4, 6);

      ctx.restore();
    }
  }

  // Moeda Colecionável Animada
  class CollectibleCoin {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.w = 20;
      this.h = 20;
      this.collected = false;
      this.angle = Math.random() * Math.PI * 2;
    }

    update() {
      this.angle += 0.08;
    }

    draw(ctx) {
      if (this.collected) return;

      ctx.save();
      ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
      const scaleX = Math.cos(this.angle);
      ctx.scale(scaleX, 1);

      // Moeda de Ouro
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Símbolo do Chip / Moeda
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-2, -5, 4, 10);
      ctx.fillRect(-5, -2, 10, 4);

      ctx.restore();
    }
  }

  // Partículas Visuais
  class DustParticle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.vx = (Math.random() - 0.5) * 3;
      this.vy = (Math.random() - 0.5) * 3;
      this.size = Math.random() * 3 + 2;
      this.alpha = 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.04;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function createDust(x, y, color, count = 5) {
    for (let i = 0; i < count; i++) {
      particles.push(new DustParticle(x, y, color));
    }
  }

  function checkOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
  }

  // Inicialização e Carregamento de Fase
  function loadStage(stageIndex) {
    currentStageIndex = stageIndex;
    currentStageData = STAGES_CONFIG[stageIndex];

    stageScore = 0;
    stageCoinsCollected = 0;
    stageStartTime = Date.now();

    player.reset(60, 320);
    cameraX = 0;

    // Instancia moedas
    currentCoins = currentStageData.coins.map(c => new CollectibleCoin(c.x, c.y));

    // Instancia inimigos
    currentEnemies = currentStageData.enemies.map(e => new StageEnemy(e));

    // Instancia plataformas móveis
    currentMovingPlatforms = currentStageData.movingPlatforms.map(p => ({
      x: p.x,
      y: p.y,
      w: p.w,
      h: p.h,
      minX: p.minX,
      maxX: p.maxX,
      speed: p.speed,
      dir: p.dir
    }));

    updateStageInfoUI();
    updateHUD();
  }

  function handleHeroFall() {
    lives--;
    sfx.hurt();
    updateHUD();

    if (lives <= 0) {
      triggerGameOver();
    } else {
      player.reset(60, 320);
    }
  }

  function handleEnemyCollision(enemy) {
    if (!enemy.alive) return;

    // O jogador pisou no topo do inimigo? (pulo clássico)
    const hitFromAbove = (player.vy > 0 && (player.y + player.h - player.vy) <= (enemy.y + 12));

    if (hitFromAbove) {
      enemy.alive = false;
      enemy.squashTimer = 15;
      player.vy = -9; // Pulo de ricochete
      stageScore += 100;
      sfx.stomp();
      createDust(enemy.x + enemy.w / 2, enemy.y, '#ef4444', 10);
      updateHUD();
    } else if (player.invulnerableTimer <= 0) {
      // Dano ao jogador
      lives--;
      player.invulnerableTimer = 60; // 1 segundo invulnerável
      player.vy = -6;
      player.vx = -player.facing * 4;
      sfx.hurt();
      updateHUD();

      if (lives <= 0) {
        triggerGameOver();
      }
    }
  }

  function checkGoalReach() {
    if (player.x + player.w >= currentStageData.finishX) {
      completeCurrentStage();
    }
  }

  function completeCurrentStage() {
    gameState = 'STAGE_CLEAR';
    sfx.stageWin();

    const elapsedSeconds = Math.max(1, Math.floor((Date.now() - stageStartTime) / 1000));
    const timeBonus = Math.max(0, Math.floor((90 - elapsedSeconds) * 5));
    const completionBonus = 500;

    const totalStagePoints = stageScore + completionBonus + timeBonus;
    totalCumulativeScore += totalStagePoints;

    if (currentStageIndex > maxStageReached) {
      maxStageReached = currentStageIndex;
    }

    savePlatformRecord();

    // Atualiza modal de conclusão de fase
    const elSummaryStage = document.getElementById('clear-stage-num');
    if (elSummaryStage) elSummaryStage.textContent = currentStageIndex;

    const elCoinsEarned = document.getElementById('clear-coins');
    if (elCoinsEarned) elCoinsEarned.textContent = stageCoinsCollected;

    const elTimeBonus = document.getElementById('clear-time-bonus');
    if (elTimeBonus) elTimeBonus.textContent = timeBonus;

    const elTotalStageScore = document.getElementById('clear-total-score');
    if (elTotalStageScore) elTotalStageScore.textContent = totalStagePoints.toLocaleString('pt-BR');

    if (currentStageIndex >= 3) {
      // Concluiu as 3 fases com sucesso!
      document.getElementById('btn-next-stage').style.display = 'none';
      document.getElementById('all-clear-message').style.display = 'block';
    } else {
      document.getElementById('btn-next-stage').style.display = 'inline-flex';
      document.getElementById('all-clear-message').style.display = 'none';
    }

    showOverlay('overlay-stage-clear');
  }

  function triggerGameOver() {
    gameState = 'GAMEOVER';
    savePlatformRecord();

    const elOverScore = document.getElementById('gameover-platform-score');
    if (elOverScore) elOverScore.textContent = totalCumulativeScore.toLocaleString('pt-BR');

    showOverlay('overlay-gameover-platform');
  }

  function savePlatformRecord() {
    if (totalCumulativeScore > highScore) {
      highScore = totalCumulativeScore;
    }
    try {
      localStorage.setItem('senai_platform_highscore', highScore);
      localStorage.setItem('senai_platform_maxstage', maxStageReached);
    } catch (e) {}
    updateHUD();
  }

  function updateHUD() {
    const elScore = document.getElementById('hud-platform-score');
    if (elScore) elScore.textContent = (totalCumulativeScore + stageScore).toLocaleString('pt-BR');

    const elRecord = document.getElementById('hud-platform-record');
    if (elRecord) elRecord.textContent = highScore.toLocaleString('pt-BR');

    const elStage = document.getElementById('hud-platform-stage');
    if (elStage) elStage.textContent = `Fase ${currentStageIndex}`;

    const elCoins = document.getElementById('hud-platform-coins');
    if (elCoins) elCoins.textContent = `${stageCoinsCollected}`;

    const elLives = document.getElementById('hud-platform-lives');
    if (elLives) {
      elLives.innerHTML = '';
      for (let i = 0; i < lives; i++) {
        const h = document.createElement('span');
        h.textContent = '❤️';
        h.style.marginRight = '2px';
        elLives.appendChild(h);
      }
    }

    // Barra de progresso da fase
    if (currentStageData) {
      const progressPercent = Math.min(100, Math.max(0, (player.x / currentStageData.finishX) * 100));
      const elBar = document.getElementById('stage-progress-fill');
      if (elBar) elBar.style.width = `${progressPercent}%`;
    }
  }

  function updateStageInfoUI() {
    document.querySelectorAll('.stage-card-info').forEach((c, idx) => {
      c.classList.toggle('current', idx + 1 === currentStageIndex);
    });
  }

  function showOverlay(id) {
    document.querySelectorAll('.platform-overlay-screen').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
  }

  function hideOverlays() {
    document.querySelectorAll('.platform-overlay-screen').forEach(el => el.classList.remove('active'));
  }

  // Loop de Jogo
  function gameLoop() {
    if (gameState === 'PLAYING') {
      update();
      render();
    }
    animationId = requestAnimationFrame(gameLoop);
  }

  function update() {
    player.update();

    // Atualiza plataformas móveis
    for (const p of currentMovingPlatforms) {
      p.x += p.speed * p.dir;
      if (p.x >= p.maxX) {
        p.x = p.maxX;
        p.dir = -1;
      } else if (p.x <= p.minX) {
        p.x = p.minX;
        p.dir = 1;
      }
    }

    // Atualiza moedas e testa coleta
    for (const coin of currentCoins) {
      coin.update();
      if (!coin.collected && checkOverlap(player.x, player.y, player.w, player.h, coin.x, coin.y, coin.w, coin.h)) {
        coin.collected = true;
        stageCoinsCollected++;
        stageScore += 10;
        sfx.coin();
        createDust(coin.x + coin.w / 2, coin.y + coin.h / 2, '#fbbf24', 8);
        updateHUD();
      }
    }

    // Atualiza inimigos e testa colisões
    for (const enemy of currentEnemies) {
      enemy.update();
      if (enemy.alive && checkOverlap(player.x, player.y, player.w, player.h, enemy.x, enemy.y, enemy.w, enemy.h)) {
        handleEnemyCollision(enemy);
      }
    }

    // Atualiza partículas
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      if (particles[i].alpha <= 0) particles.splice(i, 1);
    }

    // Movimentação suave da câmera
    const targetCamX = player.x - CANVAS_WIDTH * 0.35;
    cameraX += (targetCamX - cameraX) * 0.1;
    cameraX = Math.max(0, Math.min(currentStageData.width - CANVAS_WIDTH, cameraX));

    // Testa chegada
    checkGoalReach();
    updateHUD();
  }

  // Renderização do Cenário com Efeito Parallax
  function render() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Fundo Temático com Parallax
    drawParallaxBackground();

    ctx.save();
    ctx.translate(-Math.floor(cameraX), 0);

    // Desenha Plataformas Estáticas
    drawPlatforms();

    // Desenha Plataformas Móveis
    drawMovingPlatforms();

    // Desenha Moedas
    for (const coin of currentCoins) {
      coin.draw(ctx);
    }

    // Desenha Inimigos
    for (const enemy of currentEnemies) {
      enemy.draw(ctx);
    }

    // Desenha Portal / Bandeira de Chegada
    drawFinishMarker();

    // Desenha Partículas
    for (const p of particles) {
      p.draw(ctx);
    }

    // Desenha Jogador
    player.draw(ctx);

    ctx.restore();
  }

  function drawParallaxBackground() {
    const theme = currentStageData.theme;

    if (theme === 'learn') {
      // Céu azul diurno com montanhas verdes suaves
      const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      grad.addColorStop(0, '#38bdf8');
      grad.addColorStop(1, '#bae6fd');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Camada 1: Nuvens distantes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      for (let i = 0; i < 6; i++) {
        const cx = ((i * 300) - cameraX * 0.1) % (CANVAS_WIDTH + 300);
        ctx.beginPath();
        ctx.arc(cx, 60 + (i % 3) * 20, 30, 0, Math.PI * 2);
        ctx.arc(cx + 25, 55 + (i % 3) * 20, 35, 0, Math.PI * 2);
        ctx.arc(cx + 50, 60 + (i % 3) * 20, 28, 0, Math.PI * 2);
        ctx.fill();
      }

      // Camada 2: Colinas verdes
      ctx.fillStyle = '#6ee7b7';
      for (let i = 0; i < 8; i++) {
        const mx = ((i * 240) - cameraX * 0.3) % (CANVAS_WIDTH + 240);
        ctx.beginPath();
        ctx.arc(mx, 430, 160, Math.PI, 0, false);
        ctx.fill();
      }

    } else if (theme === 'tech') {
      // Pôr do sol cibernético com prédios tecnológicos
      const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(0.6, '#4c1d95');
      grad.addColorStop(1, '#f43f5e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Silhuetas de torres e data centers
      ctx.fillStyle = '#0f172a';
      for (let i = 0; i < 12; i++) {
        const bx = ((i * 120) - cameraX * 0.25) % (CANVAS_WIDTH + 140);
        const bh = 140 + (i % 5) * 45;
        ctx.fillRect(bx, CANVAS_HEIGHT - bh, 80, bh);

        // Luzes das janelas
        ctx.fillStyle = '#fef08a';
        for (let wy = CANVAS_HEIGHT - bh + 15; wy < CANVAS_HEIGHT - 30; wy += 25) {
          ctx.fillRect(bx + 15, wy, 8, 8);
          ctx.fillRect(bx + 45, wy, 8, 8);
        }
        ctx.fillStyle = '#0f172a';
      }

    } else {
      // Laboratório / Indústria SENAI de Alta Tecnologia
      const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      grad.addColorStop(0, '#020617');
      grad.addColorStop(0.5, '#07152d');
      grad.addColorStop(1, '#002b54');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Estruturas metálicas e circuitos com LED neon
      ctx.strokeStyle = '#1e3a8a';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 10; i++) {
        const gx = ((i * 150) - cameraX * 0.2) % (CANVAS_WIDTH + 150);
        ctx.strokeRect(gx, 40, 120, 220);
        ctx.beginPath();
        ctx.moveTo(gx, 40);
        ctx.lineTo(gx + 120, 260);
        ctx.stroke();
      }
    }
  }

  function drawPlatforms() {
    for (const p of currentStageData.platforms) {
      if (currentStageData.theme === 'learn') {
        // Grama e terra
        ctx.fillStyle = '#10b981';
        ctx.fillRect(p.x, p.y, p.w, 8);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(p.x, p.y + 8, p.w, p.h - 8);
      } else if (currentStageData.theme === 'tech') {
        // Aço e néon roxo
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x, p.y, p.w, p.h);
      } else {
        // Estrutura Industrial SENAI
        ctx.fillStyle = '#003d73';
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x, p.y, p.w, p.h);
        // Faixa de segurança amarela e preta
        ctx.fillStyle = '#eab308';
        ctx.fillRect(p.x, p.y, p.w, 4);
      }
    }

    // Desenha avisos de perigo / fossos
    for (const h of currentStageData.hazards) {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(h.x, h.y, h.w, h.h);
    }
  }

  function drawMovingPlatforms() {
    for (const p of currentMovingPlatforms) {
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x, p.y, p.w, p.h);

      // Engrenagens indicadoras de movimento
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(p.x + 15, p.y + p.h / 2, 4, 0, Math.PI * 2);
      ctx.arc(p.x + p.w - 15, p.y + p.h / 2, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawFinishMarker() {
    const fx = currentStageData.finishX;

    // Poste da bandeira ou Portal SENAI
    if (currentStageData.theme === 'senai') {
      // Portal de Energia Tecnológico
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.strokeRect(fx - 20, 240, 50, 150);

      const pulse = Math.sin(Date.now() / 200) * 0.2 + 0.8;
      ctx.fillStyle = `rgba(0, 92, 170, ${pulse * 0.7})`;
      ctx.fillRect(fx - 16, 244, 42, 142);

      // Letreiro SENAI
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('SENAI', fx - 14, 235);
    } else {
      // Mastro com Bandeira
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(fx, 250, 5, 140);

      // Bandeira
      ctx.fillStyle = currentStageData.theme === 'learn' ? '#10b981' : '#e11d48';
      ctx.beginPath();
      ctx.moveTo(fx + 5, 255);
      ctx.lineTo(fx + 40, 275);
      ctx.lineTo(fx + 5, 295);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Inicialização do Jogo
  function initGame() {
    canvas = document.getElementById('platform-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    try {
      highScore = parseInt(localStorage.getItem('senai_platform_highscore'), 10) || 0;
      maxStageReached = parseInt(localStorage.getItem('senai_platform_maxstage'), 10) || 1;
    } catch (e) {
      highScore = 0;
      maxStageReached = 1;
    }

    player = new HeroPlayer();
    setupControls();
    loadStage(1);
    updateHUD();
    render();
  }

  function setupControls() {
    // Teclado
    window.addEventListener('keydown', (e) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      sfx.init();

      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.left = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = true;
      if (e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'Space') keys.up = true;
      if (e.code === 'Escape') togglePause();
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = false;
      if (e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'Space') {
        keys.up = false;
        // Pulo com altura variável ao soltar mais cedo
        if (player.vy < -4) player.vy = -4;
      }
    });

    // Controles por Toque (Mobile / Tablets)
    const btnTouchLeft = document.getElementById('touch-left');
    const btnTouchRight = document.getElementById('touch-right');
    const btnTouchJump = document.getElementById('touch-jump');

    const bindTouch = (el, onStart, onEnd) => {
      if (!el) return;
      el.addEventListener('touchstart', (e) => { e.preventDefault(); sfx.init(); onStart(); });
      el.addEventListener('touchend', (e) => { e.preventDefault(); onEnd(); });
      el.addEventListener('mousedown', (e) => { e.preventDefault(); sfx.init(); onStart(); });
      el.addEventListener('mouseup', (e) => { e.preventDefault(); onEnd(); });
    };

    bindTouch(btnTouchLeft, () => { keys.left = true; }, () => { keys.left = false; });
    bindTouch(btnTouchRight, () => { keys.right = true; }, () => { keys.right = false; });
    bindTouch(btnTouchJump, () => { keys.up = true; }, () => {
      keys.up = false;
      if (player.vy < -4) player.vy = -4;
    });

    // Botões de Modal
    const btnStart = document.getElementById('btn-start-platform');
    if (btnStart) btnStart.addEventListener('click', startAdventure);

    const btnNextStage = document.getElementById('btn-next-stage');
    if (btnNextStage) {
      btnNextStage.addEventListener('click', () => {
        hideOverlays();
        gameState = 'PLAYING';
        loadStage(currentStageIndex + 1);
      });
    }

    const btnPlayAgainOver = document.getElementById('btn-platform-play-again');
    if (btnPlayAgainOver) {
      btnPlayAgainOver.addEventListener('click', () => {
        lives = 3;
        totalCumulativeScore = 0;
        hideOverlays();
        gameState = 'PLAYING';
        loadStage(1);
      });
    }

    const btnResume = document.getElementById('btn-platform-resume');
    if (btnResume) btnResume.addEventListener('click', togglePause);

    const btnPause = document.getElementById('btn-platform-pause');
    if (btnPause) btnPause.addEventListener('click', togglePause);

    const btnAudio = document.getElementById('btn-platform-audio');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        sfx.init();
        sfx.enabled = !sfx.enabled;
        btnAudio.textContent = sfx.enabled ? '🔊' : '🔇';
      });
    }
  }

  function startAdventure() {
    sfx.init();
    lives = 3;
    totalCumulativeScore = 0;
    hideOverlays();
    gameState = 'PLAYING';
    loadStage(1);

    if (animationId) cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(gameLoop);
  }

  function togglePause() {
    if (gameState === 'PLAYING') {
      gameState = 'PAUSED';
      showOverlay('overlay-pause-platform');
    } else if (gameState === 'PAUSED') {
      gameState = 'PLAYING';
      hideOverlays();
    }
  }

  window.addEventListener('DOMContentLoaded', initGame);

})();
