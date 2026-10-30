/**
 * Motor Principal do Jogo Super Mario World - Edição Especial SENAI
 * Lógica do jogo, física de plataforma, gravidade, colisões, partículas e loop
 */

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Resolução interna nítida 16:9
        this.width = 960;
        this.height = 540;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Estado do Jogo
        this.state = 'START'; // 'START', 'PLAYING', 'PAUSED', 'GAMEOVER', 'VICTORY'
        this.tick = 0;
        this.score = 0;
        this.coins = 0;
        this.lives = 3;
        this.levelTime = 400; // Segundos
        this.timeTickCounter = 0;

        // Câmera
        this.camera = { x: 0, y: 0 };
        this.levelWidth = 4600;

        // Jogador (Mario)
        this.player = this.createPlayer();

        // Entidades do mundo
        this.blocks = [];
        this.enemies = [];
        this.collectibles = [];
        this.particles = [];
        this.floatingTexts = [];
        this.afterImages = [];
        this.movingPlatforms = [];
        this.flagpole = null;

        // Entrada (Teclado e Toque)
        this.keys = {
            left: false,
            right: false,
            up: false,
            down: false,
            run: false
        };

        // Cache de elementos do DOM
        this.dom = {
            scoreVal: document.getElementById('hudScore'),
            coinsVal: document.getElementById('hudCoins'),
            livesVal: document.getElementById('hudLives'),
            timeVal: document.getElementById('hudTime'),
            senaiBadge: document.getElementById('senaiPowerBadge'),
            senaiBar: document.getElementById('senaiPowerBarFill'),
            senaiTimeTxt: document.getElementById('senaiPowerTime'),
            startScreen: document.getElementById('startScreen'),
            gameOverScreen: document.getElementById('gameOverScreen'),
            victoryScreen: document.getElementById('victoryScreen'),
            pauseScreen: document.getElementById('pauseScreen'),
            btnStart: document.getElementById('btnStart'),
            btnRestartGame: document.getElementById('btnRestartGame'),
            btnPlayAgain: document.getElementById('btnPlayAgain'),
            btnResume: document.getElementById('btnResume'),
            btnRestartPause: document.getElementById('btnRestartPause'),
            btnToggleSound: document.getElementById('btnToggleSound'),
            btnToggleMusic: document.getElementById('btnToggleMusic'),
            finalScoreGameOver: document.getElementById('finalScoreGameOver'),
            finalScoreVictory: document.getElementById('finalScoreVictory'),
            finalCoinsVictory: document.getElementById('finalCoinsVictory'),
            finalRankVictory: document.getElementById('finalRankVictory')
        };

        this.initControls();
        this.buildLevel();
        this.updateHUD();

        // Inicia loop de renderização com persistência garantida
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    createPlayer() {
        return {
            x: 80,
            y: 380,
            width: 32,
            height: 48,
            vx: 0,
            vy: 0,
            speed: 0.45,
            maxSpeed: 4.8,
            runMaxSpeed: 6.8,
            senaiMaxSpeed: 8.5,
            jumpImpulse: -13.2,
            senaiJumpImpulse: -16.5,
            gravity: 0.72,
            friction: 0.86,
            airFriction: 0.94,
            onGround: false,
            coyoteTime: 0,
            jumpBuffered: 0,
            isJumping: false,
            isCrouching: false,
            facingRight: true,
            state: 'idle', // 'idle', 'walk', 'jump', 'crouch', 'dead'
            
            // Sistema de Superpoder SENAI
            hasSuperPower: false,
            superPowerTimer: 0,
            superPowerDuration: 15 * 60, // 15 segundos em 60fps
            
            // Invulnerabilidade temporária pós-dano
            invulnerableTimer: 0,
            isDead: false,
            deathVy: 0
        };
    }

    // Configura eventos de entrada (Teclado e Touch/Mobile)
    initControls() {
        // Teclado
        window.addEventListener('keydown', (e) => {
            try {
                if (window.soundFX) window.soundFX.init();
            } catch (err) {}

            // Início rápido pelo teclado
            if (this.state === 'START' && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W')) {
                e.preventDefault();
                this.startGame();
                return;
            }

            // Reinício rápido pelo teclado
            if ((this.state === 'GAMEOVER' || this.state === 'VICTORY') && (e.key === 'Enter' || e.key === ' ' || e.key === 'r' || e.key === 'R')) {
                e.preventDefault();
                this.restartGame();
                return;
            }

            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }

            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                this.keys.left = true;
            }
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                this.keys.right = true;
            }
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
                if (!this.keys.up) {
                    this.keys.up = true;
                    this.player.jumpBuffered = 6;
                }
            }
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                this.keys.down = true;
            }
            if (e.key === 'Shift' || e.key === 'x' || e.key === 'X' || e.key === 'j' || e.key === 'J') {
                this.keys.run = true;
            }

            // Tecla P ou Esc para Pausar
            if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
                this.togglePause();
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                this.keys.left = false;
            }
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                this.keys.right = false;
            }
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
                this.keys.up = false;
                // Pulo de altura variável: soltar o botão de pulo enquanto sobe corta a velocidade para cima
                if (this.player.vy < -4) {
                    this.player.vy *= 0.45;
                }
            }
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                this.keys.down = false;
            }
            if (e.key === 'Shift' || e.key === 'x' || e.key === 'X' || e.key === 'j' || e.key === 'J') {
                this.keys.run = false;
            }
        });

        // Controles de Toque na Tela para Celular / Tablet
        const bindTouch = (id, keyName) => {
            const btn = document.getElementById(id);
            if (!btn) return;

            const startAction = (e) => {
                if (e && e.cancelable) e.preventDefault();
                try {
                    if (window.soundFX) window.soundFX.init();
                } catch (err) {}

                // Tocar em Pular (A) ou Correr (B) na tela inicial inicia a partida
                if (this.state === 'START' && (keyName === 'up' || keyName === 'run')) {
                    this.startGame();
                    return;
                }
                // Tocar em Pular (A) ou Correr (B) em Game Over ou Vitória reinicia
                if ((this.state === 'GAMEOVER' || this.state === 'VICTORY') && (keyName === 'up' || keyName === 'run')) {
                    this.restartGame();
                    return;
                }

                this.keys[keyName] = true;
                btn.classList.add('active');
                if (keyName === 'up') this.player.jumpBuffered = 6;
            };

            const endAction = (e) => {
                if (e && e.cancelable) e.preventDefault();
                this.keys[keyName] = false;
                btn.classList.remove('active');
                if (keyName === 'up' && this.player.vy < -4) {
                    this.player.vy *= 0.45;
                }
            };

            btn.addEventListener('touchstart', startAction, { passive: false });
            btn.addEventListener('touchend', endAction, { passive: false });
            btn.addEventListener('touchcancel', endAction, { passive: false });
            btn.addEventListener('mousedown', startAction);
            btn.addEventListener('mouseup', endAction);
            btn.addEventListener('mouseleave', endAction);
        };

        bindTouch('touchLeft', 'left');
        bindTouch('touchRight', 'right');
        bindTouch('touchJump', 'up');
        bindTouch('touchRun', 'run');

        // Função utilitária para botões interativos (evita atraso de toque em celular e clique duplo)
        const bindActionButton = (btn, action) => {
            if (!btn) return;
            let lastTrigger = 0;
            const handler = (e) => {
                if (e) {
                    if (e.cancelable && e.type !== 'click') e.preventDefault();
                    e.stopPropagation();
                }
                const now = Date.now();
                if (now - lastTrigger < 300) return;
                lastTrigger = now;
                action();
            };
            btn.addEventListener('click', handler);
            btn.addEventListener('touchend', handler, { passive: false });
        };

        const btnTouchPause = document.getElementById('touchPause');
        if (btnTouchPause) {
            bindActionButton(btnTouchPause, () => this.togglePause());
        }

        // Habilita controles de toque automaticamente em dispositivos com suporte a toque
        const touchContainer = document.getElementById('touchControls');
        if (touchContainer && ('ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0))) {
            touchContainer.style.display = 'flex';
        }

        // Botões de Interface
        bindActionButton(this.dom.btnStart, () => this.startGame());
        bindActionButton(this.dom.btnRestartGame, () => this.restartGame());
        bindActionButton(this.dom.btnPlayAgain, () => this.restartGame());
        bindActionButton(this.dom.btnResume, () => this.togglePause());
        bindActionButton(this.dom.btnRestartPause, () => this.restartGame());

        // Clicar no fundo escuro da tela inicial também inicia o jogo
        if (this.dom.startScreen) {
            this.dom.startScreen.addEventListener('click', (e) => {
                if (e.target === this.dom.startScreen) {
                    this.startGame();
                }
            });
        }

        // Alternadores de Som e Música
        if (this.dom.btnToggleSound) {
            bindActionButton(this.dom.btnToggleSound, () => {
                if (window.soundFX) {
                    window.soundFX.soundEnabled = !window.soundFX.soundEnabled;
                    this.dom.btnToggleSound.innerHTML = window.soundFX.soundEnabled ? '🔊 Sons: ON' : '🔇 Sons: OFF';
                    this.dom.btnToggleSound.classList.toggle('active', window.soundFX.soundEnabled);
                }
            });
        }

        if (this.dom.btnToggleMusic) {
            bindActionButton(this.dom.btnToggleMusic, () => {
                if (window.soundFX) {
                    const isPlaying = window.soundFX.toggleBGM();
                    this.dom.btnToggleMusic.innerHTML = isPlaying ? '🎵 Música: ON' : '🎵 Música: OFF';
                    this.dom.btnToggleMusic.classList.toggle('active', isPlaying);
                }
            });
        }
    }

    // Criação do Nível Completo no Estilo Super Mario World
    buildLevel() {
        this.blocks = [];
        this.enemies = [];
        this.collectibles = [];
        this.movingPlatforms = [];

        const tileSize = 32;
        const groundY = 460;

        // Função auxiliar para chão contínuo com propriedades seguras contra NaN
        const addGround = (startX, endX) => {
            for (let x = startX; x < endX; x += tileSize) {
                // Bloco superior de grama
                this.blocks.push({
                    x, y: groundY,
                    w: tileSize, h: tileSize,
                    type: 'ground',
                    solid: true,
                    bumpY: 0,
                    bumpVelocity: 0,
                    isHit: false
                });
                // Camada inferior de terra profunda
                for (let y = groundY + tileSize; y < this.height + 40; y += tileSize) {
                    this.blocks.push({
                        x, y,
                        w: tileSize, h: tileSize,
                        type: 'ground',
                        solid: true,
                        bumpY: 0,
                        bumpVelocity: 0,
                        isHit: false
                    });
                }
            }
        };

        // Chão 1: Introdução (0 a 1150)
        addGround(0, 1150);

        // Chão 2: Área dos Canos e Plataformas (1250 a 2400)
        addGround(1250, 2400);

        // Chão 3: Trecho Tecnológico SENAI (2520 a 3500)
        addGround(2520, 3500);

        // Chão 4: Reta Final e Mastro (3600 a 4600)
        addGround(3600, 4600);

        // --- BLOCOS DE TIJOLOS E INTERROGAÇÃO '?' ---
        const addBlock = (x, y, type, content = null) => {
            this.blocks.push({
                x, y,
                w: tileSize, h: tileSize,
                type,
                solid: true,
                content, // 'coin', 'senai', ou null
                bumpY: 0,
                bumpVelocity: 0,
                isHit: false
            });
        };

        // Seção 1: Primeiros Blocos de Aprendizado
        addBlock(280, groundY - 120, 'question', 'coin');
        addBlock(340, groundY - 120, 'brick');
        addBlock(372, groundY - 120, 'question', 'coin');
        addBlock(404, groundY - 120, 'brick');
        addBlock(436, groundY - 120, 'question', 'coin');

        // Moedas flutuantes fáceis
        this.collectibles.push({ x: 300, y: groundY - 50, w: 20, h: 24, type: 'coin' });
        this.collectibles.push({ x: 330, y: groundY - 50, w: 20, h: 24, type: 'coin' });
        this.collectibles.push({ x: 480, y: groundY - 50, w: 20, h: 24, type: 'coin' });

        // Inimigo 1: Goomba introdutório
        this.enemies.push(this.createEnemy(540, groundY - 32, 'goomba', -1));

        // Canos Clássicos
        const addPipe = (x, heightBlocks) => {
            const pipeH = heightBlocks * tileSize;
            const pipeY = groundY - pipeH;
            const pipeW = 48;

            // Topo do cano
            this.blocks.push({
                x: x - 4, y: pipeY,
                w: pipeW + 8, h: tileSize,
                type: 'pipe-top',
                solid: true,
                bumpY: 0,
                bumpVelocity: 0,
                isHit: false
            });

            // Corpo do cano
            for (let by = pipeY + tileSize; by < groundY; by += tileSize) {
                this.blocks.push({
                    x, y: by,
                    w: pipeW, h: tileSize,
                    type: 'pipe-body',
                    solid: true,
                    bumpY: 0,
                    bumpVelocity: 0,
                    isHit: false
                });
            }
        };

        addPipe(750, 2);
        addPipe(980, 3);

        // Moeda sobre o cano alto
        this.collectibles.push({ x: 994, y: groundY - 3 * tileSize - 32, w: 20, h: 24, type: 'coin' });

        // Inimigo Koopa entre os canos
        this.enemies.push(this.createEnemy(860, groundY - 36, 'koopa', 1));

        // --- O ITEM ESPECIAL: LOGOMARCA SENAI ---
        // 1. Um item do logo do SENAI flutuando em um pedestal nobre
        this.collectibles.push({
            x: 1480,
            y: groundY - 140,
            w: 48,
            h: 32,
            type: 'senai'
        });

        // Plataforma com o Logo do SENAI
        addBlock(1450, groundY - 100, 'platform');
        addBlock(1482, groundY - 100, 'platform');
        addBlock(1514, groundY - 100, 'platform');

        // 2. Um Bloco Misterioso '?' contendo o SUPERPODER SENAI
        addBlock(2050, groundY - 130, 'question', 'senai');
        addBlock(2018, groundY - 130, 'brick');
        addBlock(2082, groundY - 130, 'brick');

        // Mais moedas na seção 2
        for (let i = 0; i < 5; i++) {
            this.collectibles.push({ x: 1720 + i * 36, y: groundY - 110, w: 20, h: 24, type: 'coin' });
        }

        // Inimigos na seção 2
        this.enemies.push(this.createEnemy(1680, groundY - 32, 'goomba', -1));
        this.enemies.push(this.createEnemy(1920, groundY - 36, 'koopa', -1));
        this.enemies.push(this.createEnemy(2200, groundY - 32, 'goomba', 1));

        // Plataforma Móvel Tecnológica sobre o vão
        this.movingPlatforms.push({
            x: 2410,
            y: groundY - 60,
            w: 80,
            h: 20,
            minX: 2390,
            maxX: 2530,
            vx: 1.5,
            solid: true
        });

        // Seção 3: Super Corrida Tecnológica (Para curtir o Modo SENAI com velocidade e pulos épicos)
        // Pirâmide de Tijolos
        const pyrX = 2750;
        for (let row = 0; row < 4; row++) {
            for (let col = row; col < 4; col++) {
                addBlock(pyrX + col * tileSize, groundY - (row + 1) * tileSize, 'brick');
            }
        }

        // 3º Item do Logo SENAI no topo da formação para garantir a diversão!
        this.collectibles.push({
            x: pyrX + 1 * tileSize + 4,
            y: groundY - 5 * tileSize - 10,
            w: 48,
            h: 32,
            type: 'senai'
        });

        // Linha de moedas douradas
        for (let i = 0; i < 8; i++) {
            this.collectibles.push({ x: 2950 + i * 34, y: groundY - 120, w: 20, h: 24, type: 'coin' });
        }

        // Inimigos patrulhando a reta de corrida
        this.enemies.push(this.createEnemy(3000, groundY - 32, 'goomba', 1));
        this.enemies.push(this.createEnemy(3150, groundY - 32, 'goomba', -1));
        this.enemies.push(this.createEnemy(3320, groundY - 36, 'koopa', -1));

        // Mais canos verdes
        addPipe(3400, 3);

        // Seção 4: Escadaria clássica para o Mastro de Chegada SENAI
        const stairX = 3900;
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j <= i; j++) {
                addBlock(stairX + i * tileSize, groundY - (j + 1) * tileSize, 'brick');
            }
        }

        // Mastro e Bandeira de Vitória SENAI
        this.flagpole = {
            x: 4250,
            y: groundY - 260,
            height: 260,
            flagProgress: 0,
            isReached: false
        };

        // Fortaleza / Portal SENAI após o mastro
        const castleX = 4380;
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 6; j++) {
                addBlock(castleX + i * tileSize, groundY - (j + 1) * tileSize, 'platform');
            }
        }
    }

    createEnemy(x, y, type, dir = -1) {
        return {
            x, y,
            w: 32,
            h: type === 'koopa' ? 38 : 32,
            type, // 'goomba', 'koopa'
            vx: dir * (type === 'koopa' ? 1.4 : 1.1),
            vy: 0,
            dir,
            isDead: false,
            isSquashed: false,
            squashTimer: 0,
            isShell: false,
            shellSpeed: 0,
            facingRight: dir > 0
        };
    }

    // Início / Reinício do Jogo
    startGame() {
        try {
            if (window.soundFX) {
                window.soundFX.init();
            }
        } catch (err) {
            console.warn('Erro ao inicializar áudio:', err);
        }

        this.state = 'PLAYING';
        this.hideAllScreens();
        this.player = this.createPlayer();
        this.score = 0;
        this.coins = 0;
        this.lives = 3;
        this.levelTime = 400;
        this.buildLevel();
        this.updateHUD();
    }

    restartGame() {
        this.hideAllScreens();
        this.state = 'PLAYING';
        this.player = this.createPlayer();
        this.levelTime = 400;
        this.buildLevel();
        this.updateHUD();
        try {
            if (window.soundFX && window.soundFX.bgmEnabled) {
                window.soundFX.startBGM();
            }
        } catch (err) {}
    }

    togglePause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            if (this.dom.pauseScreen) this.dom.pauseScreen.classList.remove('hidden');
        } else if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            if (this.dom.pauseScreen) this.dom.pauseScreen.classList.add('hidden');
        }
    }

    hideAllScreens() {
        if (this.dom.startScreen) this.dom.startScreen.classList.add('hidden');
        if (this.dom.gameOverScreen) this.dom.gameOverScreen.classList.add('hidden');
        if (this.dom.victoryScreen) this.dom.victoryScreen.classList.add('hidden');
        if (this.dom.pauseScreen) this.dom.pauseScreen.classList.add('hidden');
    }

    // Adiciona texto flutuante animado na tela (+100, +1000, MODO SENAI!)
    addFloatingText(x, y, text, color = '#FFFFFF', size = 16) {
        this.floatingTexts.push({
            x, y,
            text,
            color,
            size,
            alpha: 1,
            vy: -1.8,
            life: 50
        });
    }

    // Adiciona partículas na tela (poeira, faíscas, confetes)
    addParticles(x, y, count, color, speed = 3, isSpark = false) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const vel = (Math.random() * 0.7 + 0.3) * speed;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * vel,
                vy: Math.sin(angle) * vel - (isSpark ? 1.5 : 0.5),
                color,
                size: Math.random() * 4 + 2,
                alpha: 1,
                life: Math.random() * 25 + 20,
                maxLife: 45,
                gravity: isSpark ? 0.08 : 0.2
            });
        }
    }

    // Quebra bloco de tijolo em 4 pedaços giratórios
    breakBrick(bx, by) {
        try {
            if (window.soundFX) window.soundFX.playBlockBreak();
        } catch (e) {}

        const colors = ['#B45309', '#78350F', '#D97706'];
        for (let i = 0; i < 4; i++) {
            const vx = (i % 2 === 0 ? -3 : 3) + (Math.random() - 0.5);
            const vy = (i < 2 ? -7 : -4) + (Math.random() - 0.5);
            this.particles.push({
                x: bx + 16,
                y: by + 16,
                vx, vy,
                color: colors[i % colors.length],
                size: 8,
                alpha: 1,
                life: 50,
                maxLife: 50,
                gravity: 0.35,
                isDebris: true
            });
        }
    }

    // Ativação do Poder Oficial SENAI
    activateSenaiSuperPower() {
        this.player.hasSuperPower = true;
        this.player.superPowerTimer = this.player.superPowerDuration;
        this.score += 1000;
        this.updateHUD();

        try {
            if (window.soundFX) window.soundFX.playSenaiPowerUp();
        } catch (e) {}

        this.addFloatingText(this.player.x, this.player.y - 20, 'MODO SENAI ATIVADO! +1000', '#00E5FF', 18);
        this.addParticles(this.player.x + 16, this.player.y + 24, 25, '#ED1C24', 6, true);
        this.addParticles(this.player.x + 16, this.player.y + 24, 25, '#00E5FF', 6, true);
    }

    // Jogador é atingido por inimigo
    hitPlayer() {
        if (this.player.hasSuperPower) return; // Invencível no modo SENAI!
        if (this.player.invulnerableTimer > 0) return; // Pós-dano

        this.lives--;
        try {
            if (window.soundFX) window.soundFX.playHurt();
        } catch (e) {}
        this.updateHUD();

        if (this.lives <= 0) {
            this.killPlayer();
        } else {
            // Tempo de imunidade piscando
            this.player.invulnerableTimer = 150; // 2.5s
            this.player.vy = -7;
            this.addFloatingText(this.player.x, this.player.y - 10, '-1 VIDA!', '#FF4444', 16);
        }
    }

    // Morte do Jogador
    killPlayer() {
        this.player.isDead = true;
        this.player.deathVy = -13;
        try {
            if (window.soundFX) window.soundFX.playGameOver();
        } catch (e) {}

        setTimeout(() => {
            this.state = 'GAMEOVER';
            if (this.dom.finalScoreGameOver) this.dom.finalScoreGameOver.innerText = this.score;
            if (this.dom.gameOverScreen) this.dom.gameOverScreen.classList.remove('hidden');
        }, 1800);
    }

    // Chegada no Mastro / Vitória SENAI
    triggerVictory() {
        if (!this.flagpole || this.flagpole.isReached) return;
        this.flagpole.isReached = true;
        this.state = 'VICTORY_ANIM';

        try {
            if (window.soundFX) window.soundFX.playVictory();
        } catch (e) {}

        // Bônus de tempo restante convertido em pontos
        const timeBonus = Math.floor(this.levelTime * 50);
        this.score += 5000 + timeBonus;
        this.updateHUD();

        this.addFloatingText(this.flagpole.x, this.flagpole.y + 50, 'NÍVEL CONCLUÍDO!', '#FFD700', 22);

        // Confetes de comemoração
        for (let i = 0; i < 60; i++) {
            const confColors = ['#ED1C24', '#00E5FF', '#F1C40F', '#2ECC71', '#FFFFFF'];
            this.addParticles(
                this.flagpole.x + (Math.random() * 120 - 60),
                this.flagpole.y + (Math.random() * 100),
                1,
                confColors[Math.floor(Math.random() * confColors.length)],
                Math.random() * 6 + 2,
                true
            );
        }

        setTimeout(() => {
            this.state = 'VICTORY';
            if (this.dom.finalScoreVictory) this.dom.finalScoreVictory.innerText = this.score;
            if (this.dom.finalCoinsVictory) this.dom.finalCoinsVictory.innerText = this.coins;

            // Classificação Rank
            let rank = 'B';
            if (this.score >= 12000) rank = 'S+ (Mestre SENAI)';
            else if (this.score >= 8000) rank = 'A (Especialista SENAI)';
            else rank = 'B (Técnico SENAI)';
            if (this.dom.finalRankVictory) this.dom.finalRankVictory.innerText = rank;

            if (this.dom.victoryScreen) this.dom.victoryScreen.classList.remove('hidden');
        }, 3200);
    }

    // Atualiza Informações do HUD
    updateHUD() {
        if (this.dom.scoreVal) this.dom.scoreVal.innerText = String(this.score).padStart(6, '0');
        if (this.dom.coinsVal) this.dom.coinsVal.innerText = String(this.coins).padStart(2, '0');
        if (this.dom.livesVal) this.dom.livesVal.innerText = this.lives;
        if (this.dom.timeVal) this.dom.timeVal.innerText = Math.max(0, Math.floor(this.levelTime));

        // Atualização da barra de Superpoder SENAI
        if (this.dom.senaiBadge) {
            if (this.player.hasSuperPower) {
                this.dom.senaiBadge.classList.remove('hidden');
                const percent = (this.player.superPowerTimer / this.player.superPowerDuration) * 100;
                if (this.dom.senaiBar) this.dom.senaiBar.style.width = `${percent}%`;
                const secondsLeft = Math.ceil(this.player.superPowerTimer / 60);
                if (this.dom.senaiTimeTxt) this.dom.senaiTimeTxt.innerText = `${secondsLeft}s`;
            } else {
                this.dom.senaiBadge.classList.add('hidden');
            }
        }
    }

    // Loop de Física e Lógica
    update() {
        this.tick++;

        // Temporizador do Nível
        if (this.state === 'PLAYING') {
            this.timeTickCounter++;
            if (this.timeTickCounter >= 60) {
                this.timeTickCounter = 0;
                this.levelTime--;
                this.updateHUD();
                if (this.levelTime <= 0) {
                    this.killPlayer();
                }
            }
        }

        // Animação de Morte do Jogador
        if (this.player.isDead) {
            this.player.deathVy += 0.55;
            this.player.y += this.player.deathVy;
            return;
        }

        // Animação de descida da bandeira na vitória
        if (this.state === 'VICTORY_ANIM') {
            if (this.flagpole && this.flagpole.flagProgress < 1) {
                this.flagpole.flagProgress = Math.min(1, this.flagpole.flagProgress + 0.02);
            }
            // Mario caminha para o castelo
            this.player.x += 1.8;
            this.player.state = 'walk';
            this.player.facingRight = true;
            this.updateParticles();
            return;
        }

        if (this.state !== 'PLAYING') return;

        const p = this.player;

        // Atualização do Superpoder SENAI
        if (p.hasSuperPower) {
            p.superPowerTimer--;
            if (p.superPowerTimer <= 0) {
                p.hasSuperPower = false;
                this.addFloatingText(p.x, p.y - 15, 'Poder Finalizado', '#CCCCCC', 14);
            }
            this.updateHUD();

            // Rastro fantasma tecnológico (After-images)
            if (Math.abs(p.vx) > 3 || Math.abs(p.vy) > 3) {
                if (this.tick % 4 === 0) {
                    this.afterImages.push({
                        x: p.x,
                        y: p.y,
                        w: p.width,
                        h: p.height,
                        facingRight: p.facingRight,
                        state: p.state,
                        alpha: 0.65,
                        color: this.tick % 8 < 4 ? '#ED1C24' : '#00E5FF'
                    });
                }
            }
        }

        // Timer de imunidade pós-dano
        if (p.invulnerableTimer > 0) {
            p.invulnerableTimer--;
        }

        // Velocidades máximas baseadas nos modos
        let currentMaxSpeed = p.maxSpeed;
        if (p.hasSuperPower) {
            currentMaxSpeed = p.senaiMaxSpeed;
        } else if (this.keys.run) {
            currentMaxSpeed = p.runMaxSpeed;
        }

        // Movimentação Horizontal
        p.isCrouching = this.keys.down && p.onGround;

        if (!p.isCrouching) {
            if (this.keys.left) {
                p.vx -= p.speed;
                p.facingRight = false;
                if (p.vx < -currentMaxSpeed) p.vx = -currentMaxSpeed;
            } else if (this.keys.right) {
                p.vx += p.speed;
                p.facingRight = true;
                if (p.vx > currentMaxSpeed) p.vx = currentMaxSpeed;
            } else {
                p.vx *= (p.onGround ? p.friction : p.airFriction);
                if (Math.abs(p.vx) < 0.1) p.vx = 0;
            }
        } else {
            // Desaceleração mais rápida ao agachar
            p.vx *= 0.75;
            if (Math.abs(p.vx) < 0.1) p.vx = 0;
        }

        // Coyote Time & Jump Buffer
        if (p.onGround) {
            p.coyoteTime = 6;
        } else if (p.coyoteTime > 0) {
            p.coyoteTime--;
        }

        if (p.jumpBuffered > 0) {
            p.jumpBuffered--;
        }

        // Pulo com física realista
        const canJump = (p.onGround || p.coyoteTime > 0) && !p.isCrouching;
        if (canJump && p.jumpBuffered > 0) {
            p.jumpBuffered = 0;
            p.coyoteTime = 0;
            p.onGround = false;
            p.isJumping = true;

            const jumpForce = p.hasSuperPower ? p.senaiJumpImpulse : p.jumpImpulse;
            p.vy = jumpForce;

            try {
                if (p.hasSuperPower) {
                    if (window.soundFX) window.soundFX.playSuperJump();
                    this.addParticles(p.x + p.width / 2, p.y + p.height, 10, '#00E5FF', 3, true);
                } else {
                    if (window.soundFX) window.soundFX.playJump();
                    this.addParticles(p.x + p.width / 2, p.y + p.height, 6, '#DDDDDD', 2);
                }
            } catch (e) {}
        }

        // Gravidade
        p.vy += p.gravity;
        if (p.vy > 14) p.vy = 14; // Velocidade terminal

        // Aplicação do movimento e Colisões (Eixo X e Y separados para física sólida perfeita)
        // 1. Movimento X
        p.x += p.vx;
        this.resolveMapCollision(p, 'x');

        // Limite esquerdo do mapa
        if (p.x < 0) {
            p.x = 0;
            p.vx = 0;
        }

        // 2. Movimento Y
        p.y += p.vy;
        p.onGround = false;
        this.resolveMapCollision(p, 'y');

        // Queda em buraco / abismo
        if (p.y > this.height + 60) {
            this.killPlayer();
        }

        // Atualização do Estado de Animação do Jogador
        if (!p.onGround) {
            p.state = 'jump';
        } else if (p.isCrouching) {
            p.state = 'crouch';
        } else if (Math.abs(p.vx) > 0.4) {
            p.state = 'walk';
            // Poeira ao correr
            if (this.tick % 8 === 0 && Math.abs(p.vx) > 3) {
                this.addParticles(p.x + p.width / 2, p.y + p.height - 2, 2, '#D2B48C', 1.5);
            }
        } else {
            p.state = 'idle';
        }

        // Atualiza Plataformas Móveis
        this.updateMovingPlatforms();

        // Atualiza Inimigos
        this.updateEnemies();

        // Atualiza Coletáveis
        this.updateCollectibles();

        // Checagem do Mastro de Chegada
        if (this.flagpole && !this.flagpole.isReached) {
            if (p.x + p.width >= this.flagpole.x && p.x <= this.flagpole.x + 20) {
                if (p.y + p.height >= this.flagpole.y) {
                    this.triggerVictory();
                }
            }
        }

        // Atualiza Partículas e Efeitos
        this.updateParticles();

        // Rastreamento Suave da Câmera
        const targetCamX = p.x - this.width * 0.35;
        this.camera.x += (targetCamX - this.camera.x) * 0.12;
        if (this.camera.x < 0) this.camera.x = 0;
        if (this.camera.x > this.levelWidth - this.width) {
            this.camera.x = this.levelWidth - this.width;
        }
    }

    // Resolução de Colisões Sólidas AABB com Blocos do Mapa
    resolveMapCollision(p, axis) {
        for (const b of this.blocks) {
            if (!b.solid) continue;

            const curBump = (typeof b.bumpY === 'number' && !isNaN(b.bumpY)) ? b.bumpY : 0;
            const by = b.y + curBump;

            // Teste de intersecção
            if (
                p.x < b.x + b.w &&
                p.x + p.width > b.x &&
                p.y < by + b.h &&
                p.y + p.height > by
            ) {
                if (axis === 'x') {
                    if (p.vx > 0) {
                        p.x = b.x - p.width;
                        p.vx = 0;
                    } else if (p.vx < 0) {
                        p.x = b.x + b.w;
                        p.vx = 0;
                    }
                } else if (axis === 'y') {
                    if (p.vy > 0) {
                        // Aterrissagem no topo do bloco
                        p.y = by - p.height;
                        p.vy = 0;
                        p.onGround = true;
                    } else if (p.vy < 0) {
                        // Batendo a cabeça de baixo pra cima no bloco!
                        p.y = by + b.h;
                        p.vy = 0;
                        this.hitBlockFromBelow(b);
                    }
                }
            }
        }
    }

    // Ação ao bater a cabeça no bloco
    hitBlockFromBelow(b) {
        if (b.type === 'question') {
            if (!b.isHit) {
                b.isHit = true;
                b.bumpVelocity = -5;

                if (b.content === 'coin') {
                    this.coins++;
                    this.score += 200;
                    try {
                        if (window.soundFX) window.soundFX.playCoin();
                    } catch (e) {}
                    this.addFloatingText(b.x + 8, b.y - 16, '+200', '#FFD700', 16);
                    this.addParticles(b.x + 16, b.y, 8, '#F1C40F', 3, true);
                } else if (b.content === 'senai') {
                    // Emerge o logo oficial SENAI de dentro do bloco!
                    this.collectibles.push({
                        x: b.x - 8,
                        y: b.y - 40,
                        w: 48,
                        h: 32,
                        type: 'senai'
                    });
                    try {
                        if (window.soundFX) window.soundFX.playBlockBump();
                    } catch (e) {}
                    this.addFloatingText(b.x, b.y - 45, 'ITEM SENAI!', '#00E5FF', 16);
                }
                this.updateHUD();
            } else {
                try {
                    if (window.soundFX) window.soundFX.playBlockBump();
                } catch (e) {}
            }
        } else if (b.type === 'brick') {
            if (this.player.hasSuperPower) {
                // Modo SENAI quebra blocos de tijolo com impacto estelar!
                b.solid = false;
                this.blocks = this.blocks.filter(block => block !== b);
                this.breakBrick(b.x, b.y);
                this.score += 50;
                this.updateHUD();
            } else {
                b.bumpVelocity = -3.5;
                try {
                    if (window.soundFX) window.soundFX.playBlockBump();
                } catch (e) {}
            }
        } else {
            try {
                if (window.soundFX) window.soundFX.playBlockBump();
            } catch (e) {}
        }
    }

    // Atualização das Plataformas Móveis
    updateMovingPlatforms() {
        for (const plat of this.movingPlatforms) {
            plat.x += plat.vx;
            if (plat.x <= plat.minX || plat.x + plat.w >= plat.maxX) {
                plat.vx *= -1;
            }

            // Se o jogador estiver em cima da plataforma móvel, acompanha o movimento
            const p = this.player;
            if (
                p.onGround &&
                p.y + p.height >= plat.y - 2 &&
                p.y + p.height <= plat.y + 8 &&
                p.x + p.width > plat.x &&
                p.x < plat.x + plat.w
            ) {
                p.x += plat.vx;
                p.y = plat.y - p.height;
            }
        }
    }

    // Atualização e IA dos Inimigos
    updateEnemies() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];

            // Esmagado
            if (e.isSquashed) {
                e.squashTimer++;
                if (e.squashTimer > 30) {
                    this.enemies.splice(i, 1);
                }
                continue;
            }

            // Casco em movimento
            if (e.isShell && e.shellSpeed !== 0) {
                e.x += e.shellSpeed;
            } else {
                e.x += e.vx;
            }

            // Gravidade do inimigo
            e.vy += 0.6;
            if (e.vy > 12) e.vy = 12;
            e.y += e.vy;

            // Colisão do inimigo com o chão e paredes
            for (const b of this.blocks) {
                if (!b.solid) continue;
                if (
                    e.x < b.x + b.w &&
                    e.x + e.w > b.x &&
                    e.y < b.y + b.h &&
                    e.y + e.h > b.y
                ) {
                    // Pouso no chão
                    if (e.vy > 0 && e.y + e.h - e.vy <= b.y + 6) {
                        e.y = b.y - e.h;
                        e.vy = 0;
                    } else {
                        // Bateu na parede: inverte a direção
                        if (e.isShell && e.shellSpeed !== 0) {
                            e.shellSpeed *= -1;
                            try {
                                if (window.soundFX) window.soundFX.playBlockBump();
                            } catch (err) {}
                        } else {
                            e.vx *= -1;
                            e.dir *= -1;
                            e.facingRight = e.dir > 0;
                        }
                    }
                }
            }

            // Queda no abismo
            if (e.y > this.height + 60) {
                this.enemies.splice(i, 1);
                continue;
            }

            // Colisão entre Jogador e Inimigo
            const p = this.player;
            if (
                p.x < e.x + e.w &&
                p.x + p.width > e.x &&
                p.y < e.y + e.h &&
                p.y + p.height > e.y
            ) {
                // Caso 1: Jogador com MODO SENAI ativo destrói qualquer inimigo ao tocar!
                if (p.hasSuperPower) {
                    try {
                        if (window.soundFX) window.soundFX.playEnemyExplode();
                    } catch (err) {}
                    this.score += 1000;
                    this.updateHUD();
                    this.addFloatingText(e.x, e.y - 15, '+1000 SENAI!', '#00E5FF', 18);
                    this.addParticles(e.x + e.w / 2, e.y + e.h / 2, 20, '#ED1C24', 5, true);
                    this.addParticles(e.x + e.w / 2, e.y + e.h / 2, 20, '#00E5FF', 5, true);
                    this.enemies.splice(i, 1);
                    continue;
                }

                // Caso 2: Pousar em cima do inimigo (Stomp clássico do Mario)
                const isFallingOnTop = (p.vy > 0 && p.y + p.height - p.vy <= e.y + e.h * 0.65);

                if (isFallingOnTop) {
                    p.vy = -9.5; // Pulo clássico após esmagar
                    try {
                        if (window.soundFX) window.soundFX.playStomp();
                    } catch (err) {}

                    if (e.type === 'goomba') {
                        e.isSquashed = true;
                        e.squashTimer = 0;
                        this.score += 200;
                        this.addFloatingText(e.x, e.y - 10, '+200', '#FFFFFF', 15);
                    } else if (e.type === 'koopa') {
                        if (!e.isShell) {
                            e.isShell = true;
                            e.shellSpeed = 0;
                            e.h = 28;
                            this.score += 300;
                            this.addFloatingText(e.x, e.y - 10, '+300', '#FFFFFF', 15);
                        } else {
                            // Chuta o casco
                            e.shellSpeed = (p.x < e.x ? 8 : -8);
                        }
                    }
                    this.updateHUD();
                } else {
                    // Caso 3: Colisão lateral ou por baixo -> Jogador toma dano!
                    if (e.isShell && e.shellSpeed === 0) {
                        // Casco parado sendo empurrado
                        e.shellSpeed = (p.x < e.x ? 8 : -8);
                        try {
                            if (window.soundFX) window.soundFX.playStomp();
                        } catch (err) {}
                    } else {
                        this.hitPlayer();
                    }
                }
            }
        }
    }

    // Atualização de Moedas e Itens Coletáveis
    updateCollectibles() {
        const p = this.player;

        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            const c = this.collectibles[i];

            if (
                p.x < c.x + c.w &&
                p.x + p.width > c.x &&
                p.y < c.y + c.h &&
                p.y + p.height > c.y
            ) {
                if (c.type === 'coin') {
                    this.coins++;
                    this.score += 100;
                    try {
                        if (window.soundFX) window.soundFX.playCoin();
                    } catch (err) {}
                    this.addFloatingText(c.x, c.y - 10, '+100', '#FFD700', 14);
                    this.addParticles(c.x + c.w / 2, c.y + c.h / 2, 6, '#F1C40F', 2.5, true);
                    this.collectibles.splice(i, 1);
                    this.updateHUD();
                } else if (c.type === 'senai') {
                    // Coleta da Logomarca Oficial do SENAI!
                    this.activateSenaiSuperPower();
                    this.collectibles.splice(i, 1);
                }
            }
        }
    }

    // Atualiza Partículas, Textos e Efeitos
    updateParticles() {
        // Animação de subida e descida dos blocos golpeados (com sanitização contra NaN)
        for (const b of this.blocks) {
            if (b.bumpVelocity || b.bumpY) {
                b.bumpY = (b.bumpY || 0) + (b.bumpVelocity || 0);
                b.bumpVelocity = (b.bumpVelocity || 0) + 0.8;
                if (b.bumpY >= 0 || isNaN(b.bumpY)) {
                    b.bumpY = 0;
                    b.bumpVelocity = 0;
                }
            } else {
                b.bumpY = 0;
                b.bumpVelocity = 0;
            }
        }

        // Partículas
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const pt = this.particles[i];
            pt.x += pt.vx;
            pt.y += pt.vy;
            pt.vy += pt.gravity;
            pt.life--;
            pt.alpha = pt.life / pt.maxLife;

            if (pt.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Textos flutuantes
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y += ft.vy;
            ft.life--;
            ft.alpha = ft.life / 50;
            if (ft.life <= 0) {
                this.floatingTexts.splice(i, 1);
            }
        }

        // Rastro fantasma do modo SENAI
        for (let i = this.afterImages.length - 1; i >= 0; i--) {
            const ai = this.afterImages[i];
            ai.alpha -= 0.045;
            if (ai.alpha <= 0) {
                this.afterImages.splice(i, 1);
            }
        }
    }

    // Renderização Completa do Jogo
    render() {
        const ctx = this.ctx;
        if (!ctx) return;

        ctx.clearRect(0, 0, this.width, this.height);

        // 1. Fundo Parallax Rico (Céu, Nuvens, Montanhas, Colinas)
        if (window.spriteRenderer) {
            window.spriteRenderer.drawBackground(ctx, this.camera.x, this.width, this.height, this.tick);
        }

        ctx.save();
        ctx.translate(-Math.floor(this.camera.x || 0), 0);

        // 2. Blocos do Nível (Dentro da visualização da câmera)
        const viewLeft = (this.camera.x || 0) - 64;
        const viewRight = (this.camera.x || 0) + this.width + 64;

        if (window.spriteRenderer) {
            for (const b of this.blocks) {
                if (b.x + b.w >= viewLeft && b.x <= viewRight) {
                    window.spriteRenderer.drawBlock(ctx, b.x, b.y, b.w, b.h, b.type, b.bumpY || 0, b.isHit || false, this.tick);
                }
            }

            // 3. Plataformas Móveis
            for (const plat of this.movingPlatforms) {
                window.spriteRenderer.drawBlock(ctx, plat.x, plat.y, plat.w, plat.h, 'platform', 0, false, this.tick);
            }

            // 4. Mastro e Bandeira de Vitória SENAI
            if (this.flagpole) {
                window.spriteRenderer.drawFlagpole(
                    ctx,
                    this.flagpole.x,
                    this.flagpole.y,
                    this.flagpole.height,
                    this.flagpole.flagProgress,
                    this.flagpole.isReached,
                    this.tick
                );
            }

            // 5. Itens Coletáveis (Moedas e Logos SENAI)
            for (const c of this.collectibles) {
                if (c.x + c.w >= viewLeft && c.x <= viewRight) {
                    if (c.type === 'coin') {
                        window.spriteRenderer.drawCoin(ctx, c.x, c.y, c.w, c.h, this.tick);
                    } else if (c.type === 'senai') {
                        window.spriteRenderer.drawSenaiLogoItem(ctx, c.x, c.y, c.w, c.h, this.tick);
                    }
                }
            }

            // 6. Inimigos
            for (const e of this.enemies) {
                if (e.x + e.w >= viewLeft && e.x <= viewRight) {
                    if (e.type === 'goomba') {
                        window.spriteRenderer.drawGoomba(ctx, e.x, e.y, e.w, e.h, e.isSquashed, this.tick);
                    } else if (e.type === 'koopa') {
                        window.spriteRenderer.drawKoopa(ctx, e.x, e.y, e.w, e.h, e.isShell, e.facingRight, this.tick);
                    }
                }
            }

            // 7. Rastros Fantasmas (After-Images do Modo SENAI)
            for (const ai of this.afterImages) {
                ctx.save();
                ctx.globalAlpha = Math.max(0, ai.alpha);
                ctx.fillStyle = ai.color;
                ctx.shadowColor = ai.color;
                ctx.shadowBlur = 10;
                ctx.fillRect(ai.x, ai.y, ai.w, ai.h);
                ctx.restore();
            }

            // 8. O Jogador (Mario)
            const p = this.player;
            const isFlickering = (p.invulnerableTimer > 0 && Math.floor(p.invulnerableTimer / 4) % 2 === 1);
            if (!isFlickering) {
                window.spriteRenderer.drawMario(
                    ctx,
                    p.x, p.y,
                    p.width, p.height,
                    p.state,
                    p.facingRight,
                    p.hasSuperPower,
                    this.tick
                );
            }
        }

        // 9. Partículas (Poeira, Faíscas, Confetes)
        for (const pt of this.particles) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, pt.alpha);
            ctx.fillStyle = pt.color;
            if (pt.isDebris) {
                ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
            } else {
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // 10. Textos Flutuantes (+100, +1000 SENAI!)
        for (const ft of this.floatingTexts) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, ft.alpha);
            ctx.fillStyle = ft.color;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetY = 2;
            ctx.font = `bold ${ft.size}px "Outfit", sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(ft.text, ft.x, ft.y);
            ctx.restore();
        }

        ctx.restore();
    }

    // Loop de Animação com Tratamento de Erros e Recuperação Automática
    loop() {
        try {
            this.update();
            this.render();
        } catch (err) {
            console.error('Erro recuperado no loop do jogo:', err);
        } finally {
            requestAnimationFrame(this.loop);
        }
    }
}

// Inicialização segura compatível com execução em arquivo local file:// ou servidor HTTP
function initGameInstance() {
    if (!window.game) {
        window.game = new Game();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGameInstance);
} else {
    initGameInstance();
}
