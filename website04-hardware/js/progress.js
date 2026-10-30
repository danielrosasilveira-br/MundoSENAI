/**
 * ===================================================================
 * MISSÃO HARDWARE — AVENTURA DENTRO DO COMPUTADOR
 * js/progress.js — Gerenciamento e Atualização Visual do Progresso Geral
 * ===================================================================
 */

const ProgressManager = {
  ALL_MODULES: [
    'processador',
    'memoria-ram',
    'placa-mae',
    'armazenamento',
    'fonte',
    'perifericos'
  ],

  calculateSummary() {
    if (!window.StorageService) return { visitedCount: 0, starsCount: 0, bestScore: 0, percentage: 0 };

    const visited = window.StorageService.getVisitedModules();
    const stars = window.StorageService.getStars();
    const bestScore = window.StorageService.getBestQuizScore();
    const assembly = window.StorageService.getAssemblyState();

    // 6 módulos + 1 montagem + 1 quiz = 8 marcos principais
    let completedPoints = visited.length;
    if (assembly && assembly.stage1Complete && assembly.stage2Complete) completedPoints += 1;
    if (bestScore >= 6) completedPoints += 1;

    const percentage = Math.min(100, Math.round((completedPoints / 8) * 100));

    return {
      visitedCount: visited.length,
      totalModules: this.ALL_MODULES.length,
      starsCount: stars.length,
      bestScore: bestScore,
      percentage: percentage
    };
  },

  updateHUD() {
    const summary = this.calculateSummary();

    const modulesEl = document.getElementById('hud-modules-val');
    if (modulesEl) {
      modulesEl.textContent = `${summary.visitedCount}/${summary.totalModules}`;
    }

    const starsEl = document.getElementById('hud-stars-val');
    if (starsEl) {
      starsEl.textContent = summary.starsCount;
    }

    const scoreEl = document.getElementById('hud-score-val');
    if (scoreEl) {
      scoreEl.textContent = `${summary.bestScore}/10`;
    }

    const fillEl = document.getElementById('hud-progress-fill');
    if (fillEl) {
      fillEl.style.width = `${summary.percentage}%`;
    }

    const textEl = document.getElementById('hud-progress-text');
    if (textEl) {
      textEl.textContent = `${summary.percentage}%`;
    }

    // Atualiza badges em cards ou itens com data-module
    document.querySelectorAll('[data-module-id]').forEach(el => {
      const modId = el.getAttribute('data-module-id');
      const visited = window.StorageService ? window.StorageService.getVisitedModules().includes(modId) : false;
      if (visited) {
        el.classList.add('visited');
        const badge = el.querySelector('.module-status-badge');
        if (badge) {
          badge.textContent = 'Explorado ✓';
          badge.className = 'badge badge-concluido module-status-badge';
        }
      }
    });
  },

  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-msg toast-${type}`;
    toast.innerHTML = `<span>⚡</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};

window.ProgressManager = ProgressManager;

