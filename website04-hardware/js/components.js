/**
 * ===================================================================
 * MISSÃO HARDWARE — AVENTURA DENTRO DO COMPUTADOR
 * js/components.js — Atividades Interativas dos 6 Módulos Educativos
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ================================================================
  // 1. MÓDULO PROCESSADOR (CPU) — Execução de Instruções & ULA
  // ================================================================
  const cpuRunBtn = document.getElementById('cpu-btn-run');
  if (cpuRunBtn) {
    const num1Input = document.getElementById('cpu-input-n1');
    const num2Input = document.getElementById('cpu-input-n2');
    const opSelect = document.getElementById('cpu-select-op');
    const stepFetch = document.getElementById('cpu-step-fetch');
    const stepDecode = document.getElementById('cpu-step-decode');
    const stepExec = document.getElementById('cpu-step-exec');
    const stepResult = document.getElementById('cpu-step-result');
    const regResultVal = document.getElementById('cpu-reg-result');

    cpuRunBtn.addEventListener('click', () => {
      const n1 = parseFloat(num1Input.value) || 0;
      const n2 = parseFloat(num2Input.value) || 0;
      const op = opSelect.value;

      let res = 0;
      if (op === '+') res = n1 + n2;
      else if (op === '-') res = n1 - n2;
      else if (op === '*') res = n1 * n2;

      cpuRunBtn.disabled = true;
      if (window.soundEngine) window.soundEngine.playSnap();

      // Reset steps
      [stepFetch, stepDecode, stepExec, stepResult].forEach(el => {
        if (el) el.style.backgroundColor = 'rgba(67, 198, 183, 0.15)';
      });

      // Passo 1: Busca
      stepFetch.style.backgroundColor = 'var(--turquesa)';
      stepFetch.style.color = 'var(--verde-floresta)';

      setTimeout(() => {
        // Passo 2: Decodificação
        stepFetch.style.backgroundColor = 'rgba(67, 198, 183, 0.15)';
        stepFetch.style.color = '#FFFFFF';
        stepDecode.style.backgroundColor = 'var(--turquesa)';
        stepDecode.style.color = 'var(--verde-floresta)';
        if (window.soundEngine) window.soundEngine.playClick();
      }, 500);

      setTimeout(() => {
        // Passo 3: Execução na ULA
        stepDecode.style.backgroundColor = 'rgba(67, 198, 183, 0.15)';
        stepDecode.style.color = '#FFFFFF';
        stepExec.style.backgroundColor = 'var(--amarelo-manga)';
        stepExec.style.color = 'var(--verde-floresta)';
        if (window.soundEngine) window.soundEngine.playSnap();
      }, 1000);

      setTimeout(() => {
        // Passo 4: Gravação
        stepExec.style.backgroundColor = 'rgba(67, 198, 183, 0.15)';
        stepExec.style.color = '#FFFFFF';
        stepResult.style.backgroundColor = 'var(--verde-lima)';
        stepResult.style.color = 'var(--verde-floresta)';
        regResultVal.textContent = res;
        cpuRunBtn.disabled = false;
        if (window.soundEngine) window.soundEngine.playCorrect();

        if (window.StorageService) {
          window.StorageService.addStar('cpu_executed');
        }
        if (window.ProgressManager) {
          window.ProgressManager.updateHUD();
          window.ProgressManager.showToast(`Instrução calculada com sucesso pela ULA: ${n1} ${op} ${n2} = ${res}!`, 'success');
        }
      }, 1500);
    });
  }

  // ================================================================
  // 2. MÓDULO MEMÓRIA RAM — Ocupação e Volatilidade
  // ================================================================
  const ramSlotsContainer = document.getElementById('ram-slots-board');
  if (ramSlotsContainer) {
    const totalSlots = 8;
    let activeApps = [];

    const appCatalog = {
      browser: { name: 'Navegador Web', slots: 2, className: 'occupied' },
      game: { name: 'Jogo 3D', slots: 3, className: 'occupied-game' },
      music: { name: 'Música', slots: 1, className: 'occupied-music' },
      editor: { name: 'Editor de Imagens', slots: 2, className: 'occupied' }
    };

    function renderSlots() {
      ramSlotsContainer.innerHTML = '';
      let usedCount = 0;
      let slotAssignments = [];

      activeApps.forEach(appKey => {
        const item = appCatalog[appKey];
        for (let i = 0; i < item.slots; i++) {
          slotAssignments.push({ name: item.name, className: item.className });
          usedCount++;
        }
      });

      for (let i = 0; i < totalSlots; i++) {
        const slotEl = document.createElement('div');
        if (i < slotAssignments.length) {
          slotEl.className = `ram-slot ${slotAssignments[i].className}`;
          slotEl.innerHTML = `<span style="font-size: 0.65rem; text-align: center;">${slotAssignments[i].name}</span>`;
        } else {
          slotEl.className = 'ram-slot';
          slotEl.textContent = 'Livre';
        }
        ramSlotsContainer.appendChild(slotEl);
      }

      const counterEl = document.getElementById('ram-usage-counter');
      if (counterEl) {
        counterEl.textContent = `${usedCount} de ${totalSlots} Blocos em Uso (${Math.round((usedCount / totalSlots) * 100)}%)`;
      }
    }

    // Botões de abrir aplicativos
    document.querySelectorAll('[data-ram-app]').forEach(btn => {
      btn.addEventListener('click', () => {
        const appKey = btn.getAttribute('data-ram-app');
        const reqSlots = appCatalog[appKey].slots;
        let curUsed = activeApps.reduce((acc, k) => acc + appCatalog[k].slots, 0);

        if (curUsed + reqSlots > totalSlots) {
          if (window.soundEngine) window.soundEngine.playError();
          if (window.ProgressManager) {
            window.ProgressManager.showToast('Memória RAM Cheia! Feche um programa para liberar espaço temporário.', 'warning');
          }
          return;
        }

        activeApps.push(appKey);
        if (window.soundEngine) window.soundEngine.playSnap();
        renderSlots();
      });
    });

    // Botão de fechar último aplicativo
    const closeAppBtn = document.getElementById('ram-btn-close');
    if (closeAppBtn) {
      closeAppBtn.addEventListener('click', () => {
        if (activeApps.length > 0) {
          activeApps.pop();
          if (window.soundEngine) window.soundEngine.playClick();
          renderSlots();
        }
      });
    }

    // Botão de DESLIGAR O COMPUTADOR (Demonstração prática de volatilidade)
    const powerCutBtn = document.getElementById('ram-btn-powercut');
    if (powerCutBtn) {
      powerCutBtn.addEventListener('click', () => {
        activeApps = [];
        if (window.soundEngine) window.soundEngine.playSnap();
        renderSlots();
        if (window.ProgressManager) {
          window.ProgressManager.showToast('Computador desligado! Por ser volátil, toda a memória RAM foi esvaziada instantaneamente.', 'info');
        }
        if (window.StorageService) {
          window.StorageService.addStar('ram_volatility_understood');
        }
      });
    }

    renderSlots();
  }

  // ================================================================
  // 3. MÓDULO PLACA-MÃE — Explorador de Soquetes e Conectores
  // ================================================================
  const moboZones = document.querySelectorAll('.mobo-zone');
  if (moboZones.length > 0) {
    const moboData = {
      cpu_socket: {
        title: 'Soquete do Processador (CPU Socket)',
        desc: 'Conector de alta precisão com centenas de minúsculos pinos metálicos onde a CPU é encaixada com segurança. Possui trava de retenção e precisa ser compatível com a geração do processador.'
      },
      ram_slots: {
        title: 'Slots de Memória RAM (DIMM DDR)',
        desc: 'Trilhos verticais com travas laterais onde os pentes de memória RAM se conectam diretamente ao barramento de alta velocidade do processador.'
      },
      pcie_slots: {
        title: 'Slots PCI Express (PCIe x16)',
        desc: 'Slots compridos destinados a placas de expansão pesadas, principalmente a Placa de Vídeo dedicada (GPU) e placas de som/rede.'
      },
      storage_ports: {
        title: 'Portas de Armazenamento (M.2 NVMe e SATA)',
        desc: 'Conectores onde conectamos nossos SSDs e discos rígidos (HDs) para guardar jogos, fotos e o sistema operacional.'
      },
      power_atx: {
        title: 'Conector de Energia Principal (ATX 24 Pinos)',
        desc: 'A principal via de entrada elétrica vinda da fonte de alimentação para energizar todo o circuito integrado da placa.'
      },
      back_io: {
        title: 'Painel Traseiro de Entradas/Saídas (I/O)',
        desc: 'Onde ficam as portas externas: USB para teclado/mouse, HDMI para o monitor, portas de rede e conectores de fone de ouvido.'
      }
    };

    const titleEl = document.getElementById('mobo-info-title');
    const descEl = document.getElementById('mobo-info-desc');

    moboZones.forEach(zone => {
      zone.addEventListener('click', () => {
        moboZones.forEach(z => z.classList.remove('active'));
        zone.classList.add('active');

        const key = zone.getAttribute('data-zone-key');
        const info = moboData[key];
        if (info && titleEl && descEl) {
          titleEl.textContent = info.title;
          descEl.textContent = info.desc;
          if (window.soundEngine) window.soundEngine.playClick();
        }
      });
    });
  }

  // ================================================================
  // 4. MÓDULO ARMAZENAMENTO — Comparador SSD vs HD
  // ================================================================
  const btnShowSsd = document.getElementById('storage-toggle-ssd');
  const btnShowHd = document.getElementById('storage-toggle-hd');
  const storageCard = document.getElementById('storage-detail-card');
  const btnSimulateWrite = document.getElementById('storage-btn-simulate');

  if (btnShowSsd && btnShowHd && storageCard) {
    let currentTech = 'ssd';

    function updateStorageView(tech) {
      currentTech = tech;
      if (tech === 'ssd') {
        btnShowSsd.classList.add('btn-primary');
        btnShowSsd.classList.remove('btn-outline');
        btnShowHd.classList.remove('btn-primary');
        btnShowHd.classList.add('btn-outline');

        storageCard.innerHTML = `
          <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">⚡</div>
          <h3 style="color: var(--verde-floresta); font-size: 1.35rem;">SSD (Solid State Drive)</h3>
          <p style="margin-top: 0.5rem; color: var(--cor-texto);">
            <strong>Tecnologia:</strong> Chips eletrônicos de memória flash (silício).<br>
            <strong>Partes móveis:</strong> Zero partes mecânicas.<br>
            <strong>Ruído e Vibração:</strong> Completamente silencioso.<br>
            <strong>Resistência a Impactos:</strong> Alta resistência a quedas acidentais.<br>
            <strong>Velocidade de Leitura/Gravação:</strong> Acesso eletrônico praticamente instantâneo!
          </p>
        `;
      } else {
        btnShowHd.classList.add('btn-primary');
        btnShowHd.classList.remove('btn-outline');
        btnShowSsd.classList.remove('btn-primary');
        btnShowSsd.classList.add('btn-outline');

        storageCard.innerHTML = `
          <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">💿</div>
          <h3 style="color: var(--verde-floresta); font-size: 1.35rem;">HD (Disco Rígido Tradicional)</h3>
          <p style="margin-top: 0.5rem; color: var(--cor-texto);">
            <strong>Tecnologia:</strong> Discos magnéticos de alumínio/vidro gravados por agulha magnética.<br>
            <strong>Partes móveis:</strong> Discos que giram a milhares de rotações por minuto (5400/7200 RPM) e braço mecânico.<br>
            <strong>Ruído e Vibração:</strong> Leve zumbido e pequenos cliques do braço móvel.<br>
            <strong>Resistência a Impactos:</strong> Sensível a impactos bruscos enquanto os discos giram.<br>
            <strong>Velocidade:</strong> Mais lento devido ao tempo físico de girar o disco até a faixa certa.
          </p>
        `;
      }
    }

    btnShowSsd.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playClick();
      updateStorageView('ssd');
    });

    btnShowHd.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playClick();
      updateStorageView('hd');
    });

    if (btnSimulateWrite) {
      btnSimulateWrite.addEventListener('click', () => {
        btnSimulateWrite.disabled = true;
        const feedbackEl = document.getElementById('storage-write-feedback');
        if (feedbackEl) feedbackEl.style.display = 'block';

        if (currentTech === 'ssd') {
          if (window.soundEngine) window.soundEngine.playSnap();
          feedbackEl.innerHTML = `<span style="color: var(--cor-sucesso); font-weight: 700;">⚡ Gravado no SSD em 0.2 segundos! Os elétrons foram gravados nos chips de silício sem esperar nenhuma peça se mover.</span>`;
          btnSimulateWrite.disabled = false;
        } else {
          feedbackEl.innerHTML = `<span style="color: var(--amarelo-manga); font-weight: 700;">⏳ Girando os pratos magnéticos e posicionando o braço mecânico...</span>`;
          setTimeout(() => {
            if (window.soundEngine) window.soundEngine.playCorrect();
            feedbackEl.innerHTML = `<span style="color: var(--cor-texto); font-weight: 700;">💿 Gravado no HD em 2.4 segundos! A agulha encontrou o setor magnético correto.</span>`;
            btnSimulateWrite.disabled = false;
          }, 1400);
        }
      });
    }

    updateStorageView('ssd');
  }

  // ================================================================
  // 5. MÓDULO FONTE DE ALIMENTAÇÃO — Distribuição de Energia
  // ================================================================
  const psuPowerSwitch = document.getElementById('psu-btn-switch');
  if (psuPowerSwitch) {
    let isPowered = false;
    const powerTargets = document.querySelectorAll('.power-target-item');
    const statusText = document.getElementById('psu-status-indicator');

    psuPowerSwitch.addEventListener('click', () => {
      isPowered = !isPowered;
      if (window.soundEngine) window.soundEngine.playSnap();

      if (isPowered) {
        psuPowerSwitch.textContent = 'Desligar Fonte ⚡';
        psuPowerSwitch.classList.replace('btn-primary', 'btn-coral');
        statusText.textContent = 'FONTE ATIVA: 12V, 5V e 3.3V Estabilizados';
        statusText.style.color = 'var(--verde-lima)';

        powerTargets.forEach(t => t.classList.add('powered'));
        if (window.ProgressManager) {
          window.ProgressManager.showToast('Energia limpa e regulada distribuída com sucesso para os subsistemas!', 'success');
        }
      } else {
        psuPowerSwitch.textContent = 'Ligar Chave Geral ⚡';
        psuPowerSwitch.classList.replace('btn-coral', 'btn-primary');
        statusText.textContent = 'FONTE DESLIGADA (Em Repouso)';
        statusText.style.color = '#B2C6BA';

        powerTargets.forEach(t => t.classList.remove('powered'));
      }
    });
  }

  // ================================================================
  // 6. MÓDULO PERIFÉRICOS — Classificação Interativa (Entrada / Saída / Híbrido)
  // ================================================================
  const peripheralPool = document.getElementById('peripherals-pool');
  if (peripheralPool) {
    const bins = document.querySelectorAll('.peripheral-bin');
    let selectedItemCard = null;

    // Equipamentos e suas classificações corretas
    const peripheralCategories = {
      'teclado': 'entrada',
      'mouse': 'entrada',
      'webcam': 'entrada',
      'monitor': 'saida',
      'fones': 'saida',
      'impressora': 'saida'
    };

    const cards = peripheralPool.querySelectorAll('.peripheral-draggable-card');

    cards.forEach(card => {
      // Arrastar e soltar (Drag and Drop para desktop)
      card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', card.getAttribute('data-perif-id'));
      });

      // Alternativa Acessível: Clique / Toque para selecionar
      card.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playClick();
        cards.forEach(c => c.style.outline = 'none');
        card.style.outline = '3px solid var(--coral)';
        selectedItemCard = card;
        if (window.ProgressManager) {
          window.ProgressManager.showToast(`Selecione agora a caixa de destino para "${card.innerText.trim()}".`, 'info');
        }
      });
    });

    bins.forEach(bin => {
      const targetCategory = bin.getAttribute('data-bin-category');

      // Drag over e drop
      bin.addEventListener('dragover', (e) => e.preventDefault());
      bin.addEventListener('drop', (e) => {
        e.preventDefault();
        const itemId = e.dataTransfer.getData('text/plain');
        const cardEl = document.querySelector(`[data-perif-id="${itemId}"]`);
        if (cardEl) handleClassification(cardEl, targetCategory, bin);
      });

      // Clique no container para a alternativa acessível
      bin.addEventListener('click', () => {
        if (selectedItemCard) {
          handleClassification(selectedItemCard, targetCategory, bin);
          selectedItemCard = null;
        }
      });
    });

    function handleClassification(cardEl, chosenCategory, binEl) {
      const itemId = cardEl.getAttribute('data-perif-id');
      const correctCategory = peripheralCategories[itemId];

      if (chosenCategory === correctCategory) {
        if (window.soundEngine) window.soundEngine.playCorrect();
        cardEl.style.outline = 'none';
        cardEl.setAttribute('draggable', 'false');
        cardEl.style.cursor = 'default';
        cardEl.classList.add('badge-concluido');
        binEl.appendChild(cardEl);

        if (window.ProgressManager) {
          window.ProgressManager.showToast(`Correto! ${cardEl.innerText.trim()} é um periférico de ${chosenCategory.toUpperCase()}!`, 'success');
        }

        // Verifica se todos foram classificados
        const remaining = peripheralPool.querySelectorAll('.peripheral-draggable-card');
        if (remaining.length === 0) {
          if (window.soundEngine) window.soundEngine.playFanfare();
          if (window.StorageService) window.StorageService.addStar('peripherals_all_sorted');
          if (window.ProgressManager) {
            window.ProgressManager.showToast('Parabéns! Todos os 6 periféricos foram classificados com perfeição!', 'success');
          }
        }
      } else {
        if (window.soundEngine) window.soundEngine.playError();
        if (window.ProgressManager) {
          window.ProgressManager.showToast(`Atenção: verifique se "${cardEl.innerText.trim()}" envia informações para o PC ou recebe informações dele.`, 'warning');
        }
      }
    }
  }

});

