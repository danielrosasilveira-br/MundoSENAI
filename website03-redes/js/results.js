/**
 * MISSÃO: MUNDO DAS REDES - RESULTADO FINAL E MEDALHAS
 * Classificação por medalha, confetes no canvas e exibição de notas.
 */

const MEDALS_CONFIG = {
  ouro: {
    minScore: 100,
    title: 'MEDALHA DE OURO',
    subtitle: 'Fantástico! Você dominou os conceitos básicos das redes de computadores!',
    color: '#ffbe0b',
    svg: `
      <svg class="medal-svg-badge animate-pop-medal" viewBox="0 0 160 160">
        <!-- Faixa Azul da Medalha -->
        <path d="M 50 10 L 80 70 L 40 70 Z" fill="#3a86ff"/>
        <path d="M 110 10 L 80 70 L 120 70 Z" fill="#00d2ff"/>
        <!-- Corpo da Medalha Dourada -->
        <circle cx="80" cy="100" r="45" fill="url(#goldGradient)" stroke="#ffe699" stroke-width="4"/>
        <!-- Troféu Central -->
        <path d="M 65 85 L 95 85 L 90 105 C 88 112 72 112 70 105 Z" fill="#070d1e"/>
        <path d="M 75 110 L 85 110 L 85 118 L 75 118 Z" fill="#070d1e"/>
        <rect x="70" y="118" width="20" height="6" rx="2" fill="#070d1e"/>
        <!-- Estrelas -->
        <circle cx="80" cy="95" r="4" fill="#ffbe0b"/>
        <!-- Gradientes -->
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff176"/>
            <stop offset="50%" stop-color="#ffb300"/>
            <stop offset="100%" stop-color="#ff8f00"/>
          </linearGradient>
        </defs>
      </svg>
    `
  },
  prata: {
    minScore: 80,
    title: 'MEDALHA DE PRATA',
    subtitle: 'Muito bem! Você está se tornando um grande explorador das redes!',
    color: '#e2e8f0',
    svg: `
      <svg class="medal-svg-badge animate-pop-medal" viewBox="0 0 160 160">
        <path d="M 50 10 L 80 70 L 40 70 Z" fill="#3a86ff"/>
        <path d="M 110 10 L 80 70 L 120 70 Z" fill="#00d2ff"/>
        <circle cx="80" cy="100" r="45" fill="url(#silverGradient)" stroke="#ffffff" stroke-width="4"/>
        <polygon points="80,75 87,90 103,91 91,102 95,118 80,109 65,118 69,102 57,91 73,90" fill="#070d1e"/>
        <defs>
          <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="50%" stop-color="#cbd5e1"/>
            <stop offset="100%" stop-color="#94a3b8"/>
          </linearGradient>
        </defs>
      </svg>
    `
  },
  bronze: {
    minScore: 60,
    title: 'MEDALHA DE BRONZE',
    subtitle: 'Bom trabalho! Você já conhece vários conceitos importantes. Continue aprendendo!',
    color: '#cd7f32',
    svg: `
      <svg class="medal-svg-badge animate-pop-medal" viewBox="0 0 160 160">
        <path d="M 50 10 L 80 70 L 40 70 Z" fill="#3a86ff"/>
        <path d="M 110 10 L 80 70 L 120 70 Z" fill="#00d2ff"/>
        <circle cx="80" cy="100" r="45" fill="url(#bronzeGradient)" stroke="#e0a96d" stroke-width="4"/>
        <!-- Símbolo de Engrenagem / Rede -->
        <circle cx="80" cy="100" r="16" fill="none" stroke="#070d1e" stroke-width="6"/>
        <circle cx="80" cy="100" r="6" fill="#070d1e"/>
        <defs>
          <linearGradient id="bronzeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#e0a96d"/>
            <stop offset="50%" stop-color="#cd7f32"/>
            <stop offset="100%" stop-color="#8c4d19"/>
          </linearGradient>
        </defs>
      </svg>
    `
  },
  participacao: {
    minScore: 40,
    title: 'MEDALHA DE PARTICIPAÇÃO',
    subtitle: 'Você está no caminho certo! Revise as missões e tente novamente!',
    color: '#38bdf8',
    svg: `
      <svg class="medal-svg-badge animate-pop-medal" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="50" fill="url(#partGradient)" stroke="#7dd3fc" stroke-width="4"/>
        <!-- Ícone de Livro / Escudo -->
        <path d="M 60 70 Q 80 65 80 95 Q 80 65 100 70 L 100 100 Q 80 95 80 115 Q 80 95 60 100 Z" fill="#070d1e"/>
        <defs>
          <linearGradient id="partGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="100%" stop-color="#0284c7"/>
          </linearGradient>
        </defs>
      </svg>
    `
  },
  iniciante: {
    minScore: 0,
    title: 'MEDALHA DE EXPLORADOR INICIANTE',
    subtitle: 'Toda grande aventura começa com o primeiro passo. Vamos explorar as missões mais uma vez!',
    color: '#a78bfa',
    svg: `
      <svg class="medal-svg-badge animate-pop-medal" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="50" fill="url(#initGradient)" stroke="#c4b5fd" stroke-width="4"/>
        <!-- Ícone de Bússola -->
        <circle cx="80" cy="80" r="28" fill="none" stroke="#070d1e" stroke-width="4"/>
        <polygon points="80,60 88,80 80,74 72,80" fill="#e30613"/>
        <polygon points="80,100 88,80 80,86 72,80" fill="#070d1e"/>
        <defs>
          <linearGradient id="initGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#c4b5fd"/>
            <stop offset="100%" stop-color="#7c3aed"/>
          </linearGradient>
        </defs>
      </svg>
    `
  }
};

