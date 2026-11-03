/**
 * ==============================================================================
 * MUNDO SENAI - SERVIÇO DE DADOS FIREBASE
 * ==============================================================================
 * Gerenciamento de gravação e leitura em tempo real no Realtime Database,
 * compatível universalmente com protocolos file:// e http://.
 */

// Variáveis para instâncias do Firebase
let firebaseApp = null;
let realtimeDb = null;
let databaseModules = null;

// Chave para armazenamento local de contingência/demonstração
const CHAVE_STORAGE_LOCAL = 'mundo_senai_avaliacoes_local';

/**
 * Dados iniciais de demonstração (baseados no database-schema.json)
 */
const AVALIACOES_SEMENTE = {
  "-O_ExemploAvaliacao01": {
    "dataCadastro": Date.now() - 3600000 * 24,
    "pontuacaoTotal": 25,
    "pontuacaoMaxima": 27,
    "percentual": 92.59,
    "classificacao": "Protagonista Digital",
    "respostas": {
      "pergunta01": { "alternativa": "D", "pontuacao": 3 },
      "pergunta02": { "alternativa": "D", "pontuacao": 3 },
      "pergunta03": { "alternativa": "D", "pontuacao": 3 },
      "pergunta04": { "alternativa": "D", "pontuacao": 3 },
      "pergunta05": { "alternativa": "C", "pontuacao": 2 },
      "pergunta06": { "alternativa": "D", "pontuacao": 3 },
      "pergunta07": { "alternativa": "C", "pontuacao": 2 },
      "pergunta08": { "alternativa": "D", "pontuacao": 3 },
      "pergunta09": { "alternativa": "D", "pontuacao": 3 }
    },
    "interesseProfissional": {
      "alternativa": "I",
      "curso": "Tecnologia da Informação"
    }
  },
  "-O_ExemploAvaliacao02": {
    "dataCadastro": Date.now() - 3600000 * 18,
    "pontuacaoTotal": 18,
    "pontuacaoMaxima": 27,
    "percentual": 66.67,
    "classificacao": "Usuário Digital Conectado",
    "respostas": {
      "pergunta01": { "alternativa": "C", "pontuacao": 2 },
      "pergunta02": { "alternativa": "C", "pontuacao": 2 },
      "pergunta03": { "alternativa": "C", "pontuacao": 2 },
      "pergunta04": { "alternativa": "B", "pontuacao": 1 },
      "pergunta05": { "alternativa": "C", "pontuacao": 2 },
      "pergunta06": { "alternativa": "C", "pontuacao": 2 },
      "pergunta07": { "alternativa": "C", "pontuacao": 2 },
      "pergunta08": { "alternativa": "C", "pontuacao": 2 },
      "pergunta09": { "alternativa": "D", "pontuacao": 3 }
    },
    "interesseProfissional": {
      "alternativa": "C",
      "curso": "Eletroeletrônica"
    }
  },
  "-O_ExemploAvaliacao03": {
    "dataCadastro": Date.now() - 3600000 * 12,
    "pontuacaoTotal": 11,
    "pontuacaoMaxima": 27,
    "percentual": 40.74,
    "classificacao": "Usuário Digital em Desenvolvimento",
    "respostas": {
      "pergunta01": { "alternativa": "B", "pontuacao": 1 },
      "pergunta02": { "alternativa": "B", "pontuacao": 1 },
      "pergunta03": { "alternativa": "B", "pontuacao": 1 },
      "pergunta04": { "alternativa": "A", "pontuacao": 0 },
      "pergunta05": { "alternativa": "B", "pontuacao": 1 },
      "pergunta06": { "alternativa": "C", "pontuacao": 2 },
      "pergunta07": { "alternativa": "B", "pontuacao": 1 },
      "pergunta08": { "alternativa": "C", "pontuacao": 2 },
      "pergunta09": { "alternativa": "C", "pontuacao": 2 }
    },
    "interesseProfissional": {
      "alternativa": "G",
      "curso": "Metalmecânica"
    }
  },
  "-O_ExemploAvaliacao04": {
    "dataCadastro": Date.now() - 3600000 * 6,
    "pontuacaoTotal": 5,
    "pontuacaoMaxima": 27,
    "percentual": 18.52,
    "classificacao": "Explorador Digital Inicial",
    "respostas": {
      "pergunta01": { "alternativa": "A", "pontuacao": 0 },
      "pergunta02": { "alternativa": "B", "pontuacao": 1 },
      "pergunta03": { "alternativa": "A", "pontuacao": 0 },
      "pergunta04": { "alternativa": "A", "pontuacao": 0 },
      "pergunta05": { "alternativa": "A", "pontuacao": 0 },
      "pergunta06": { "alternativa": "B", "pontuacao": 1 },
      "pergunta07": { "alternativa": "A", "pontuacao": 0 },
      "pergunta08": { "alternativa": "B", "pontuacao": 1 },
      "pergunta09": { "alternativa": "C", "pontuacao": 2 }
    },
    "interesseProfissional": {
      "alternativa": "B",
      "curso": "Construção Civil"
    }
  },
  "-O_ExemploAvaliacao05": {
    "dataCadastro": Date.now() - 3600000 * 2,
    "pontuacaoTotal": 27,
    "pontuacaoMaxima": 27,
    "percentual": 100.0,
    "classificacao": "Protagonista Digital",
    "respostas": {
      "pergunta01": { "alternativa": "D", "pontuacao": 3 },
      "pergunta02": { "alternativa": "D", "pontuacao": 3 },
      "pergunta03": { "alternativa": "D", "pontuacao": 3 },
      "pergunta04": { "alternativa": "D", "pontuacao": 3 },
      "pergunta05": { "alternativa": "D", "pontuacao": 3 },
      "pergunta06": { "alternativa": "D", "pontuacao": 3 },
      "pergunta07": { "alternativa": "D", "pontuacao": 3 },
      "pergunta08": { "alternativa": "D", "pontuacao": 3 },
      "pergunta09": { "alternativa": "D", "pontuacao": 3 }
    },
    "interesseProfissional": {
      "alternativa": "I",
      "curso": "Tecnologia da Informação"
    }
  }
};

