/**
 * MISSÃO: MUNDO DAS REDES - LÓGICA DAS MISSÕES 1 E 2
 * Explorador de dispositivos, simulador de pacotes, requisição web e desafios.
 */

// Dados pedagógicos dos equipamentos da Missão 1
const DEVICES_DATA = {
  pc1: {
    name: 'Computador Principal',
    type: 'Dispositivo Conectado (Desktop)',
    icon: `<svg viewBox="0 0 24 24"><path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>`,
    desc: 'Um computador de mesa que se conecta à rede por cabo ou Wi-Fi. Permite enviar estudos, fotos e documentos para outros computadores da casa ou da escola com máxima velocidade e estabilidade.'
  },
  notebook: {
    name: 'Notebook Sem Fio',
    type: 'Dispositivo Móvel',
    icon: `<svg viewBox="0 0 24 24"><path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>`,
    desc: 'Um computador portátil que utiliza ondas de rádio (Wi-Fi) para se comunicar com o roteador. Você pode levá-lo para qualquer cômodo sem precisar de fios conectados.'
  },
  smartphone: {
    name: 'Smartphone Inteligente',
    type: 'Dispositivo de Bolso',
    icon: `<svg viewBox="0 0 24 24"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>`,
    desc: 'Um telefone compacto com alta capacidade de conexão. Ele envia e recebe mensagens instantâneas, vídeos e jogos online usando a antena de Wi-Fi ou a rede celular.'
  },
  router: {
    name: 'Roteador Central',
    type: 'Equipamento de Conexão (Maestro da Rede)',
    icon: `<svg viewBox="0 0 24 24"><path d="M20.2 5.9l.8-.8C19.6 3.7 17.8 3 16 3s-3.6.7-5 2.1l.8.8C13 4.6 14.5 4 16 4s3 .6 4.2 1.9zm-1.6 1.6l.8-.8C18.4 5.7 17.2 5 16 5s-2.4.7-3.4 1.7l.8.8c.7-.7 1.6-1.5 2.6-1.5s1.9.8 2.6 1.5zM16 8c-1.1 0-2 .9-2 2 0 .7.4 1.4 1 1.7V17h2v-5.3c.6-.3 1-1 1-1.7 0-1.1-.9-2-2-2zM4 17h16c1.1 0 2 .9 2 2s-.9 2-2 2H4c-1.1 0-2-.9-2-2s.9-2 2-2z"/></svg>`,
    desc: 'O roteador é o coração da rede! Ele analisa os pacotes de dados enviados pelos computadores e celulares e encaminha cada mensagem exatamente para o destino certo, sem perder nada pelo caminho.'
  },
  pc2: {
    name: 'Computador do Laboratório',
    type: 'Dispositivo Conectado (Desktop)',
    icon: `<svg viewBox="0 0 24 24"><path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>`,
    desc: 'Um segundo computador conectado na mesma rede. Ele pode receber impressões, acessar pastas compartilhadas e trocar arquivos com o primeiro computador em frações de segundo.'
  }
};

/**
 * ==========================================================================
 * CONTROLE DA MISSÃO 1: REDES LOCAIS
 * ==========================================================================
 */
