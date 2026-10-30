/**
 * MISSÃO: MUNDO DAS REDES - SCRIPT PRINCIPAL E SISTEMA DE ÁUDIO
 * Síntese sonora via Web Audio API, partículas e utilitários globais.
 */

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.enabled = window.StorageManager ? window.StorageManager.getSoundPreference() : false;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (window.StorageManager) {
      window.StorageManager.setSoundPreference(this.enabled);
    }
    if (this.enabled) {
      this.init();
      this.playClick();
    }
    this.updateUI();
    return this.enabled;
  }

  updateUI() {
    const btns = document.querySelectorAll('.audio-toggle-btn');
    btns.forEach(btn => {
      const icon = btn.querySelector('.audio-icon');
      const text = btn.querySelector('.label-text');
      if (this.enabled) {
        btn.classList.add('active');
        btn.setAttribute('aria-label', 'Desativar som do jogo');
        if (icon) icon.innerHTML = '🔊';
        if (text) text.textContent = 'Som: Ligado';
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-label', 'Ativar som do jogo');
        if (icon) icon.innerHTML = '🔇';
        if (text) text.textContent = 'Som: Mudo';
      }
    });
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Erro ao reproduzir tom:', e);
    }
  }

  playClick() {
    this.playTone(600, 'sine', 0.08, 0.08);
  }

  playPacketSend() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }

  playCorrect() {
    if (!this.enabled) return;
    // Acorde alegre de vitória
    setTimeout(() => this.playTone(523.25, 'sine', 0.2, 0.12), 0);   // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.2, 0.12), 100); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.35, 0.15), 200); // G5
  }

  playWrong() {
    if (!this.enabled) return;
    setTimeout(() => this.playTone(320, 'sawtooth', 0.15, 0.08), 0);
    setTimeout(() => this.playTone(260, 'sawtooth', 0.25, 0.08), 120);
  }

  playMissionComplete() {
    if (!this.enabled) return;
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.25, 0.15), idx * 120);
    });
  }

  playTrophyFanfare() {
    if (!this.enabled) return;
    const melody = [
      { f: 523, d: 0.15, t: 0 },
      { f: 523, d: 0.15, t: 150 },
      { f: 523, d: 0.15, t: 300 },
      { f: 659, d: 0.3,  t: 450 },
      { f: 783, d: 0.5,  t: 750 }
    ];
    melody.forEach(item => {
      setTimeout(() => this.playTone(item.f, 'sine', item.d, 0.18), item.t);
    });
  }
}

window.soundSystem = new SoundSystem();

/**
 * Utilitário de Toast de Notificação
 */
function showToast(message, icon = '🚀', duration = 3500) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast-notification';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-msg">${message}</span>`;
    document.body.appendChild(toast);
  } else {
    toast.querySelector('.toast-icon').innerHTML = icon;
    toast.querySelector('.toast-msg').innerHTML = message;
  }

  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

window.showToast = showToast;

/**
 * Inicialização global quando o DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', () => {
  // Inicializa botões de áudio
  window.soundSystem.updateUI();

  const audioBtns = document.querySelectorAll('.audio-toggle-btn');
  audioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const active = window.soundSystem.toggle();
      showToast(active ? 'Efeitos sonoros ativados!' : 'Efeitos sonoros desativados.', active ? '🔊' : '🔇');
    });
  });

  // Sons de clique em botões interativos
  document.addEventListener('click', (e) => {
    const target = e.target.closest('button, .btn, .mission-node, .device-card-btn, .quiz-option-item');
    if (target && !target.classList.contains('audio-toggle-btn')) {
      window.soundSystem.playClick();
    }
  });
});
