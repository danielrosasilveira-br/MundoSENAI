/**
 * ===================================================================
 * MISSÃO HARDWARE — AVENTURA DENTRO DO COMPUTADOR
 * js/audio.js — Sistema de Sons Sintetizados via Web Audio API
 * 100% Offline, Zero Dependências Externas, Mudo por Padrão
 * ===================================================================
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    const settings = window.StorageService ? window.StorageService.getSoundSettings() : { enabled: false, volume: 0.5 };
    this.enabled = settings.enabled;
    this.volume = settings.volume;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound(forceState = null) {
    this.enabled = forceState !== null ? forceState : !this.enabled;
    if (this.enabled) {
      this.initContext();
      this.playClick();
    }
    if (window.StorageService) {
      window.StorageService.saveSoundSettings(this.enabled, this.volume);
    }
    return this.enabled;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, parseFloat(vol)));
    if (window.StorageService) {
      window.StorageService.saveSoundSettings(this.enabled, this.volume);
    }
  }

  /* Efeito: Clique Suave */
  playClick() {
    if (!this.enabled) return;
    try {
      this.initContext();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);

      gain.gain.setValueAtTime(this.volume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn('Áudio indisponível', e);
    }
  }

  /* Efeito: Acerto / Resposta Correta (Chime Alegre) */
  playCorrect() {
    if (!this.enabled) return;
    try {
      this.initContext();
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

      notes.forEach((freq, index) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = now + (index * 0.07);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(this.volume * 0.35, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.22);
      });
    } catch (e) {
      console.warn('Áudio indisponível', e);
    }
  }

  /* Efeito: Encaixe de Peça (Tech Snap) */
  playSnap() {
    if (!this.enabled) return;
    try {
      this.initContext();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.09);

      gain.gain.setValueAtTime(this.volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.warn('Áudio indisponível', e);
    }
  }

  /* Efeito: Tentativa Incorreta (Informativo, não punitivo) */
  playError() {
    if (!this.enabled) return;
    try {
      this.initContext();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.15);

      gain.gain.setValueAtTime(this.volume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.warn('Áudio indisponível', e);
    }
  }

  /* Efeito: Conquista de Estrela (Brilho Cintilante) */
  playStar() {
    if (!this.enabled) return;
    try {
      this.initContext();
      const now = this.ctx.currentTime;
      const freqs = [659.25, 880, 1046.50, 1318.51]; // E5, A5, C6, E6

      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + (idx * 0.05);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(this.volume * 0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.18);
      });
    } catch (e) {
      console.warn('Áudio indisponível', e);
    }
  }

  /* Efeito: Fanfarra de Missão Concluída / Troféu */
  playFanfare() {
    if (!this.enabled) return;
    try {
      this.initContext();
      const now = this.ctx.currentTime;
      // Fanfarra alegre: C4, G4, C5, E5, G5, C6
      const melody = [
        { freq: 261.63, delay: 0.00, dur: 0.14 },
        { freq: 392.00, delay: 0.14, dur: 0.14 },
        { freq: 523.25, delay: 0.28, dur: 0.14 },
        { freq: 659.25, delay: 0.42, dur: 0.18 },
        { freq: 783.99, delay: 0.60, dur: 0.18 },
        { freq: 1046.50, delay: 0.78, dur: 0.45 }
      ];

      melody.forEach(note => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + note.delay;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.freq, start);

        gain.gain.setValueAtTime(this.volume * 0.4, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + note.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + note.dur);
      });
    } catch (e) {
      console.warn('Áudio indisponível', e);
    }
  }
}

window.soundEngine = new SoundEngine();