const Mission1Controller = {
  init() {
    this.bindDeviceCards();
    this.bindPacketSimulator();
    this.bindChallenge();
    this.checkInitialStatus();
  },

  checkInitialStatus() {
    if (window.StorageManager && window.StorageManager.isMissionCompleted('missao1')) {
      const banner = document.getElementById('mission1SuccessBanner');
      if (banner) banner.classList.add('show');
    }
  },

  bindDeviceCards() {
    const cards = document.querySelectorAll('.device-card-btn');
    const detailBox = document.getElementById('deviceDetailBox');
    if (!cards.length || !detailBox) return;

    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const deviceKey = card.getAttribute('data-device');
        const data = DEVICES_DATA[deviceKey];
        if (!data) return;

        detailBox.innerHTML = `
          <div class="device-detail-badge-icon">${data.icon}</div>
          <div class="device-detail-content">
            <h4>${data.name} — <span style="font-size: 0.85rem; color: #94a3b8;">${data.type}</span></h4>
            <p>${data.desc}</p>
          </div>
        `;
      });
    });
  },

  bindPacketSimulator() {
    const btnSend = document.getElementById('btnSendPacket');
    const originSelect = document.getElementById('simOrigin');
    const destSelect = document.getElementById('simDest');
    const packetTypeSelect = document.getElementById('simPacketType');
    const feedbackBox = document.getElementById('simFeedback');
    const packetToken = document.getElementById('dataPacketToken');
    const visualArena = document.getElementById('simArena');

    if (!btnSend || !originSelect || !destSelect || !feedbackBox) return;

    btnSend.addEventListener('click', () => {
      const origin = originSelect.value;
      const dest = destSelect.value;
      const packetContent = packetTypeSelect.options[packetTypeSelect.selectedIndex].text;

      if (origin === dest) {
        feedbackBox.innerHTML = `
          <span class="sim-status-icon" style="color: var(--warning);">⚠️</span>
          <span>Escolha um dispositivo de destino diferente do dispositivo de origem para transmitir na rede!</span>
        `;
        if (window.soundSystem) window.soundSystem.playWrong();
        return;
      }

      btnSend.disabled = true;
      if (window.soundSystem) window.soundSystem.playPacketSend();

      const originLabel = originSelect.options[originSelect.selectedIndex].text;
      const destLabel = destSelect.options[destSelect.selectedIndex].text;

      feedbackBox.innerHTML = `
        <span class="sim-status-icon">🚀</span>
        <span>Enviando pacote: <strong>"${packetContent}"</strong> de <em>${originLabel}</em> para o Roteador...</span>
      `;

      // Posiciona e anima o pacote de dados
      if (packetToken && visualArena) {
        packetToken.classList.add('active');
        packetToken.style.left = '20%';
        packetToken.style.top = '50%';

        // Passo 1: Vai até o Roteador (centro)
        setTimeout(() => {
          packetToken.style.left = '50%';
          packetToken.style.top = '50%';
          feedbackBox.innerHTML = `
            <span class="sim-status-icon">⚙️</span>
            <span>O Roteador Central leu o endereço e está roteando para <em>${destLabel}</em>...</span>
          `;
        }, 800);

        // Passo 2: Vai até o Destino
        setTimeout(() => {
          packetToken.style.left = '80%';
          packetToken.style.top = '50%';
          feedbackBox.innerHTML = `
            <span class="sim-status-icon" style="color: var(--success);">✅</span>
            <span>Sucesso! <em>${destLabel}</em> recebeu o pacote <strong>"${packetContent}"</strong> sem erros!</span>
          `;
          if (window.soundSystem) window.soundSystem.playCorrect();
        }, 1600);

        // Reset da animação
        setTimeout(() => {
          packetToken.classList.remove('active');
          btnSend.disabled = false;
        }, 2400);
      } else {
        btnSend.disabled = false;
      }
    });
  },

  bindChallenge() {
    const options = document.querySelectorAll('#mission1Options .challenge-option-btn');
    const feedback = document.getElementById('mission1Feedback');
    const successBanner = document.getElementById('mission1SuccessBanner');
    if (!options.length || !feedback) return;

    options.forEach(btn => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.getAttribute('data-correct') === 'true';

        options.forEach(b => {
          b.disabled = true;
          if (b.getAttribute('data-correct') === 'true') {
            b.classList.add('state-correct');
          }
        });

        feedback.classList.remove('success', 'error');
        feedback.classList.add('show');

        if (isCorrect) {
          btn.classList.add('state-correct');
          feedback.classList.add('success');
          feedback.innerHTML = `
            <strong>🎉 Resposta Perfeita!</strong><br>
            Exatamente isso! Uma rede de computadores existe para que múltiplos aparelhos conversem entre si, trocando dados, informações e compartilhando recursos como impressoras e internet.
          `;

          if (window.soundSystem) window.soundSystem.playCorrect();

          // Salva no armazenamento
          if (window.StorageManager) {
            window.StorageManager.completeMission('missao1');
          }

          setTimeout(() => {
            if (successBanner) successBanner.classList.add('show');
            if (window.soundSystem) window.soundSystem.playMissionComplete();
          }, 800);
        } else {
          btn.classList.add('state-wrong');
          feedback.classList.add('error');
          feedback.innerHTML = `
            <strong>💡 Quase lá! Veja a explicação:</strong><br>
            A resposta correta é a alternativa B. Uma rede conecta dispositivos (como computadores, celulares e tablets) exatamente para compartilhar dados e arquivos entre eles.
          `;
          if (window.soundSystem) window.soundSystem.playWrong();

          // Mesmo com reforço, após revisar o aluno pode prosseguir
          if (window.StorageManager) {
            window.StorageManager.completeMission('missao1');
          }
          setTimeout(() => {
            if (successBanner) successBanner.classList.add('show');
          }, 1200);
        }
      });
    });
  }
};

