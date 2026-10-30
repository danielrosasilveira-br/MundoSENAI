/**
 * ===================================================================
 * MISSÃO HARDWARE — AVENTURA DENTRO DO COMPUTADOR
 * js/app.js — Orquestrador Geral da Aplicação
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialização de acessibilidade e foco
  console.log('⚡ Missão Hardware — Aventura Dentro do Computador iniciada.');

  // Atualiza HUD no carregamento
  if (window.ProgressManager) {
    window.ProgressManager.updateHUD();
  }

  // Tecla de atalho para acessibilidade (Alt + S para som)
  document.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      const soundBtn = document.getElementById('btn-sound-toggle');
      if (soundBtn) soundBtn.click();
    }
  });
});

