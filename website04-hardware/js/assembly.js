/**
 * ===================================================================
 * MISSÃO HARDWARE — AVENTURA DENTRO DO COMPUTADOR
 * js/assembly.js — Bancada de Montagem Virtual em 2 Etapas
 * Etapa 1: Hardware Interno (Placa-mãe, CPU, RAM, SSD, Fonte)
 * Etapa 2: Conexão dos Periféricos Externos
 * Suporte a Arrastar-e-Soltar, Toque e Alternativa Acessível por Cliques
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const assemblyContainer = document.getElementById('assembly-app');
  if (!assemblyContainer) return;

  // Estado da Montagem
  let currentStage = 1;
  let selectedPart = null;

  // Definição das Peças da Etapa 1 (Hardware Interno)
  const stage1Parts = [
    { id: 'mobo', name: 'Placa-Mãe', targetSlot: 'slot-mobo', icon: '🖲️', desc: 'Base principal que interliga todos os componentes.' },
    { id: 'cpu', name: 'Processador (CPU)', targetSlot: 'slot-cpu', icon: '⚡', desc: 'Encaixa no soquete central para fazer todos os cálculos.' },
    { id: 'ram', name: 'Memória RAM', targetSlot: 'slot-ram', icon: '💾', desc: 'Encaixa nos trilhos verticais (slots DIMM).' },
    { id: 'ssd', name: 'Disco SSD', targetSlot: 'slot-ssd', icon: '💽', desc: 'Fica na baia de armazenamento ligado à placa.' },
    { id: 'psu', name: 'Fonte de Alimentação', targetSlot: 'slot-psu', icon: '🔌', desc: 'Instalada na base do gabinete para energizar tudo.' }
  ];

  // Definição dos Periféricos da Etapa 2 (Conexões Externas)
  const stage2Parts = [
    { id: 'perif-monitor', name: 'Monitor de Vídeo', targetSlot: 'slot-hdmi', icon: '🖥️', portName: 'Porta de Vídeo (HDMI/DisplayPort)' },
    { id: 'perif-teclado', name: 'Teclado Gamer', targetSlot: 'slot-usb1', icon: '⌨️', portName: 'Porta USB (Entrada)' },
    { id: 'perif-mouse', name: 'Mouse Óptico', targetSlot: 'slot-usb2', icon: '🖱️', portName: 'Porta USB (Entrada)' },
    { id: 'perif-webcam', name: 'Webcam HD', targetSlot: 'slot-usb3', icon: '📷', portName: 'Porta USB (Vídeo/Entrada)' },
    { id: 'perif-fones', name: 'Fones de Ouvido', targetSlot: 'slot-audio', icon: '🎧', portName: 'Conector de Áudio P2 (Saída)' }
  ];

  let placedParts = [];

  function renderStage() {
    selectedPart = null;

    if (currentStage === 1) {
      renderStage1();
    } else {
      renderStage2();
    }
  }

  // --- Renderização da Etapa 1 ---
  function renderStage1() {
    assemblyContainer.innerHTML = `
      <div style="background-color: var(--verde-floresta); color: var(--creme-claro); padding: 1rem 1.5rem; border-radius: var(--raio-medio); margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-left: 6px solid var(--verde-lima);">
        <div>
          <span class="badge badge-concluido" style="margin-bottom: 0.25rem;">Etapa 1 de 2</span>
          <h2 style="font-size: 1.35rem; color: #FFFFFF; margin: 0;">Montagem dos Componentes Internos</h2>
          <p style="font-size: 0.85rem; color: #D4E0D7; margin: 0;">Arraste ou clique na peça e depois no local de encaixe correto no chassi.</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button id="btn-assembly-reset" class="btn btn-coral btn-sm">Reiniciar Bancada</button>
        </div>
      </div>

      <div class="assembly-layout">
        <!-- Prateleira de Peças -->
        <div class="assembly-parts-shelf" role="region" aria-label="Bancada de Peças">
          <h3 style="font-size: 1.1rem; color: var(--verde-floresta); border-bottom: 2px solid var(--cor-borda); padding-bottom: 0.5rem;">
            Peças Disponíveis
          </h3>
          <div class="parts-list" id="parts-shelf-list">
            ${stage1Parts.map(part => {
              const isPlaced = placedParts.includes(part.id);
              return `
                <div 
                  class="part-item ${isPlaced ? 'placed' : ''}" 
                  id="part-${part.id}" 
                  data-part-id="${part.id}"
                  draggable="${!isPlaced}"
                  tabindex="${isPlaced ? -1 : 0}"
                  role="button"
                  aria-label="${part.name}: ${part.desc}"
                >
                  <div style="display: flex; align-items: center; gap: 0.6rem;">
                    <span style="font-size: 1.5rem;">${part.icon}</span>
                    <div>
                      <strong style="display: block; font-size: 0.95rem; color: var(--cor-texto);">${part.name}</strong>
                      <span style="font-size: 0.75rem; color: var(--cor-texto-suave);">${part.desc}</span>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Chassi do Gabinete -->
        <div class="assembly-workbench" role="region" aria-label="Gabinete do Computador">
          <h3 style="color: var(--verde-lima); margin-bottom: 1rem; font-size: 1.2rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>🖥️</span> Gabinete Gamer — Vista Interna
          </h3>

          <div class="case-chassis">
            <div class="drop-slot ${placedParts.includes('mobo') ? 'filled' : ''}" id="slot-mobo" data-slot="slot-mobo">
              <span style="font-size: 1.8rem;">🖲️</span>
              <strong style="font-size: 0.9rem; color: var(--verde-lima);">Área da Placa-Mãe</strong>
              <span style="font-size: 0.75rem; color: #B2C6BA;">
                ${placedParts.includes('mobo') ? '✓ Placa-Mãe Fixada no Chassi' : 'Encaixe a placa-mãe aqui'}
              </span>
            </div>

            <div class="drop-slot ${placedParts.includes('cpu') ? 'filled' : ''}" id="slot-cpu" data-slot="slot-cpu">
              <span style="font-size: 1.8rem;">⚡</span>
              <strong style="font-size: 0.9rem; color: var(--verde-lima);">Soquete da CPU</strong>
              <span style="font-size: 0.75rem; color: #B2C6BA;">
                ${placedParts.includes('cpu') ? '✓ Processador Travado com Sucesso' : 'Encaixe o processador aqui'}
              </span>
            </div>

            <div class="drop-slot ${placedParts.includes('ram') ? 'filled' : ''}" id="slot-ram" data-slot="slot-ram">
              <span style="font-size: 1.8rem;">💾</span>
              <strong style="font-size: 0.9rem; color: var(--verde-lima);">Slots de Memória RAM</strong>
              <span style="font-size: 0.75rem; color: #B2C6BA;">
                ${placedParts.includes('ram') ? '✓ Pente de Memória RAM Encaixado' : 'Encaixe a memória RAM aqui'}
              </span>
            </div>

            <div class="drop-slot ${placedParts.includes('ssd') ? 'filled' : ''}" id="slot-ssd" data-slot="slot-ssd">
              <span style="font-size: 1.8rem;">💽</span>
              <strong style="font-size: 0.9rem; color: var(--verde-lima);">Baia de Armazenamento</strong>
              <span style="font-size: 0.75rem; color: #B2C6BA;">
                ${placedParts.includes('ssd') ? '✓ SSD Instalado com Conexão de Dados' : 'Encaixe o SSD aqui'}
              </span>
            </div>

            <div class="drop-slot ${placedParts.includes('psu') ? 'filled' : ''}" id="slot-psu" data-slot="slot-psu" style="grid-column: span 2;">
              <span style="font-size: 1.8rem;">🔌</span>
              <strong style="font-size: 0.9rem; color: var(--verde-lima);">Compartimento da Fonte (PSU)</strong>
              <span style="font-size: 0.75rem; color: #B2C6BA;">
                ${placedParts.includes('psu') ? '✓ Fonte Instalada e Cabos de Energia Prontos' : 'Encaixe a fonte de alimentação aqui'}
              </span>
            </div>
          </div>

          <div id="assembly-feedback" style="margin-top: 1rem; padding: 0.75rem 1rem; background-color: rgba(255,255,255,0.08); border-radius: var(--raio-pequeno); font-size: 0.85rem; color: #D4E0D7; min-height: 40px; display: flex; align-items: center;" aria-live="polite">
            Selecione uma peça na bancada à esquerda para começar a montagem.
          </div>
        </div>
      </div>
    `;

    bindStage1Events();
  }

  // --- Eventos da Etapa 1 ---
  function bindStage1Events() {
    const partElements = assemblyContainer.querySelectorAll('.part-item:not(.placed)');
    const slots = assemblyContainer.querySelectorAll('.drop-slot:not(.filled)');
    const feedback = assemblyContainer.querySelector('#assembly-feedback');
    const resetBtn = assemblyContainer.querySelector('#btn-assembly-reset');

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playClick();
        placedParts = [];
        renderStage();
        if (window.ProgressManager) {
          window.ProgressManager.showToast('Bancada reiniciada para nova montagem!', 'info');
        }
      });
    }

    // Drag and Drop (Mouse / Desktop)
    partElements.forEach(partEl => {
      partEl.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', partEl.getAttribute('data-part-id'));
      });

      // Alternativa Acessível por Clique / Teclado
      partEl.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playClick();
        partElements.forEach(p => p.style.outline = 'none');
        partEl.style.outline = '3px solid var(--coral)';
        selectedPart = partEl.getAttribute('data-part-id');
        feedback.innerHTML = `👉 Peça selecionada: <strong>${partEl.querySelector('strong').innerText}</strong>. Agora clique no local correspondente no gabinete.`;
      });

      partEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          partEl.click();
        }
      });
    });

    slots.forEach(slot => {
      slot.addEventListener('dragover', (e) => {
        e.preventDefault();
        slot.classList.add('drag-hover');
      });

      slot.addEventListener('dragleave', () => {
        slot.classList.remove('drag-hover');
      });

      slot.addEventListener('drop', (e) => {
        e.preventDefault();
        slot.classList.remove('drag-hover');
        const partId = e.dataTransfer.getData('text/plain');
        attemptPlacePart(partId, slot.getAttribute('data-slot'));
      });

      slot.addEventListener('click', () => {
        if (selectedPart) {
          attemptPlacePart(selectedPart, slot.getAttribute('data-slot'));
        } else {
          feedback.innerHTML = `⚠️ Primeiro selecione uma peça na prateleira à esquerda!`;
        }
      });
    });

    function attemptPlacePart(partId, slotId) {
      const partObj = stage1Parts.find(p => p.id === partId);
      if (!partObj) return;

      // Regra de montagem: para encaixar CPU, RAM e SSD é ideal que a placa-mãe já esteja no lugar, mas permitimos qualquer ordem sem bloquear!
      if (partObj.targetSlot === slotId) {
        if (window.soundEngine) window.soundEngine.playSnap();
        placedParts.push(partId);
        selectedPart = null;

        renderStage1();

        const newFeedback = assemblyContainer.querySelector('#assembly-feedback');
        if (newFeedback) {
          newFeedback.innerHTML = `<span style="color: var(--verde-lima); font-weight: 700;">✓ Excelente! ${partObj.name} posicionada e travada corretamente!</span>`;
        }

        // Verifica conclusão da Etapa 1
        if (placedParts.length === stage1Parts.length) {
          setTimeout(() => {
            if (window.soundEngine) window.soundEngine.playCorrect();
            if (window.ProgressManager) {
              window.ProgressManager.showToast('Etapa 1 Concluída! O computador interno está totalmente montado.', 'success');
            }
            currentStage = 2;
            renderStage();
          }, 800);
        }
      } else {
        if (window.soundEngine) window.soundEngine.playError();
        const feedbackEl = assemblyContainer.querySelector('#assembly-feedback');
        if (feedbackEl) {
          feedbackEl.innerHTML = `<span style="color: var(--coral); font-weight: 700;">⚠️ Local incompatível: ${partObj.name} não encaixa nessa conexão. Tente outro local no chassi!</span>`;
        }
      }
    }
  }

  // --- Renderização da Etapa 2 (Conexão dos Periféricos) ---
  let stage2Placed = [];

  function renderStage2() {
    assemblyContainer.innerHTML = `
      <div style="background-color: var(--verde-floresta); color: var(--creme-claro); padding: 1rem 1.5rem; border-radius: var(--raio-medio); margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-left: 6px solid var(--turquesa);">
        <div>
          <span class="badge badge-modulo" style="background-color: var(--turquesa); color: var(--verde-floresta); margin-bottom: 0.25rem;">Etapa 2 de 2</span>
          <h2 style="font-size: 1.35rem; color: #FFFFFF; margin: 0;">Conectando os Periféricos Externos</h2>
          <p style="font-size: 0.85rem; color: #D4E0D7; margin: 0;">Ligue os cabos dos equipamentos de entrada e saída nas portas do computador.</p>
        </div>
        <div>
          <button id="btn-back-stage1" class="btn btn-outline btn-sm">Voltar ao Gabinete</button>
        </div>
      </div>

      <div class="assembly-layout">
        <div class="assembly-parts-shelf">
          <h3 style="font-size: 1.1rem; color: var(--verde-floresta); border-bottom: 2px solid var(--cor-borda); padding-bottom: 0.5rem;">
            Periféricos na Mesa
          </h3>
          <div class="parts-list">
            ${stage2Parts.map(perif => {
              const isPlaced = stage2Placed.includes(perif.id);
              return `
                <div 
                  class="part-item ${isPlaced ? 'placed' : ''}" 
                  id="perif-${perif.id}" 
                  data-perif-id="${perif.id}"
                  draggable="${!isPlaced}"
                  tabindex="${isPlaced ? -1 : 0}"
                  role="button"
                >
                  <div style="display: flex; align-items: center; gap: 0.6rem;">
                    <span style="font-size: 1.5rem;">${perif.icon}</span>
                    <div>
                      <strong style="display: block; font-size: 0.95rem; color: var(--cor-texto);">${perif.name}</strong>
                      <span style="font-size: 0.75rem; color: var(--cor-texto-suave);">${perif.portName}</span>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="assembly-workbench">
          <h3 style="color: var(--turquesa); margin-bottom: 1rem; font-size: 1.2rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>🔌</span> Painel Traseiro de Conexões do Computador
          </h3>

          <div class="case-chassis" style="grid-template-columns: 1fr 1fr;">
            <div class="drop-slot ${stage2Placed.includes('perif-monitor') ? 'filled' : ''}" id="slot-hdmi" data-slot="slot-hdmi">
              <span style="font-size: 1.8rem;">📺</span>
              <strong style="font-size: 0.9rem; color: var(--verde-lima);">Saída de Vídeo (HDMI)</strong>
              <span style="font-size: 0.75rem; color: #B2C6BA;">
                ${stage2Placed.includes('perif-monitor') ? '✓ Monitor de Vídeo Conectado' : 'Conecte o cabo de vídeo aqui'}
              </span>
            </div>

            <div class="drop-slot ${stage2Placed.includes('perif-teclado') ? 'filled' : ''}" id="slot-usb1" data-slot="slot-usb1">
              <span style="font-size: 1.8rem;">🔤</span>
              <strong style="font-size: 0.9rem; color: var(--verde-lima);">Porta USB 1 (Entrada)</strong>
              <span style="font-size: 0.75rem; color: #B2C6BA;">
                ${stage2Placed.includes('perif-teclado') ? '✓ Teclado Conectado' : 'Conecte o teclado aqui'}
              </span>
            </div>

            <div class="drop-slot ${stage2Placed.includes('perif-mouse') ? 'filled' : ''}" id="slot-usb2" data-slot="slot-usb2">
              <span style="font-size: 1.8rem;">🖱️</span>
              <strong style="font-size: 0.9rem; color: var(--verde-lima);">Porta USB 2 (Entrada)</strong>
              <span style="font-size: 0.75rem; color: #B2C6BA;">
                ${stage2Placed.includes('perif-mouse') ? '✓ Mouse Conectado' : 'Conecte o mouse aqui'}
              </span>
            </div>

            <div class="drop-slot ${stage2Placed.includes('perif-webcam') ? 'filled' : ''}" id="slot-usb3" data-slot="slot-usb3">
              <span style="font-size: 1.8rem;">📷</span>
              <strong style="font-size: 0.9rem; color: var(--verde-lima);">Porta USB 3 (Entrada)</strong>
              <span style="font-size: 0.75rem; color: #B2C6BA;">
                ${stage2Placed.includes('perif-webcam') ? '✓ Webcam Conectada' : 'Conecte a webcam aqui'}
              </span>
            </div>

            <div class="drop-slot ${stage2Placed.includes('perif-fones') ? 'filled' : ''}" id="slot-audio" data-slot="slot-audio" style="grid-column: span 2;">
              <span style="font-size: 1.8rem;">🎧</span>
              <strong style="font-size: 0.9rem; color: var(--verde-lima);">Saída de Áudio P2 (3.5mm)</strong>
              <span style="font-size: 0.75rem; color: #B2C6BA;">
                ${stage2Placed.includes('perif-fones') ? '✓ Fones de Ouvido Conectados' : 'Conecte o cabo de áudio aqui'}
              </span>
            </div>
          </div>

          <div id="stage2-feedback" style="margin-top: 1rem; padding: 0.75rem 1rem; background-color: rgba(255,255,255,0.08); border-radius: var(--raio-pequeno); font-size: 0.85rem; color: #D4E0D7; min-height: 40px; display: flex; align-items: center;" aria-live="polite">
            Clique no periférico na bancada e conecte-o na porta correspondente.
          </div>
        </div>
      </div>
    `;

    bindStage2Events();
  }

  function bindStage2Events() {
    const perifElements = assemblyContainer.querySelectorAll('.part-item:not(.placed)');
    const slots = assemblyContainer.querySelectorAll('.drop-slot:not(.filled)');
    const feedback = assemblyContainer.querySelector('#stage2-feedback');
    const backBtn = assemblyContainer.querySelector('#btn-back-stage1');

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        currentStage = 1;
        renderStage();
      });
    }

    perifElements.forEach(itemEl => {
      itemEl.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', itemEl.getAttribute('data-perif-id'));
      });

      itemEl.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playClick();
        perifElements.forEach(p => p.style.outline = 'none');
        itemEl.style.outline = '3px solid var(--coral)';
        selectedPart = itemEl.getAttribute('data-perif-id');
        feedback.innerHTML = `👉 Periférico selecionado: <strong>${itemEl.querySelector('strong').innerText}</strong>. Clique na porta correspondente no painel.`;
      });
    });

    slots.forEach(slot => {
      slot.addEventListener('dragover', (e) => {
        e.preventDefault();
        slot.classList.add('drag-hover');
      });

      slot.addEventListener('dragleave', () => {
        slot.classList.remove('drag-hover');
      });

      slot.addEventListener('drop', (e) => {
        e.preventDefault();
        slot.classList.remove('drag-hover');
        const id = e.dataTransfer.getData('text/plain');
        attemptConnectPerif(id, slot.getAttribute('data-slot'));
      });

      slot.addEventListener('click', () => {
        if (selectedPart) {
          attemptConnectPerif(selectedPart, slot.getAttribute('data-slot'));
        }
      });
    });

    function attemptConnectPerif(perifId, slotId) {
      const pObj = stage2Parts.find(p => p.id === perifId);
      if (!pObj) return;

      if (pObj.targetSlot === slotId) {
        if (window.soundEngine) window.soundEngine.playSnap();
        stage2Placed.push(perifId);
        selectedPart = null;

        renderStage2();

        if (stage2Placed.length === stage2Parts.length) {
          // Computador completamente montado! Celebração e Conquista
          if (window.soundEngine) window.soundEngine.playFanfare();
          if (window.StorageService) {
            window.StorageService.saveAssemblyState({
              stage1Complete: true,
              stage2Complete: true,
              placedParts: placedParts
            });
            window.StorageService.addStar('computer_assembled');
          }
          if (window.ProgressManager) {
            window.ProgressManager.updateHUD();
            window.ProgressManager.showToast('Parabéns! Computador totalmente montado e conectado com sucesso!', 'success');
          }

          showVictoryCelebration();
        }
      } else {
        if (window.soundEngine) window.soundEngine.playError();
        const fEl = assemblyContainer.querySelector('#stage2-feedback');
        if (fEl) {
          fEl.innerHTML = `<span style="color: var(--coral); font-weight: 700;">⚠️ Porta incompatível: Esse periférico utiliza outro tipo de conexão. Verifique se é USB, HDMI ou Áudio!</span>`;
        }
      }
    }
  }

  function showVictoryCelebration() {
    const celebrationBox = document.createElement('div');
    celebrationBox.className = 'modal-overlay';
    celebrationBox.innerHTML = `
      <div class="modal-dialog" style="text-align: center; max-width: 520px;">
        <div style="font-size: 4rem; margin-bottom: 0.5rem;" class="anim-float">🖥️✨</div>
        <h2 class="titulo-gamificado" style="color: var(--verde-floresta); font-size: 1.6rem; margin-bottom: 0.5rem;">
          Computador Montado com Sucesso!
        </h2>
        <p style="color: var(--cor-texto); font-size: 1rem; margin-bottom: 1.5rem;">
          Você posicionou a placa-mãe, travou a CPU, instalou a memória RAM, o SSD, a fonte e conectou todos os periféricos nas portas corretas. Você ganhou uma estrela de Mestre da Montagem!
        </p>
        <div style="display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap;">
          <a href="quiz.html" class="btn btn-primary btn-lima">Testar Conhecimentos no Quiz ➔</a>
          <a href="index.html" class="btn btn-outline">Voltar ao Mapa 🗺️</a>
        </div>
      </div>
    `;
    document.body.appendChild(celebrationBox);
  }

  renderStage();
});

