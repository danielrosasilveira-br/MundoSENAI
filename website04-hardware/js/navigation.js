/**
 * ===================================================================
 * MISSÃO HARDWARE — AVENTURA DENTRO DO COMPUTADOR
 * js/navigation.js — Navegação, Menu, Diálogo de Reinício e Controles
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Marca navegação ativa de acordo com o arquivo atual
  const path = window.location.pathname;
  const pageName = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName || (pageName === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // 2. Registra visita automática se a página for um módulo educativo
  if (window.StorageService && window.ProgressManager) {
    const moduleMap = {
      'processador.html': 'processador',
      'memoria-ram.html': 'memoria-ram',
      'placa-mae.html': 'placa-mae',
      'armazenamento.html': 'armazenamento',
      'fonte.html': 'fonte',
      'perifericos.html': 'perifericos'
    };

    const currentMod = moduleMap[pageName];
    if (currentMod) {
      const isNew = window.StorageService.markModuleVisited(currentMod);
      if (isNew) {
        window.ProgressManager.showToast(`Nova área descoberta: ${currentMod.toUpperCase()}!`, 'success');
        if (window.soundEngine) window.soundEngine.playStar();
      }
    }

    window.ProgressManager.updateHUD();
  }

  // 3. Controle de Som
  const soundBtn = document.getElementById('btn-sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  const soundText = document.getElementById('sound-text');
  const volumeSlider = document.getElementById('sound-volume-slider');

  function updateSoundUI(enabled) {
    if (soundBtn) {
      if (enabled) {
        soundBtn.classList.add('active');
        soundBtn.setAttribute('aria-label', 'Desativar sons do jogo');
        if (soundText) soundText.textContent = 'Som: ON';
        if (soundIcon) soundIcon.innerHTML = '🔊';
      } else {
        soundBtn.classList.remove('active');
        soundBtn.setAttribute('aria-label', 'Ativar sons do jogo');
        if (soundText) soundText.textContent = 'Som: OFF';
        if (soundIcon) soundIcon.innerHTML = '🔇';
      }
    }
  }

  if (soundBtn && window.soundEngine) {
    updateSoundUI(window.soundEngine.enabled);

    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const newState = window.soundEngine.toggleSound();
      updateSoundUI(newState);
      if (window.ProgressManager) {
        window.ProgressManager.showToast(newState ? 'Efeitos sonoros ativados!' : 'Efeitos sonoros desativados.', 'info');
      }
    });
  }

  if (volumeSlider && window.soundEngine) {
    volumeSlider.value = window.soundEngine.volume;
    volumeSlider.addEventListener('input', (e) => {
      window.soundEngine.setVolume(e.target.value);
    });
  }

  // 4. Modal Acessível de Reinício de Progresso
  const resetBtn = document.getElementById('btn-reset-progress');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playClick();
      openResetModal();
    });
  }

  function openResetModal() {
    let overlay = document.getElementById('reset-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'reset-modal-overlay';
      overlay.className = 'modal-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-labelledby', 'reset-modal-title');

      overlay.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-header">
            <span style="font-size: 1.8rem;">⚠️</span>
            <h2 id="reset-modal-title" class="modal-title">Reiniciar Aventura?</h2>
          </div>
          <div class="modal-body">
            <p>Tem certeza de que deseja zerar os módulos visitados, estrelas e pontuações do quiz?</p>
            <p style="font-size: 0.85rem; color: var(--cor-texto-suave); margin-top: 0.5rem;">
              Seus dados de progresso estão salvos apenas neste navegador. Ao confirmar, você começará a missão novamente como um novo recruta.
            </p>
          </div>
          <div class="modal-actions">
            <button id="modal-cancel-btn" class="btn btn-outline btn-sm">Cancelar</button>
            <button id="modal-confirm-reset-btn" class="btn btn-coral btn-sm">Sim, Zerar Progresso</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      overlay.querySelector('#modal-cancel-btn').addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playClick();
        overlay.remove();
      });

      overlay.querySelector('#modal-confirm-reset-btn').addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playSnap();
        if (window.StorageService) {
          window.StorageService.resetAll();
        }
        overlay.remove();
        if (window.ProgressManager) {
          window.ProgressManager.updateHUD();
          window.ProgressManager.showToast('Progresso zerado com sucesso! Boa sorte na nova jornada.', 'info');
        }
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 800);
      });

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
      });

      document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape' && document.getElementById('reset-modal-overlay')) {
          overlay.remove();
          document.removeEventListener('keydown', escHandler);
        }
      });
    }
  }
});

