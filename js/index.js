/**
 * PROJETO EDUCACIONAL SENAI — PORTAL PRINCIPAL
 * Script para carregamento dinâmico de estatísticas locais e interações.
 */

document.addEventListener('DOMContentLoaded', () => {
  loadPortalStats();
  initCardInteractions();
});

function loadPortalStats() {
  try {
    // Estatísticas do Pac-Man
    const pacmanHighScore = localStorage.getItem('senai_pacman_highscore') || '0';
    const elPacman = document.getElementById('stat-pacman-score');
    if (elPacman) elPacman.textContent = Number(pacmanHighScore).toLocaleString('pt-BR');

    // Estatísticas da Plataforma
    const platformScore = localStorage.getItem('senai_platform_highscore') || '0';
    const platformStage = localStorage.getItem('senai_platform_maxstage') || '1';
    const elPlatform = document.getElementById('stat-platform-stage');
    if (elPlatform) elPlatform.textContent = `Fase ${platformStage} (${Number(platformScore).toLocaleString('pt-BR')} pts)`;

    // Estatísticas de Redes
    const redesQuiz = localStorage.getItem('senai_redes_quiz_best') || '0';
    const elRedes = document.getElementById('stat-redes-quiz');
    if (elRedes) elRedes.textContent = `${redesQuiz}/10 Acertos`;

    // Estatísticas de Hardware
    const hwQuiz = localStorage.getItem('senai_hardware_quiz_best') || '0';
    const elHw = document.getElementById('stat-hw-quiz');
    if (elHw) elHw.textContent = `${hwQuiz}/10 Acertos`;

  } catch (e) {
    console.warn('Armazenamento local indisponível ou bloqueado:', e);
  }
}

function initCardInteractions() {
  const cards = document.querySelectorAll('.portal-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.willChange = 'transform, box-shadow';
    });
    card.addEventListener('mouseleave', () => {
      card.style.willChange = 'auto';
    });
  });
}
