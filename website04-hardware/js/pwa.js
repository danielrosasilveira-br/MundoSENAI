/**
 * ===================================================================
 * MISSÃO HARDWARE — AVENTURA DENTRO DO COMPUTADOR
 * js/pwa.js — Registro do Service Worker, Instalação PWA e Status Offline
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Registro do Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registrado com sucesso:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Falha no registro do Service Worker:', err);
        });
    });
  }

  // 2. Prompt de Instalação PWA (Botão "Instalar Aplicativo")
  let deferredPrompt = null;
  const installBtn = document.getElementById('btn-pwa-install');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) {
      installBtn.style.display = 'inline-flex';
    }
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('[PWA] Escolha do usuário:', outcome);
        deferredPrompt = null;
        installBtn.style.display = 'none';
      }
    });
  }

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] Missão Hardware instalado com sucesso!');
    if (installBtn) installBtn.style.display = 'none';
    if (window.ProgressManager) {
      window.ProgressManager.showToast('Missão Hardware instalado com sucesso no seu dispositivo!', 'success');
    }
  });

  // 3. Monitoramento de Conexão Online / Offline
  function updateOnlineStatus() {
    const offlineBadge = document.getElementById('offline-status-badge');
    if (!offlineBadge) return;

    if (navigator.onLine) {
      offlineBadge.textContent = 'Modo Offline Pronto ⚡';
      offlineBadge.style.borderColor = 'var(--turquesa)';
      offlineBadge.style.color = 'var(--turquesa)';
    } else {
      offlineBadge.textContent = 'Trabalhando 100% Offline 🚀';
      offlineBadge.style.borderColor = 'var(--verde-lima)';
      offlineBadge.style.color = 'var(--verde-lima)';
      if (window.ProgressManager) {
        window.ProgressManager.showToast('Você está offline. Todo o conteúdo continua funcionando perfeitamente!', 'info');
      }
    }
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
});

