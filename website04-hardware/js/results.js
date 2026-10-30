/**
 * ===================================================================
 * MISSÃO HARDWARE — AVENTURA DENTRO DO COMPUTADOR
 * js/results.js — Tela de Resultados, Conquistas e Celebração
 * Mensagens Pedagógicas de Incentivo por Desempenho
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('results-app');
  if (!container) return;

  const lastResult = window.StorageService ? window.StorageService.getLastQuizResult() : null;
  const bestScore = window.StorageService ? window.StorageService.getBestQuizScore() : 0;
  const attempts = window.StorageService ? window.StorageService.getQuizAttempts() : 1;

  const score = lastResult ? lastResult.score : bestScore;
  const correctCount = lastResult ? lastResult.correctCount : Math.round(score / 2);

  // Tiers pedagógicos de incentivo (Seção 17)
  let title = '';
  let badgeColor = '';
  let message = '';
  let trophyEmoji = '🏆';

  if (score === 10) {
    title = 'Campeão da Missão Hardware!';
    badgeColor = 'var(--amarelo-manga)';
    message = 'Incrível! Você acertou todas as 5 questões e dominou os segredos de cada componente com perfeição. O computador agora não tem mais mistérios para você!';
    trophyEmoji = '🏆';
  } else if (score === 8) {
    title = 'Excelente Desempenho!';
    badgeColor = 'var(--verde-lima)';
    message = 'Parabéns, jovem explorador! Você acertou 4 das 5 questões e mostrou que entende muito sobre processador, memórias e circuitos. Está a um passo da nota máxima!';
    trophyEmoji = '🥇';
  } else if (score === 6) {
    title = 'Muito Bom Trabalho!';
    badgeColor = 'var(--turquesa)';
    message = 'Você foi aprovado na missão com sucesso! Acertou a maioria das questões. Com mais uma rápida olhadinha pelos módulos de aprendizagem, você vai gabaritar na próxima!';
    trophyEmoji = '🥈';
  } else {
    title = 'Missão em Andamento!';
    badgeColor = 'var(--coral)';
    message = 'Bom esforço! Cada erro é apenas um passo a mais no aprendizado da informática. Que tal revisitar a CPU, a RAM e a Placa-Mãe no mapa e tentar mais uma vez?';
    trophyEmoji = '🥉';
  }

  container.innerHTML = `
    <div class="results-card" role="region" aria-label="Resultado da Missão">
      <div class="trophy-visual anim-float" aria-hidden="true" style="font-size: 5rem;">
        ${trophyEmoji}
      </div>

      <h1 class="titulo-gamificado" style="font-size: clamp(1.6rem, 1.3rem + 1.2vw, 2.4rem); color: var(--verde-floresta); margin-bottom: 0.5rem;">
        ${title}
      </h1>

      <div class="score-display-big indicador">
        <span id="animated-score-val">${score}</span><span style="font-size: 2rem; color: var(--cor-texto-suave);">/10</span>
      </div>

      <div class="score-badge-label">
        Você acertou <strong>${correctCount} de 5 perguntas</strong>
      </div>

      <div class="result-message-box">
        <p style="margin: 0;">${message}</p>
      </div>

      <div class="results-stats-row">
        <div class="stat-item">
          <span class="stat-val">${bestScore}/10</span>
          <span class="stat-label">Melhor Pontuação</span>
        </div>
        <div class="stat-item">
          <span class="stat-val">${attempts}</span>
          <span class="stat-label">${attempts === 1 ? 'Tentativa Realizada' : 'Tentativas Realizadas'}</span>
        </div>
        <div class="stat-item">
          <span class="stat-val">${window.StorageService ? window.StorageService.getStars().length : 0}</span>
          <span class="stat-label">Estrelas Ganhas</span>
        </div>
      </div>

      <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
        <a href="quiz.html" class="btn btn-primary btn-lima btn-lg">
          🔄 Jogar Novamente
        </a>
        <a href="montagem.html" class="btn btn-turquesa btn-lg">
          🛠️ Montar Computador
        </a>
        <a href="index.html" class="btn btn-outline btn-lg">
          🗺️ Voltar ao Mapa
        </a>
      </div>
    </div>
  `;

  // Som de Fanfarra ou Acerto
  if (window.soundEngine) {
    if (score >= 8) {
      window.soundEngine.playFanfare();
    } else {
      window.soundEngine.playCorrect();
    }
  }

  // Disparo moderado de confetes para boas pontuações (score >= 6)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && score >= 6) {
    launchConfetti();
  }

  function launchConfetti() {
    const confettiBox = document.createElement('div');
    confettiBox.className = 'confetti-container';
    confettiBox.setAttribute('aria-hidden', 'true');
    document.body.appendChild(confettiBox);

    const colors = ['#C5F05A', '#FF765E', '#FFD166', '#43C6B7', '#173F35', '#FFFFFF'];
    const totalPieces = score === 10 ? 55 : 30;

    for (let i = 0; i < totalPieces; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = `${Math.random() * 1.5}s`;
      piece.style.animationDuration = `${2.5 + Math.random() * 1.5}s`;
      piece.style.transform = `scale(${0.6 + Math.random() * 0.8})`;
      confettiBox.appendChild(piece);
    }

    setTimeout(() => {
      confettiBox.remove();
    }, 5500);
  }
});

