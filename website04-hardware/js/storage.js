/**
 * ===================================================================
 * MISSÃO HARDWARE — AVENTURA DENTRO DO COMPUTADOR
 * js/storage.js — Camada Segura de Persistência Local (LocalStorage)
 * ===================================================================
 */

const STORAGE_KEYS = {
  VISITED_MODULES: 'missao_hardware_visited',
  STARS: 'missao_hardware_stars',
  BEST_QUIZ_SCORE: 'missao_hardware_quiz_best',
  QUIZ_ATTEMPTS: 'missao_hardware_quiz_attempts',
  LAST_QUIZ_RESULT: 'missao_hardware_quiz_last',
  ASSEMBLY_STATE: 'missao_hardware_assembly',
  SOUND_ENABLED: 'missao_hardware_sound_enabled',
  SOUND_VOLUME: 'missao_hardware_sound_volume'
};

const StorageService = {
  isAvailable() {
    try {
      const testKey = '__test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('LocalStorage indisponível. Usando armazenamento em memória temporária.');
      return false;
    }
  },

  memoryFallback: {},

  get(key, defaultValue = null) {
    if (this.isAvailable()) {
      try {
        const item = window.localStorage.getItem(key);
        return item !== null ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.error(`Erro ao ler chave ${key}:`, e);
        return defaultValue;
      }
    }
    return this.memoryFallback[key] !== undefined ? this.memoryFallback[key] : defaultValue;
  },

  set(key, value) {
    if (this.isAvailable()) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error(`Erro ao salvar chave ${key}:`, e);
      }
    }
    this.memoryFallback[key] = value;
    return true;
  },

  /* Módulos Visitados */
  getVisitedModules() {
    return this.get(STORAGE_KEYS.VISITED_MODULES, []);
  },

  markModuleVisited(moduleId) {
    const visited = this.getVisitedModules();
    if (!visited.includes(moduleId)) {
      visited.push(moduleId);
      this.set(STORAGE_KEYS.VISITED_MODULES, visited);
      this.addStar(`visit_${moduleId}`);
      return true;
    }
    return false;
  },

  /* Estrelas de Conquista */
  getStars() {
    return this.get(STORAGE_KEYS.STARS, []);
  },

  addStar(starId) {
    const stars = this.getStars();
    if (!stars.includes(starId)) {
      stars.push(starId);
      this.set(STORAGE_KEYS.STARS, stars);
      return true;
    }
    return false;
  },

  /* Quiz e Pontuação */
  getBestQuizScore() {
    return this.get(STORAGE_KEYS.BEST_QUIZ_SCORE, 0);
  },

  getQuizAttempts() {
    return this.get(STORAGE_KEYS.QUIZ_ATTEMPTS, 0);
  },

  getLastQuizResult() {
    return this.get(STORAGE_KEYS.LAST_QUIZ_RESULT, null);
  },

  saveQuizResult(score, correctCount, totalQuestions = 5) {
    const currentBest = this.getBestQuizScore();
    const newBest = Math.max(currentBest, score);
    this.set(STORAGE_KEYS.BEST_QUIZ_SCORE, newBest);

    const attempts = this.getQuizAttempts() + 1;
    this.set(STORAGE_KEYS.QUIZ_ATTEMPTS, attempts);

    const resultData = {
      score,
      correctCount,
      totalQuestions,
      timestamp: Date.now()
    };
    this.set(STORAGE_KEYS.LAST_QUIZ_RESULT, resultData);

    if (score >= 8) {
      this.addStar('quiz_master');
    } else if (score >= 6) {
      this.addStar('quiz_cleared');
    }

    return { newBest, attempts };
  },

  /* Montagem Virtual */
  getAssemblyState() {
    return this.get(STORAGE_KEYS.ASSEMBLY_STATE, {
      stage1Complete: false,
      stage2Complete: false,
      placedParts: []
    });
  },

  saveAssemblyState(state) {
    this.set(STORAGE_KEYS.ASSEMBLY_STATE, state);
    if (state.stage1Complete && state.stage2Complete) {
      this.addStar('assembly_complete');
    }
  },

  /* Sons */
  getSoundSettings() {
    return {
      enabled: this.get(STORAGE_KEYS.SOUND_ENABLED, false), // Desativado por padrão conforme Seção 19
      volume: this.get(STORAGE_KEYS.SOUND_VOLUME, 0.5)
    };
  },

  saveSoundSettings(enabled, volume) {
    this.set(STORAGE_KEYS.SOUND_ENABLED, enabled);
    this.set(STORAGE_KEYS.SOUND_VOLUME, volume);
  },

  /* Reiniciar Progresso */
  resetAll() {
    const sound = this.getSoundSettings(); // Preserva preferências de áudio se desejado
    if (this.isAvailable()) {
      window.localStorage.removeItem(STORAGE_KEYS.VISITED_MODULES);
      window.localStorage.removeItem(STORAGE_KEYS.STARS);
      window.localStorage.removeItem(STORAGE_KEYS.BEST_QUIZ_SCORE);
      window.localStorage.removeItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
      window.localStorage.removeItem(STORAGE_KEYS.LAST_QUIZ_RESULT);
      window.localStorage.removeItem(STORAGE_KEYS.ASSEMBLY_STATE);
    }
    this.memoryFallback = {};
    this.saveSoundSettings(sound.enabled, sound.volume);
    return true;
  }
};

window.StorageService = StorageService;

