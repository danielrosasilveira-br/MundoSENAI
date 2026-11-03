/**
 * ==============================================================================
 * MUNDO SENAI - AUTENTICAÇÃO ADMINISTRATIVA (FIREBASE AUTH)
 * ==============================================================================
 * Gerenciamento de sessão de administradores via Firebase Authentication,
 * compatível universalmente com protocolos file:// e http://.
 */

let authInstance = null;
let authModules = null;
const CHAVE_AUTH_DEMO = 'mundo_senai_admin_demo';

/**
 * Inicializa o módulo de autenticação do Firebase
 */
async function inicializarAuth(aoMudarEstado = () => {}) {
  const estaConfigurado = typeof isFirebaseConfigured === 'function' ? isFirebaseConfigured() : (window.isFirebaseConfigured ? window.isFirebaseConfigured() : false);
  const cfg = window.firebaseConfig || (typeof firebaseConfig !== 'undefined' ? firebaseConfig : null);

  // Se executando via file:// ou sem credenciais reais configuradas
  if (!estaConfigurado || !cfg || (typeof window !== 'undefined' && window.location.protocol === 'file:')) {
    console.info("[Auth] Modo Demonstração: Firebase Auth emulando sessão local.");
    if (typeof localStorage !== 'undefined') {
      const sessaoLocal = localStorage.getItem(CHAVE_AUTH_DEMO);
      if (sessaoLocal) {
        try {
          const usuarioDemo = JSON.parse(sessaoLocal);
          aoMudarEstado(usuarioDemo);
          return { isMock: true, usuario: usuarioDemo };
        } catch (e) {
          localStorage.removeItem(CHAVE_AUTH_DEMO);
        }
      }
    }
    aoMudarEstado(null);
    return { isMock: true, usuario: null };
  }

  try {
    const { initializeApp, getApps, getApp } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
    const { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js');

    const app = getApps().length > 0 ? getApp() : initializeApp(cfg);
    authInstance = getAuth(app);
    authModules = { signInWithEmailAndPassword, signOut, onAuthStateChanged };

    onAuthStateChanged(authInstance, (user) => {
      aoMudarEstado(user);
    });

    return { isMock: false, auth: authInstance };
  } catch (erro) {
    console.error("[Auth] Erro ao inicializar Firebase Auth:", erro);
    aoMudarEstado(null);
    return { isMock: true, erro };
  }
}

/**
 * Realiza autenticação com e-mail e senha
 * @param {string} email 
 * @param {string} senha 
 * @returns {Promise<{sucesso: boolean, usuario?: Object, mensagem?: string}>}
 */
async function fazerLogin(email, senha) {
  if (!email || !senha) {
    return { sucesso: false, mensagem: "Informe e-mail e senha para acessar o painel." };
  }

  const estaConfigurado = typeof isFirebaseConfigured === 'function' ? isFirebaseConfigured() : (window.isFirebaseConfigured ? window.isFirebaseConfigured() : false);

  if (!estaConfigurado || !authInstance || (typeof window !== 'undefined' && window.location.protocol === 'file:')) {
    if (senha.length >= 6) {
      const usuarioDemo = {
        email: email,
        uid: 'admin-demo-' + btoa(unescape(encodeURIComponent(email))).substring(0, 8),
        displayName: 'Administrador Mundo SENAI'
      };
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CHAVE_AUTH_DEMO, JSON.stringify(usuarioDemo));
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('mundoSenaiAuthChange', { detail: usuarioDemo }));
      }
      return {
        sucesso: true,
        usuario: usuarioDemo,
        mensagem: "Login administrativo realizado com sucesso (Modo Demonstração)."
      };
    } else {
      return { sucesso: false, mensagem: "A senha deve conter no mínimo 6 caracteres." };
    }
  }

  try {
    const { signInWithEmailAndPassword } = authModules;
    const userCredential = await signInWithEmailAndPassword(authInstance, email, senha);
    return {
      sucesso: true,
      usuario: userCredential.user,
      mensagem: "Autenticação realizada com sucesso no Firebase."
    };
  } catch (erro) {
    console.error("[Auth] Falha no login:", erro);
    let mensagemAmigavel = "Erro ao autenticar. Verifique suas credenciais.";
    if (erro.code === 'auth/invalid-credential' || erro.code === 'auth/wrong-password' || erro.code === 'auth/user-not-found') {
      mensagemAmigavel = "E-mail ou senha inválidos. Tente novamente.";
    } else if (erro.code === 'auth/invalid-email') {
      mensagemAmigavel = "Formato de e-mail inválido.";
    } else if (erro.code === 'auth/too-many-requests') {
      mensagemAmigavel = "Muitas tentativas com falha. Aguarde alguns minutos.";
    }
    return { sucesso: false, mensagem: mensagemAmigavel, erro };
  }
}

/**
 * Encerra a sessão administrativa atual
 */
async function fazerLogout() {
  const estaConfigurado = typeof isFirebaseConfigured === 'function' ? isFirebaseConfigured() : (window.isFirebaseConfigured ? window.isFirebaseConfigured() : false);

  if (!estaConfigurado || !authInstance || (typeof window !== 'undefined' && window.location.protocol === 'file:')) {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(CHAVE_AUTH_DEMO);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mundoSenaiAuthChange', { detail: null }));
    }
    return { sucesso: true };
  }

  try {
    const { signOut } = authModules;
    await signOut(authInstance);
    return { sucesso: true };
  } catch (erro) {
    console.error("[Auth] Falha ao encerrar sessão:", erro);
    return { sucesso: false, mensagem: erro.message };
  }
}

/**
 * Retorna o usuário logado atualmente (ou null)
 */
function obterUsuarioAtual() {
  const estaConfigurado = typeof isFirebaseConfigured === 'function' ? isFirebaseConfigured() : (window.isFirebaseConfigured ? window.isFirebaseConfigured() : false);

  if (!estaConfigurado || !authInstance || (typeof window !== 'undefined' && window.location.protocol === 'file:')) {
    if (typeof localStorage === 'undefined') return null;
    const demo = localStorage.getItem(CHAVE_AUTH_DEMO);
    return demo ? JSON.parse(demo) : null;
  }
  return authInstance.currentUser;
}

// Exportação global para navegadores
if (typeof window !== 'undefined') {
  window.AuthService = {
    inicializarAuth,
    fazerLogin,
    fazerLogout,
    obterUsuarioAtual
  };
  window.inicializarAuth = inicializarAuth;
  window.fazerLogin = fazerLogin;
  window.fazerLogout = fazerLogout;
  window.obterUsuarioAtual = obterUsuarioAtual;
}

// Compatibilidade Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    inicializarAuth,
    fazerLogin,
    fazerLogout,
    obterUsuarioAtual
  };
}
