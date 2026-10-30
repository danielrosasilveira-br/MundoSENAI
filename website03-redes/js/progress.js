/**
 * MISSÃO: MUNDO DAS REDES - GERENCIADOR DE PROGRESSO
 * Cálculo de avanço global, sincronização de barras e liberação de fases.
 */

const ProgressManager = {
  /**
   * Calcula a porcentagem geral de conclusão
   */
  getProgressPercentage() {
    if (!window.StorageManager) return 0;
    const data = window.StorageManager.getData();
    let total = 0;

    // Missão 1 vale 30%
    if (data.missions && data.missions.missao1) total += 30;
    // Missão 2 vale 30%
    if (data.missions && data.missions.missao2) total += 30;
    // Laboratório vale 15%
    if (data.missions && data.missions.lab) total += 15;
    // Questionário concluído vale 25%
    if (data.quiz && data.quiz.lastScore !== null) total += 25;

    return Math.min(100, total);
  },

  /**
   * Retorna a contagem de missões concluídas
   */
  getCompletedCount() {
    if (!window.StorageManager) return { count: 0, total: 4 };
    const data = window.StorageManager.getData();
    let count = 0;
    if (data.missions.missao1) count++;
    if (data.missions.missao2) count++;
    if (data.missions.lab) count++;
    if (data.quiz.lastScore !== null) count++;
    return { count, total: 4 };
  },

  /**
   * Atualiza elementos de barra de progresso no DOM
   */
  updateProgressUI() {
    const percent = this.getProgressPercentage();
    const { count, total } = this.getCompletedCount();

    const progressBars = document.querySelectorAll('.hud-progress-bar');
    progressBars.forEach(bar => {
      bar.style.width = `${percent}%`;
      bar.setAttribute('aria-valuenow', percent);
    });

    const percentTexts = document.querySelectorAll('.hud-progress-percent-val');
    percentTexts.forEach(el => {
      el.textContent = `${percent}%`;
    });

    const countsTexts = document.querySelectorAll('.hud-missions-count-val');
    countsTexts.forEach(el => {
      el.textContent = `${count}/${total}`;
    });
  },

  /**
   * Determina os estados das fases para o mapa
   */
  getMissionStates() {
    if (!window.StorageManager) {
      return {
        missao1: 'available',
        missao2: 'locked',
        lab: 'available',
        quiz: 'locked'
      };
    }

    const data = window.StorageManager.getData();
    const m1Done = Boolean(data.missions && data.missions.missao1);
    const m2Done = Boolean(data.missions && data.missions.missao2);
    const labDone = Boolean(data.missions && data.missions.lab);
    const quizDone = Boolean(data.quiz && data.quiz.lastScore !== null);

    return {
      missao1: m1Done ? 'completed' : 'available',
      missao2: m2Done ? 'completed' : (m1Done ? 'available' : 'locked'),
      lab: labDone ? 'completed' : 'available', // Laboratório é acessível como atividade complementar
      quiz: quizDone ? 'completed' : (m1Done && m2Done ? 'available' : 'locked')
    };
  }
};

window.ProgressManager = ProgressManager;

document.addEventListener('DOMContentLoaded', () => {
  ProgressManager.updateProgressUI();

  window.addEventListener('gamestate:updated', () => {
    ProgressManager.updateProgressUI();
  });

  window.addEventListener('gamestate:reset', () => {
    ProgressManager.updateProgressUI();
  });
});
