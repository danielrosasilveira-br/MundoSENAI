/**
 * PORTAL MUNDO SENAI DIGITAL — SCRIPT PRINCIPAL
 * Tecnologias: JavaScript Puro (Vanilla JS), Sem Dependências
 * Funcionalidades: Ano Dinâmico, Menu Responsivo, Scroll Suave, Efeitos de Interatividade, Estatísticas Locais
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. ANO ATUAL DINÂMICO NO RODAPÉ (REQUISITO OBRIGATÓRIO ITEM 10)
     -------------------------------------------------------------------------- */
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     2. CONTROLE DO CABEÇALHO NA ROLAGEM (STICKY & SHADOW)
     -------------------------------------------------------------------------- */
  const siteHeader = document.querySelector('.site-header');
  const handleScrollHeader = () => {
    if (!siteHeader) return;
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScrollHeader, { passive: true });
  handleScrollHeader();

  /* --------------------------------------------------------------------------
     3. MENU DE NAVEGAÇÃO MOBILE (ACESSIBILIDADE & INTERATIVIDADE)
     -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mainNav = document.getElementById('mainNav');

  if (mobileToggle && mainNav) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !mainNav.classList.contains('active');
      mainNav.classList.toggle('active', isOpen);
      mobileToggle.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      
      // Trava rolagem do corpo se menu estiver aberto em telas pequenas
      if (window.innerWidth <= 768) {
        document.body.style.overflow = isOpen ? 'hidden' : '';
      }
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Fecha menu ao clicar em qualquer link da navegação
    const navLinks = mainNav.querySelectorAll('.nav-link, .header-cta-btn');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mainNav.classList.contains('active')) {
          toggleMenu(false);
        }
      });
    });

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Fecha com tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('active')) {
        toggleMenu(false);
      }
    });

    // Restaura layout se a janela for redimensionada para desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
        toggleMenu(false);
        document.body.style.overflow = '';
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. DESTAQUE DINÂMICO DO LINK ATIVO NA NAVEGAÇÃO
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id], main[id]');
  const navLinksList = document.querySelectorAll('.nav-link');

  const highlightNavOnScroll = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinksList.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  /* --------------------------------------------------------------------------
     5. ANIMAÇÃO SUAVE DE ENTRADA DOS CARDS (INTERSECTION OBSERVER)
     -------------------------------------------------------------------------- */
  const missionCards = document.querySelectorAll('.mission-card, .feature-box');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    missionCards.forEach(card => observer.observe(card));
  } else {
    missionCards.forEach(card => card.classList.add('animate-fade-in'));
  }

  /* --------------------------------------------------------------------------
     6. EFEITO 3D DE TILT SUAVE NA MOLDURA VISUAL HERO
     -------------------------------------------------------------------------- */
  const artworkFrame = document.querySelector('.hero-artwork-frame');
  if (artworkFrame && !prefersReducedMotion && window.innerWidth > 992) {
    artworkFrame.addEventListener('mousemove', (e) => {
      const rect = artworkFrame.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      artworkFrame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    artworkFrame.addEventListener('mouseleave', () => {
      artworkFrame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  }

  /* --------------------------------------------------------------------------
     7. EFEITO DE CLIQUE E ACESSIBILIDADE NOS CARDS
     -------------------------------------------------------------------------- */
  const cards = document.querySelectorAll('.mission-card');
  cards.forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const url = card.getAttribute('href');
        if (url) {
          window.location.href = url;
        }
      }
    });
  });

  /* --------------------------------------------------------------------------
     8. CARREGAMENTO DAS ESTATÍSTICAS LOCAIS DOS JOGOS E QUIZZES (OPCIONAL)
     -------------------------------------------------------------------------- */
  try {
    const pacmanScore = localStorage.getItem('senai_pacman_highscore') || localStorage.getItem('pacman_recorde');
    const elPacman = document.getElementById('stat-pacman-score');
    if (elPacman && pacmanScore) {
      elPacman.textContent = Number(pacmanScore).toLocaleString('pt-BR');
    }

    const marioScore = localStorage.getItem('senai_mario_highscore') || localStorage.getItem('mario_score');
    const elMario = document.getElementById('stat-mario-score');
    if (elMario && marioScore) {
      elMario.textContent = Number(marioScore).toLocaleString('pt-BR');
    }

    const redesQuiz = localStorage.getItem('senai_redes_quiz_best') || localStorage.getItem('redes_quiz_best');
    const elRedes = document.getElementById('stat-redes-quiz');
    if (elRedes && redesQuiz) {
      elRedes.textContent = `${redesQuiz}/10 Acertos`;
    }

    const hwQuiz = localStorage.getItem('senai_hardware_quiz_best') || localStorage.getItem('hardware_quiz_best');
    const elHw = document.getElementById('stat-hw-quiz');
    if (elHw && hwQuiz) {
      elHw.textContent = `${hwQuiz}/10 Acertos`;
    }
  } catch (err) {
    // Modo anônimo ou local storage restrito
  }

  console.log('⚡ Mundo SENAI Digital — Portal de Projetos inicializado com sucesso.');
});
