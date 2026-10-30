/**
 * ===================================================================
 * MISSÃO HARDWARE — AVENTURA DENTRO DO COMPUTADOR
 * js/map.js — Mapa Interativo da Cidade Tecnológica
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const mapSvg = document.getElementById('world-map-svg');
  if (!mapSvg) return;

  const poiPoints = [
    { id: 'poi-cpu', url: 'processador.html', moduleId: 'processador', title: 'Central do Processador' },
    { id: 'poi-ram', url: 'memoria-ram.html', moduleId: 'memoria-ram', title: 'Torre da Memória RAM' },
    { id: 'poi-mobo', url: 'placa-mae.html', moduleId: 'placa-mae', title: 'Centro de Conexões da Placa-Mãe' },
    { id: 'poi-storage', url: 'armazenamento.html', moduleId: 'armazenamento', title: 'Cofre de Armazenamento (SSD & HD)' },
    { id: 'poi-psu', url: 'fonte.html', moduleId: 'fonte', title: 'Estação de Energia (Fonte)' },
    { id: 'poi-perif', url: 'perifericos.html', moduleId: 'perifericos', title: 'Zona dos Periféricos' },
    { id: 'poi-assembly', url: 'montagem.html', moduleId: 'montagem', title: 'Laboratório de Montagem' },
    { id: 'poi-quiz', url: 'quiz.html', moduleId: 'quiz', title: 'Arena do Conhecimento (Quiz)' }
  ];

  poiPoints.forEach(poi => {
    const el = document.getElementById(poi.id);
    if (!el) return;

    // Acessibilidade por Teclado
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'link');
    el.setAttribute('aria-label', `Explorar ${poi.title}`);

    // Marcação se visitado
    if (window.StorageService) {
      const visited = window.StorageService.getVisitedModules().includes(poi.moduleId);
      if (visited) {
        const ring = el.querySelector('.poi-ring');
        if (ring) {
          ring.setAttribute('stroke', '#C5F05A');
          ring.setAttribute('stroke-width', '4');
        }
      }
    }

    el.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playClick();
      window.location.href = poi.url;
    });

    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (window.soundEngine) window.soundEngine.playClick();
        window.location.href = poi.url;
      }
    });

    // Efeito hover sonoro leve
    el.addEventListener('mouseenter', () => {
      const ring = el.querySelector('.poi-ring');
      if (ring) ring.setAttribute('r', '26');
    });

    el.addEventListener('mouseleave', () => {
      const ring = el.querySelector('.poi-ring');
      if (ring) ring.setAttribute('r', '22');
    });
  });

  // Atualiza botão de "Continuar Missão"
  const continueBtn = document.getElementById('hero-btn-continue');
  if (continueBtn && window.StorageService) {
    const visited = window.StorageService.getVisitedModules();
    if (visited.length === 0) {
      continueBtn.textContent = '🚀 Iniciar Aventura';
      continueBtn.href = 'processador.html';
    } else if (visited.length < 6) {
      const allMods = ['processador', 'memoria-ram', 'placa-mae', 'armazenamento', 'fonte', 'perifericos'];
      const nextMod = allMods.find(m => !visited.includes(m)) || 'montagem';
      continueBtn.textContent = '⚡ Continuar Aventura';
      continueBtn.href = `${nextMod}.html`;
    } else {
      const assembly = window.StorageService.getAssemblyState();
      if (!assembly || !assembly.stage1Complete) {
        continueBtn.textContent = '🛠️ Ir para Montagem Virtual';
        continueBtn.href = 'montagem.html';
      } else {
        continueBtn.textContent = '🎯 Desafiar a Arena do Quiz';
        continueBtn.href = 'quiz.html';
      }
    }
  }
});

