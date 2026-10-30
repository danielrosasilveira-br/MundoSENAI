/**
 * MISSÃO: MUNDO DAS REDES - GERENCIADOR DE ARMAZENAMENTO LOCAL
 * Persistência segura em localStorage com suporte a fallback em memória.
 */

const STORAGE_KEY = 'missao_mundo_redes_v1';

// Estado padrão versionado
const DEFAULT_STATE = {
  version: 1,
  soundEnabled: false,
  missions: {
    missao1: false,  // Bairro Conectado (O que são redes)
    missao2: false,  // Centro de Internet (Grande rede mundial)
    lab: false       // Laboratório de Redes
  },
  quiz: {
    lastScore: null,
    bestScore: null,
    correctCount: 0,
    totalQuestions: 5
  }
};

// Fallback caso localStorage esteja desativado ou em modo anônimo restrito
let memoryStorage = null;

const StorageManager = {
  /**
   * Verifica se o localStorage está funcional
   */
  isAvailable() {
    try {
      const test = '__storage_test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Obtém todo o estado do jogo
   */
  getData() {
    if (this.isAvailable()) {
      try {
        const item = window.localStorage.getItem(STORAGE_KEY);
        if (!item) {
          this.saveData(DEFAULT_STATE);
          return { ...DEFAULT_STATE };
        }
        const parsed = JSON.parse(item);
        if (!parsed || parsed.version !== DEFAULT_STATE.version) {
          // Migração simples ou reset seguro
          const merged = { ...DEFAULT_STATE, ...parsed, version: DEFAULT_STATE.version };
          this.saveData(merged);
          return merged;
        }
        return parsed;
      } catch (err) {
        console.warn('Erro ao ler localStorage, utilizando padrão:', err);
        return { ...DEFAULT_STATE };
      }
    } else {
      if (!memoryStorage) {
        memoryStorage = { ...DEFAULT_STATE };
      }
      return memoryStorage;
    }
  },

  /**
   * Salva o estado do jogo
   */
  saveData(data) {
    if (this.isAvailable()) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (err) {
        console.warn('Erro ao salvar no localStorage:', err);
      }
    } else {
      memoryStorage = { ...data };
    }
  },

  /**
   * Verifica se uma missão foi concluída
   */
  isMissionCompleted(missionId) {
    const data = this.getData();
    return Boolean(data.missions && data.missions[missionId]);
  },

  /**
   * Marca uma missão como concluída
   */
  completeMission(missionId) {
    const data = this.getData();
    if (!data.missions) {
      data.missions = { ...DEFAULT_STATE.missions };
    }
    data.missions[missionId] = true;
    this.saveData(data);
    window.dispatchEvent(new CustomEvent('gamestate:updated', { detail: data }));
    return data;
  },

  /**
   * Salva o resultado do questionário
   */
  saveQuizResult(score, correctCount) {
    const data = this.getData();
    if (!data.quiz) {
      data.quiz = { ...DEFAULT_STATE.quiz };
    }
    data.quiz.lastScore = score;
    data.quiz.correctCount = correctCount;
    if (data.quiz.bestScore === null || score > data.quiz.bestScore) {
      data.quiz.bestScore = score;
    }
    this.saveData(data);
    window.dispatchEvent(new CustomEvent('gamestate:updated', { detail: data }));
    return data;
  },

  /**
   * Obtém a preferência de áudio
   */
  getSoundPreference() {
    const data = this.getData();
    return Boolean(data.soundEnabled);
  },

  /**
   * Atualiza a preferência de áudio
   */
  setSoundPreference(enabled) {
    const data = this.getData();
    data.soundEnabled = Boolean(enabled);
    this.saveData(data);
    return data.soundEnabled;
  },

  /**
   * Reinicia todo o progresso (após confirmação)
   */
  resetProgress() {
    const soundPref = this.getSoundPreference(); // preserva som se configurado
    const freshState = {
      ...DEFAULT_STATE,
      soundEnabled: soundPref
    };
    this.saveData(freshState);
    window.dispatchEvent(new CustomEvent('gamestate:reset'));
    return freshState;
  }
};

window.StorageManager = StorageManager;