/**
 * ==========================================================================
 * CONTROLE DA MISSÃO 2: A GRANDE REDE MUNDIAL (INTERNET)
 * ==========================================================================
 */
const WEB_STEPS = [
  {
    step: 1,
    title: '1. O Pedido do Usuário',
    desc: 'Você abre o navegador no celular ou computador e digita o endereço de um site de estudos para pesquisar.',
    icon: `<svg viewBox="0 0 24 24"><path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>`
  },
  {
    step: 2,
    title: '2. Empacotando em Dados',
    desc: 'O seu dispositivo transforma o seu pedido em pequenos "pacotes de dados", etiquetados com o endereço do servidor que tem o site.',
    icon: `<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg>`
  },
  {
    step: 3,
    title: '3. Cruzando a Grande Internet',
    desc: 'Os pacotes saem do seu roteador, passam pelo seu provedor e viajam velozmente por cabos submarinos, satélites e fibra óptica pelo mundo!',
    icon: `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`
  },
  {
    step: 4,
    title: '4. O Servidor Encontra os Dados',
    desc: 'O computador servidor onde o site está guardado recebe seus pacotes, lê a solicitação e separa o texto, imagens e vídeos necessários.',
    icon: `<svg viewBox="0 0 24 24"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z"/></svg>`
  },
  {
    step: 5,
    title: '5. O Site Aparece na Sua Tela!',
    desc: 'O servidor despacha as respostas de volta para você. O seu navegador monta as imagens e o texto na tela em menos de 1 segundo!',
    icon: `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`
  }
];

