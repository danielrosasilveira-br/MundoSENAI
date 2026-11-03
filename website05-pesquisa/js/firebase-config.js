/**
 * ==============================================================================
 * MUNDO SENAI - CONFIGURAÇÃO DO FIREBASE
 * ==============================================================================
 * Projeto: mundosenai-5638
 * Tipo: Firebase Realtime Database + Firebase Authentication
 * 
 * ATENÇÃO: Insira suas credenciais reais obtidas no Firebase Console
 * em Configurações do Projeto > Seus Aplicativos > Configuração do SDK.
 */

const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "mundosenai-5638.firebaseapp.com",
  databaseURL: "https://mundosenai-5638-default-rtdb.firebaseio.com",
  projectId: "mundosenai-5638",
  storageBucket: "mundosenai-5638.appspot.com",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

/**
 * Verifica se as credenciais foram substituídas pelas chaves reais
 * @returns {boolean}
 */
function isFirebaseConfigured() {
  return (
    Boolean(firebaseConfig.apiKey) &&
    firebaseConfig.apiKey !== "SUA_API_KEY_AQUI" &&
    !firebaseConfig.apiKey.includes("SUA_")
  );
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
