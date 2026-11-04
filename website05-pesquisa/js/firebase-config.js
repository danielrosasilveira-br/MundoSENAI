/**
 * ==============================================================================
 * MUNDO SENAI - CONFIGURAÇÃO DO FIREBASE
 * ==============================================================================
 * Projeto: mundosenai-5638c
 * Tipo: Firebase Realtime Database
 * Endpoint: https://mundosenai-5638c-default-rtdb.firebaseio.com
 * 
 * As credenciais abaixo conectam diretamente ao projeto no Firebase.
 * Caso utilize autenticação por API Key, insira a chave do seu console abaixo.
 */

const firebaseConfig = {
  apiKey: "AIzaSyD-SUA_API_KEY_DO_CONSOLE_FIREBASE",
  authDomain: "mundosenai-5638c.firebaseapp.com",
  databaseURL: "https://mundosenai-5638c-default-rtdb.firebaseio.com",
  projectId: "mundosenai-5638c",
  storageBucket: "mundosenai-5638c.appspot.com",
  messagingSenderId: "360563800000",
  appId: "1:360563800000:web:abcdef123456"
};

/**
 * Verifica se a configuração básica do Firebase está presente
 * @returns {boolean}
 */
function isFirebaseConfigured() {
  return Boolean(firebaseConfig.databaseURL && firebaseConfig.projectId);
}

// Exportação global (garante funcionamento no protocolo file:// e http://)
if (typeof window !== 'undefined') {
  window.firebaseConfig = firebaseConfig;
  window.isFirebaseConfigured = isFirebaseConfigured;
}

// Compatibilidade com Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { firebaseConfig, isFirebaseConfigured };
}