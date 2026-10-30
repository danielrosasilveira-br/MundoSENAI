/**
 * MISSÃO: MUNDO DAS REDES - GERENCIADOR DE NAVEGAÇÃO E MODAIS
 * Controle acessível de modais (Como Jogar, Confirmação de Reset) e atalhos.
 */

const NavigationManager = {
  activeModal: null,

  init() {
    this.bindModals();
    this.bindResetButtons();
    this.bindKeyboard();
  },

  /**
   * Abre um modal acessível
   */
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    this.activeModal = modal;

    // Foco no primeiro elemento focável ou no botão fechar
    const closeBtn = modal.querySelector('.modal-close-btn') || modal.querySelector('button');
    if (closeBtn) closeBtn.focus();

    document.body.style.overflow = 'hidden';
  },

  /**
   * Fecha o modal ativo
   */
  closeModal(modal) {
    const target = modal || this.activeModal;
    if (!target) return;

    target.classList.remove('active');
    target.setAttribute('aria-hidden', 'true');
    this.activeModal = null;
    document.body.style.overflow = '';
  },

  bindModals() {
    // Botões que abrem modais
    document.addEventListener('click', (e) => {
      const openBtn = e.target.closest('[data-open-modal]');
      if (openBtn) {
        const modalId = openBtn.getAttribute('data-open-modal');
        this.openModal(modalId);
      }

      // Botões de fechar modal
      const closeBtn = e.target.closest('.modal-close-btn, [data-close-modal]');
      if (closeBtn) {
        const modal = closeBtn.closest('.modal-overlay');
        this.closeModal(modal);
      }

      // Clique fora no backdrop
      if (e.target.classList.contains('modal-overlay')) {
        this.closeModal(e.target);
      }
    });
  },

  bindResetButtons() {
    document.addEventListener('click', (e) => {
      const confirmResetBtn = e.target.closest('#btnConfirmReset');
      if (confirmResetBtn) {
        if (window.StorageManager) {
          window.StorageManager.resetProgress();
          if (window.showToast) {
            window.showToast('Progresso reiniciado com sucesso!', '🔄');
          }
          const modal = confirmResetBtn.closest('.modal-overlay');
          this.closeModal(modal);

          // Se estiver na tela de mapa ou resultado, recarrega para atualizar estados
          setTimeout(() => {
            window.location.reload();
          }, 300);
        }
      }
    });
  },

  bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.closeModal(this.activeModal);
      }
    });
  }
};

window.NavigationManager = NavigationManager;

document.addEventListener('DOMContentLoaded', () => {
  NavigationManager.init();
});
