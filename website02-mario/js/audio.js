/**
 * Sistema de Áudio Retro 16-Bit com Web Audio API
 * Efeitos sonoros procedurais autênticos estilo Super Mario World
 * Sem necessidade de arquivos externos - 100% autônomo e sem falhas de carregamento!
 */

class SoundFX {
    constructor() {
        this.ctx = null;
        this.soundEnabled = true;
        this.bgmEnabled = false;
        this.bgmPlaying = false;
        this.bgmOscs = [];
        this.bgmTimer = null;
        this.tempo = 140; // BPM
        this.currentStep = 0;
    }

    init() {
        try {
            if (!this.ctx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    this.ctx = new AudioContext();
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume().catch(() => {});
            }
        } catch (err) {
            console.warn('AudioContext init aguardando interação do usuário:', err);
        }
    }

    // Toca som de pulo clássico
    playJump() {
        if (!this.soundEnabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.16);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.19);
    }

    // Toca som de super pulo (Modo SENAI)
    playSuperJump() {
        if (!this.soundEnabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        
        // Oscilador 1: Varredura de frequência alta
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(220, now);
        osc1.frequency.exponentialRampToValueAtTime(750, now + 0.22);
        gain1.gain.setValueAtTime(0.2, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.25);

        // Oscilador 2: Brilho tecnológico
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(440, now);
        osc2.frequency.exponentialRampToValueAtTime(1100, now + 0.2);
        gain2.gain.setValueAtTime(0.12, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start(now);
        osc2.stop(now + 0.23);
    }

    // Coleta de moeda (duas notas cristalinas B5 -> E6)
    playCoin() {
        if (!this.soundEnabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now); // Nota B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // Nota E6

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.setValueAtTime(0.22, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.45);
    }

    // Item Especial SENAI coletado (Fanfarra Triunfal Arpeggiada)
    playSenaiPowerUp() {
        if (!this.soundEnabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
        const noteDuration = 0.07;

        notes.forEach((freq, index) => {
            const start = now + index * noteDuration;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = index % 2 === 0 ? 'triangle' : 'square';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.22, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + noteDuration * 1.5);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + noteDuration * 1.6);
        });
    }

    // Pisar no inimigo (Stomp clássico)
    playStomp() {
        if (!this.soundEnabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    // Inimigo derrotado com Poder SENAI (Impacto poderoso)
    playEnemyExplode() {
        if (!this.soundEnabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        
        // Impacto baixo
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.26);

        // Ruído elétrico
        const bufferSize = this.ctx.sampleRate * 0.15;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(1000, now);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.2, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noise.start(now);
    }

    // Bater no bloco de baixo pra cima
    playBlockBump() {
        if (!this.soundEnabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.13);
    }

    // Quebrar bloco de tijolo
    playBlockBreak() {
        if (!this.soundEnabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.22);
    }

    // Levar dano
    playHurt() {
        if (!this.soundEnabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.linearRampToValueAtTime(120, now + 0.28);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.32);
    }

    // Game Over melodia clássica
    playGameOver() {
        if (!this.soundEnabled) return;
        this.init();
        if (!this.ctx) return;

        this.stopBGM();

        const notes = [
            { f: 261.63, d: 0.15 }, // C4
            { f: 220.00, d: 0.15 }, // A3
            { f: 196.00, d: 0.15 }, // G3
            { f: 164.81, d: 0.25 }, // E3
            { f: 146.83, d: 0.3  }, // D3
            { f: 130.81, d: 0.5  }  // C3
        ];

        let timeOffset = 0;
        notes.forEach(note => {
            const start = this.ctx.currentTime + timeOffset;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.f, start);

            gain.gain.setValueAtTime(0.25, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + note.d * 0.95);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + note.d);

            timeOffset += note.d;
        });
    }

    // Vitória no Mastro / Bandeira SENAI
    playVictory() {
        if (!this.soundEnabled) return;
        this.init();
        if (!this.ctx) return;

        this.stopBGM();

        const notes = [
            { f: 392.00, d: 0.12 }, // G4
            { f: 523.25, d: 0.12 }, // C5
            { f: 659.25, d: 0.12 }, // E5
            { f: 783.99, d: 0.12 }, // G5
            { f: 1046.50, d: 0.24 }, // C6
            { f: 880.00, d: 0.14 }, // A5
            { f: 1046.50, d: 0.45 }  // C6 grand finale
        ];

        let timeOffset = 0;
        notes.forEach(note => {
            const start = this.ctx.currentTime + timeOffset;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(note.f, start);

            gain.gain.setValueAtTime(0.2, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + note.d * 0.95);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + note.d);

            timeOffset += note.d;
        });
    }

    // Música de Fundo (BGM) Estilo Super Mario Chiptune Sequencer
    toggleBGM() {
        if (this.bgmPlaying) {
            this.stopBGM();
            this.bgmEnabled = false;
            return false;
        } else {
            this.bgmEnabled = true;
            this.startBGM();
            return true;
        }
    }

    startBGM() {
        if (!this.bgmEnabled || this.bgmPlaying) return;
        this.init();
        if (!this.ctx) return;

        this.bgmPlaying = true;
        this.currentStep = 0;

        // Sequência melódica clássica de aventura em 16 passos cíclicos
        const melody = [
            659.25, 659.25, 0, 659.25, 0, 523.25, 659.25, 0,
            783.99, 0, 0, 0, 392.00, 0, 0, 0,
            523.25, 0, 0, 392.00, 0, 0, 329.63, 0,
            0, 440.00, 0, 493.88, 0, 466.16, 440.00, 0
        ];

        const bass = [
            261.63, 0, 261.63, 0, 261.63, 0, 261.63, 0,
            196.00, 0, 196.00, 0, 196.00, 0, 196.00, 0,
            220.00, 0, 220.00, 0, 174.61, 0, 174.61, 0,
            196.00, 0, 196.00, 0, 261.63, 0, 261.63, 0
        ];

        const stepTime = 135; // ms por passo

        this.bgmTimer = setInterval(() => {
            if (!this.bgmPlaying || !this.ctx) return;

            const now = this.ctx.currentTime;
            const stepIdx = this.currentStep % melody.length;
            const freqM = melody[stepIdx];
            const freqB = bass[stepIdx];

            // Melodia principal
            if (freqM > 0) {
                const oscM = this.ctx.createOscillator();
                const gainM = this.ctx.createGain();
                oscM.type = 'square';
                oscM.frequency.setValueAtTime(freqM, now);
                gainM.gain.setValueAtTime(0.06, now);
                gainM.gain.exponentialRampToValueAtTime(0.001, now + (stepTime / 1000) * 0.85);
                oscM.connect(gainM);
                gainM.connect(this.ctx.destination);
                oscM.start(now);
                oscM.stop(now + (stepTime / 1000) * 0.9);
            }

            // Baixo
            if (freqB > 0) {
                const oscB = this.ctx.createOscillator();
                const gainB = this.ctx.createGain();
                oscB.type = 'triangle';
                oscB.frequency.setValueAtTime(freqB, now);
                gainB.gain.setValueAtTime(0.08, now);
                gainB.gain.exponentialRampToValueAtTime(0.001, now + (stepTime / 1000) * 0.9);
                oscB.connect(gainB);
                gainB.connect(this.ctx.destination);
                oscB.start(now);
                oscB.stop(now + (stepTime / 1000) * 0.95);
            }

            this.currentStep++;
        }, stepTime);
    }

    stopBGM() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearInterval(this.bgmTimer);
            this.bgmTimer = null;
        }
    }
}

// Instância global para todo o jogo
window.soundFX = new SoundFX();