/**
 * Inicializa a conexão com o Firebase Realtime Database
 */
async function inicializarFirebase() {
  if (realtimeDb) {
    return { db: realtimeDb, isMock: false };
  }

  const estaConfigurado = typeof isFirebaseConfigured === 'function' ? isFirebaseConfigured() : (window.isFirebaseConfigured ? window.isFirebaseConfigured() : false);
  const cfg = window.firebaseConfig || (typeof firebaseConfig !== 'undefined' ? firebaseConfig : null);

  // Se executando via file:// ou sem credenciais reais, utiliza modo local demonstrativo
  if (!estaConfigurado || !cfg || (typeof window !== 'undefined' && window.location.protocol === 'file:')) {
    console.warn("[FirebaseService] Modo Demonstração Ativo (Local Storage).");
    inicializarStorageLocal();
    return { db: null, isMock: true };
  }

  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
    const { getDatabase, ref, push, set, serverTimestamp, onValue } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js');

    firebaseApp = initializeApp(cfg);
    realtimeDb = getDatabase(firebaseApp);
    databaseModules = { ref, push, set, serverTimestamp, onValue };

    console.log("[FirebaseService] Conectado ao Firebase Realtime Database:", cfg.projectId);
    return { db: realtimeDb, isMock: false };
  } catch (erro) {
    console.error("[FirebaseService] Falha ao conectar ao Firebase (utilizando modo local):", erro);
    inicializarStorageLocal();
    return { db: null, isMock: true, erro };
  }
}

/**
 * Inicializa o armazenamento local caso o banco esteja no modo de demonstração
 */
function inicializarStorageLocal() {
  if (typeof localStorage === 'undefined') return;
  const dados = localStorage.getItem(CHAVE_STORAGE_LOCAL);
  if (!dados) {
    localStorage.setItem(CHAVE_STORAGE_LOCAL, JSON.stringify(AVALIACOES_SEMENTE));
  }
}

/**
 * Registra uma nova avaliação no Firebase Realtime Database
 * @param {Object} dadosAvaliacao - Objeto contendo os dados calculados e respostas
 * @returns {Promise<{sucesso: boolean, id?: string, mensagem?: string}>}
 */