const Mission2Controller = {
  currentStepIndex: 0,
  isPlaying: false,
  timer: null,

  init() {
    this.bindTimeline();
    this.bindChallenge();
    this.renderStep(0);
    this.checkInitialStatus();
  },

  checkInitialStatus() {
    if (window.StorageManager && window.StorageManager.isMissionCompleted('missao2')) {
      const banner = document.getElementById('mission2SuccessBanner');
      if (banner) banner.classList.add('show');
    }
  },

  renderStep(index) {
    this.currentStepIndex = index;
    const stepData = WEB_STEPS[index];
    const displayCard = document.getElementById('stepDisplayCard');
    const nodes = document.querySelectorAll('.step-tracker-node');

    if (displayCard && stepData) {
      displayCard.innerHTML = `
        <div class="step-display-icon-box">${stepData.icon}</div>
        <div class="step-display-info">
          <h3>${stepData.title}</h3>
          <p>${stepData.desc}</p>
        </div>
      `;
    }

    nodes.forEach((node, i) => {
      node.classList.remove('active', 'completed');
      if (i === index) {
        node.classList.add('active');
      } else if (i < index) {
        node.classList.add('completed');
      }
    });

    if (window.soundSystem && this.isPlaying) {
      window.soundSystem.playPacketSend();
    }
  },

  bindTimeline() {
    const btnPlay = document.getElementById('btnPlayTimeline');
    const btnPause = document.getElementById('btnPauseTimeline');
    const btnReset = document.getElementById('btnResetTimeline');
    const nodes = document.querySelectorAll('.step-tracker-node');

    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        this.play();
      });
    }

    if (btnPause) {
      btnPause.addEventListener('click', () => {
        this.pause();
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.pause();
        this.renderStep(0);
      });
    }

    nodes.forEach((node, idx) => {
      node.addEventListener('click', () => {
        this.pause();
        this.renderStep(idx);
      });
    });
  },

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    const btnPlay = document.getElementById('btnPlayTimeline');
    if (btnPlay) btnPlay.style.display = 'none';
    const btnPause = document.getElementById('btnPauseTimeline');
    if (btnPause) btnPause.style.display = 'inline-flex';

    this.timer = setInterval(() => {
      let next = this.currentStepIndex + 1;
      if (next >= WEB_STEPS.length) {
        this.pause();
        return;
      }
      this.renderStep(next);
    }, 2200);
  },

  pause() {
    this.isPlaying = false;
    clearInterval(this.timer);
    this.timer = null;
    const btnPlay = document.getElementById('btnPlayTimeline');
    if (btnPlay) btnPlay.style.display = 'inline-flex';
    const btnPause = document.getElementById('btnPauseTimeline');
    if (btnPause) btnPause.style.display = 'none';
  },

  bindChallenge() {
    const options = document.querySelectorAll('#mission2Options .challenge-option-btn');
    const feedback = document.getElementById('mission2Feedback');
    const successBanner = document.getElementById('mission2SuccessBanner');
    if (!options.length || !feedback) return;

    options.forEach(btn => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.getAttribute('data-correct') === 'true';

        options.forEach(b => {
          b.disabled = true;
          if (b.getAttribute('data-correct') === 'true') {
            b.classList.add('state-correct');
          }
        });

        feedback.classList.remove('success', 'error');
        feedback.classList.add('show');

        if (isCorrect) {
          btn.classList.add('state-correct');
          feedback.classList.add('success');
          feedback.innerHTML = `
            <strong>🌟 Brilhante! Você acertou em cheio!</strong><br>
            Quando digitamos um endereço web, nosso aparelho envia pequenos pacotes de solicitação que cruzam a internet até o servidor correto, que responde com os dados da página.
          `;
          if (window.soundSystem) window.soundSystem.playCorrect();

          if (window.StorageManager) {
            window.StorageManager.completeMission('missao2');
          }

          setTimeout(() => {
            if (successBanner) successBanner.classList.add('show');
            if (window.soundSystem) window.soundSystem.playMissionComplete();
          }, 800);
        } else {
          btn.classList.add('state-wrong');
          feedback.classList.add('error');
          feedback.innerHTML = `
            <strong>💡 Dica de Aprendizado:</strong><br>
            A resposta correta é a letra A. Todo acesso a sites depende do envio de pacotes de dados através da internet até os servidores onde o conteúdo fica guardado.
          `;
          if (window.soundSystem) window.soundSystem.playWrong();

          if (window.StorageManager) {
            window.StorageManager.completeMission('missao2');
          }

          setTimeout(() => {
            if (successBanner) successBanner.classList.add('show');
          }, 1200);
        }
      });
    });
  }
};

window.Mission1Controller = Mission1Controller;
window.Mission2Controller = Mission2Controller;

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('mission1Section')) {
    Mission1Controller.init();
  }
  if (document.getElementById('mission2Section')) {
    Mission2Controller.init();
  }
});