const ResultsController = {
  init() {
    this.renderResults();
  },

  renderResults() {
    const data = window.StorageManager ? window.StorageManager.getData() : null;
    const score = (data && data.quiz && data.quiz.lastScore !== null) ? data.quiz.lastScore : 100;
    const correctCount = (data && data.quiz) ? data.quiz.correctCount : Math.round(score / 20);
    const incorrectCount = 5 - correctCount;
    const bestScore = (data && data.quiz && data.quiz.bestScore !== null) ? data.quiz.bestScore : score;

    // Determina a medalha
    let medalKey = 'iniciante';
    if (score === 100) medalKey = 'ouro';
    else if (score >= 80) medalKey = 'prata';
    else if (score >= 60) medalKey = 'bronze';
    else if (score >= 40) medalKey = 'participacao';
    else medalKey = 'iniciante';

    const medal = MEDALS_CONFIG[medalKey];

    // Atualiza o DOM
    const scoreVal = document.getElementById('resScoreVal');
    const medalDisplay = document.getElementById('resMedalDisplay');
    const medalTitle = document.getElementById('resMedalTitle');
    const medalSubtitle = document.getElementById('resMedalSubtitle');
    const countCorrect = document.getElementById('resCountCorrect');
    const countWrong = document.getElementById('resCountWrong');
    const bestScoreVal = document.getElementById('resBestScoreVal');

    if (scoreVal) scoreVal.textContent = `${score}`;
    if (medalDisplay) medalDisplay.innerHTML = medal.svg;
    if (medalTitle) {
      medalTitle.textContent = medal.title;
      medalTitle.style.color = medal.color;
    }
    if (medalSubtitle) medalSubtitle.textContent = medal.subtitle;
    if (countCorrect) countCorrect.textContent = `${correctCount}/5`;
    if (countWrong) countWrong.textContent = `${incorrectCount}/5`;
    if (bestScoreVal) bestScoreVal.textContent = `${bestScore}/100`;

    // Toca som e dispara confetes se nota >= 60
    if (window.soundSystem) {
      if (score === 100) {
        window.soundSystem.playTrophyFanfare();
      } else if (score >= 60) {
        window.soundSystem.playMissionComplete();
      }
    }

    if (score >= 60) {
      this.launchConfetti();
    }
  },

  /**
   * Confetes leves em Canvas puro (sem bibliotecas externas)
   */
  launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#00d2ff', '#00f5d4', '#ffbe0b', '#ff006e', '#8338ec', '#ffffff'];
    const particles = [];
    const count = window.innerWidth < 600 ? 50 : 110;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        w: Math.random() * 9 + 4,
        h: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: Math.random() * 3 + 2,
        vx: (Math.random() - 0.5) * 3,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 6
      });
    }

    let animationFrame;
    let frames = 0;

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y += p.vy;
        p.x += p.vx;
        p.rot += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      frames++;
      if (frames < 280) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    render();
  }
};

window.ResultsController = ResultsController;

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('resScoreVal')) {
    ResultsController.init();
  }
});
