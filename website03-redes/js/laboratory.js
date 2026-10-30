/**
 * MISSÃO: MUNDO DAS REDES - LABORATÓRIO VIRTUAL DE REDES
 * Demonstração interativa de Conexão Cabeada (Cabo de Rede) vs Conexão Sem Fio (Wi-Fi).
 */

const LAB_SPECS = {
  cabeada: {
    title: 'Modo Conexão Cabeada (Ethernet)',
    desc: 'Os dispositivos são ligados fisicamente por cabos de rede de cobre ou fibra óptica. Oferece altíssima estabilidade, menor interferência e velocidade constante para jogos e grandes transferências.',
    cableType: 'Cabo de Par Trançado (RJ-45)',
    advantage: 'Sinal blindado e sem perda por paredes',
    speed: 'Até 1.000 Mbps ou mais (Gigabit)'
  },
  wifi: {
    title: 'Modo Conexão Sem Fio (Wi-Fi)',
    desc: 'O roteador converte os dados em ondas eletromagnéticas invisíveis que viajam pelo ar. Permite total mobilidade para você usar celulares, tablets e notebooks em qualquer lugar do ambiente.',
    cableType: 'Ondas de Rádio (2.4 GHz e 5 GHz)',
    advantage: 'Liberdade total sem fios espalhados',
    speed: 'Variável conforme distância e obstáculos'
  }
};

const LaboratoryController = {
  currentMode: 'cabeada', // 'cabeada' ou 'wifi'
  isTesting: false,

  init() {
    this.bindModeTabs();
    this.bindTestButton();
    this.bindResetButton();
    this.bindInspector();
    this.updateBoard();
  },

  bindModeTabs() {
    const tabs = document.querySelectorAll('.lab-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const mode = tab.getAttribute('data-mode');
        if (mode === this.currentMode) return;

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentMode = mode;
        this.updateBoard();

        if (window.soundSystem) window.soundSystem.playClick();
      });
    });
  },

  updateBoard() {
    const board = document.getElementById('labSandboxBoard');
    const specTitle = document.getElementById('labSpecTitle');
    const specDesc = document.getElementById('labSpecDesc');
    const specAdvantage = document.getElementById('labSpecAdvantage');
    const specSpeed = document.getElementById('labSpecSpeed');
    const wavesGroup = document.getElementById('labWifiWavesGroup');
    const cablesGroup = document.getElementById('labCablesGroup');

    if (!board) return;

    const data = LAB_SPECS[this.currentMode];

    if (specTitle) specTitle.textContent = data.title;
    if (specDesc) specDesc.textContent = data.desc;
    if (specAdvantage) specAdvantage.textContent = data.advantage;
    if (specSpeed) specSpeed.textContent = data.speed;

    if (this.currentMode === 'cabeada') {
      board.classList.remove('mode-wifi');
      board.classList.add('mode-cabeada');
      if (wavesGroup) wavesGroup.style.display = 'none';
      if (cablesGroup) cablesGroup.style.display = 'block';
    } else {
      board.classList.remove('mode-cabeada');
      board.classList.add('mode-wifi');
      if (wavesGroup) wavesGroup.style.display = 'block';
      if (cablesGroup) cablesGroup.style.display = 'none';
    }
  },

  bindTestButton() {
    const btnTest = document.getElementById('btnStartLabTest');
    const feedback = document.getElementById('labTestFeedback');
    const labToken = document.getElementById('labPacketToken');

    if (!btnTest || !feedback) return;

    btnTest.addEventListener('click', () => {
      if (this.isTesting) return;
      this.isTesting = true;
      btnTest.disabled = true;

      if (window.soundSystem) window.soundSystem.playPacketSend();

      const modeName = this.currentMode === 'cabeada' ? 'Cabos Físicos de Rede' : 'Ondas de Rádio Wi-Fi';

      feedback.innerHTML = `
        <span class="sim-status-icon">⚡</span>
        <span>Disparando pacotes de teste através de <strong>${modeName}</strong>...</span>
      `;

      if (labToken) {
        labToken.classList.add('active');
        labToken.style.left = '20%';
        labToken.style.top = '65%';

        setTimeout(() => {
          labToken.style.left = '50%';
          labToken.style.top = '30%';
        }, 700);

        setTimeout(() => {
          labToken.style.left = '80%';
          labToken.style.top = '65%';
        }, 1400);

        setTimeout(() => {
          labToken.classList.remove('active');
          feedback.innerHTML = `
            <span class="sim-status-icon" style="color: var(--success);">✅</span>
            <span>Transmissão concluída com êxito! Todos os pacotes chegaram com 0% de perda.</span>
          `;
          if (window.soundSystem) window.soundSystem.playCorrect();

          // Salva conclusão da atividade prática no laboratório
          if (window.StorageManager) {
            window.StorageManager.completeMission('lab');
          }

          this.isTesting = false;
          btnTest.disabled = false;
        }, 2200);
      } else {
        this.isTesting = false;
        btnTest.disabled = false;
      }
    });
  },

  bindResetButton() {
    const btnReset = document.getElementById('btnResetLab');
    const feedback = document.getElementById('labTestFeedback');
    if (!btnReset) return;

    btnReset.addEventListener('click', () => {
      this.currentMode = 'cabeada';
      const tabs = document.querySelectorAll('.lab-tab-btn');
      tabs.forEach(t => {
        t.classList.toggle('active', t.getAttribute('data-mode') === 'cabeada');
      });
      this.updateBoard();
      if (feedback) {
        feedback.innerHTML = `
          <span class="sim-status-icon">ℹ️</span>
          <span>Simulação reiniciada. Escolha o modo de conexão e clique em Iniciar Teste!</span>
        `;
      }
      if (window.soundSystem) window.soundSystem.playClick();
    });
  },

  bindInspector() {
    const inspectItems = document.querySelectorAll('.lab-inspect-item');
    const modalDetail = document.getElementById('labInspectDetail');
    if (!inspectItems.length || !modalDetail) return;

    inspectItems.forEach(item => {
      item.addEventListener('click', () => {
        const name = item.getAttribute('data-name');
        const role = item.getAttribute('data-role');
        const note = item.getAttribute('data-note');

        modalDetail.innerHTML = `
          <div style="background: rgba(0, 210, 255, 0.1); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--primary);">
            <h4 style="color: var(--accent-neon); font-size: 1.2rem; margin-bottom: 0.35rem;">${name}</h4>
            <p style="font-size: 0.95rem; color: #cbd5e1; margin-bottom: 0.5rem;"><strong>Papel na Rede:</strong> ${role}</p>
            <p style="font-size: 0.9rem; color: #94a3b8;"><strong>Dica de Especialista:</strong> ${note}</p>
          </div>
        `;
        if (window.soundSystem) window.soundSystem.playClick();
      });
    });
  }
};

window.LaboratoryController = LaboratoryController;

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('labSandboxBoard')) {
    LaboratoryController.init();
  }
});