async function salvarAvaliacao(dadosAvaliacao) {
  try {
    const { db, isMock } = await inicializarFirebase();

    if (!dadosAvaliacao || typeof dadosAvaliacao.pontuacaoTotal !== 'number') {
      throw new Error("Dados de avaliação inválidos ou incompletos.");
    }

    if (isMock || !db) {
      const idGerado = '-O_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      const registroFinal = {
        ...dadosAvaliacao,
        dataCadastro: Date.now()
      };

      if (typeof localStorage !== 'undefined') {
        const baseAtual = JSON.parse(localStorage.getItem(CHAVE_STORAGE_LOCAL) || '{}');
        baseAtual[idGerado] = registroFinal;
        localStorage.setItem(CHAVE_STORAGE_LOCAL, JSON.stringify(baseAtual));
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('mundoSenaiAvaliacaoSalva', { detail: { id: idGerado, avaliacao: registroFinal } }));
      }

      return {
        sucesso: true,
        id: idGerado,
        modo: 'local',
        mensagem: "Avaliação registrada com sucesso no modo local."
      };
    }

    // Gravação no Firebase Realtime Database
    const { ref, push, set, serverTimestamp } = databaseModules;
    const avaliacoesRef = ref(db, 'avaliacoes');
    const novaRef = push(avaliacoesRef);

    const payload = {
      ...dadosAvaliacao,
      dataCadastro: serverTimestamp()
    };

    await set(novaRef, payload);

    return {
      sucesso: true,
      id: novaRef.key,
      modo: 'firebase',
      mensagem: "Avaliação salva com sucesso no Firebase Realtime Database."
    };
  } catch (erro) {
    console.error("[FirebaseService] Erro ao salvar avaliação:", erro);
    return {
      sucesso: false,
      mensagem: erro.message || "Erro ao salvar avaliação."
    };
  }
}

/**
 * Escuta avaliações em tempo real usando onValue()
 * @param {Function} callbackSucesso
 * @param {Function} callbackStatus
 * @returns {Promise<Function>}
 */
async function observarAvaliacoes(callbackSucesso, callbackStatus = () => {}) {
  try {
    callbackStatus('atualizando');
    const { db, isMock } = await inicializarFirebase();

    if (isMock || !db) {
      callbackStatus('conectado-local');
      
      const dispararLeituraLocal = () => {
        if (typeof localStorage === 'undefined') {
          callbackSucesso(AVALIACOES_SEMENTE);
          return;
        }
        const dados = JSON.parse(localStorage.getItem(CHAVE_STORAGE_LOCAL) || '{}');
        callbackSucesso(dados);
      };

      dispararLeituraLocal();

      if (typeof window !== 'undefined') {
        const tratadorCustom = () => dispararLeituraLocal();
        const tratadorStorage = (e) => {
          if (e.key === CHAVE_STORAGE_LOCAL) dispararLeituraLocal();
        };

        window.addEventListener('mundoSenaiAvaliacaoSalva', tratadorCustom);
        window.addEventListener('storage', tratadorStorage);

        return () => {
          window.removeEventListener('mundoSenaiAvaliacaoSalva', tratadorCustom);
          window.removeEventListener('storage', tratadorStorage);
        };
      }
      return () => {};
    }

    const { ref, onValue } = databaseModules;
    const avaliacoesRef = ref(db, 'avaliacoes');
    const connectedRef = ref(db, '.info/connected');

    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        callbackStatus('conectado');
      } else {
        callbackStatus('desconectado');
      }
    });

    const unsubscribe = onValue(
      avaliacoesRef,
      (snapshot) => {
        callbackStatus('conectado');
        const dados = snapshot.val() || {};
        callbackSucesso(dados);
      },
      (erro) => {
        console.error("[FirebaseService] Erro ao escutar dados:", erro);
        callbackStatus('desconectado');
      }
    );

    return unsubscribe;
  } catch (erro) {
    console.error("[FirebaseService] Falha ao configurar observador:", erro);
    callbackStatus('desconectado');
    return () => {};
  }
}

// Exportação global para navegadores
if (typeof window !== 'undefined') {
  window.FirebaseService = {
    inicializarFirebase,
    salvarAvaliacao,
    observarAvaliacoes
  };
  window.salvarAvaliacao = salvarAvaliacao;
  window.observarAvaliacoes = observarAvaliacoes;
}

// Compatibilidade Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { inicializarFirebase, salvarAvaliacao, observarAvaliacoes, AVALIACOES_SEMENTE };
}
