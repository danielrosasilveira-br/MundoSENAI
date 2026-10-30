/**
 * MISSÃO: MUNDO DAS REDES - ARENA DO CONHECIMENTO (QUIZ)
 * 5 Questões objetivas, ilustradas e pedagógicas com feedback imediato.
 */

const QUIZ_QUESTIONS = [
  {
    id: 1,
    title: 'Pergunta 1: O Que é Uma Rede de Computadores?',
    prompt: 'Qual é a principal função de uma rede de computadores em uma escola ou empresa?',
    illustrationSvg: `
      <svg viewBox="0 0 320 120" width="100%" height="100%">
        <!-- Computador A -->
        <rect x="20" y="30" width="60" height="45" rx="6" fill="#0d1f4a" stroke="#00d2ff" stroke-width="2"/>
        <rect x="42" y="75" width="16" height="12" fill="#00d2ff"/>
        <line x1="30" y1="87" x2="70" y2="87" stroke="#00d2ff" stroke-width="3"/>
        <text x="50" y="58" fill="#ffffff" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold">PC 1</text>
        <!-- Cabo com fluxo -->
        <line x1="80" y1="52" x2="140" y2="52" stroke="#00f5d4" stroke-width="3" stroke-dasharray="6 4" class="flow-cable"/>
        <!-- Roteador Central -->
        <circle cx="160" cy="52" r="26" fill="#070d1e" stroke="#00f5d4" stroke-width="3"/>
        <text x="160" y="56" fill="#00f5d4" font-size="11" font-family="sans-serif" text-anchor="middle" font-weight="bold">REDE</text>
        <!-- Cabo com fluxo -->
        <line x1="180" y1="52" x2="240" y2="52" stroke="#00f5d4" stroke-width="3" stroke-dasharray="6 4" class="flow-cable"/>
        <!-- Computador B -->
        <rect x="240" y="30" width="60" height="45" rx="6" fill="#0d1f4a" stroke="#00d2ff" stroke-width="2"/>
        <rect x="262" y="75" width="16" height="12" fill="#00d2ff"/>
        <line x1="250" y1="87" x2="290" y2="87" stroke="#00d2ff" stroke-width="3"/>
        <text x="270" y="58" fill="#ffffff" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold">PC 2</text>
      </svg>
    `,
    options: [
      { letter: 'A', text: 'Permitir que vários aparelhos troquem dados e compartilhem informações e recursos.', correct: true },
      { letter: 'B', text: 'Impedir a entrada de energia elétrica nos computadores da sala.', correct: false },
      { letter: 'C', text: 'Apagar a memória de todos os dispositivos ao final do dia.', correct: false },
      { letter: 'D', text: 'Fazer com que os computadores funcionem somente de maneira isolada.', correct: false }
    ],
    explanation: 'Excelente! A rede de computadores existe exatamente para conectar aparelhos e permitir que eles compartilhem arquivos, impressoras, mensagens e acesso à internet.'
  },
  {
    id: 2,
    title: 'Pergunta 2: A Missão do Roteador',
    prompt: 'Qual é o papel fundamental do roteador em uma rede doméstica ou escolar?',
    illustrationSvg: `
      <svg viewBox="0 0 320 120" width="100%" height="100%">
        <!-- Roteador com antenas -->
        <rect x="110" y="45" width="100" height="40" rx="8" fill="#0e2354" stroke="#00d2ff" stroke-width="2"/>
        <circle cx="130" cy="65" r="5" fill="#00f5d4"/>
        <circle cx="150" cy="65" r="5" fill="#00f5d4"/>
        <circle cx="170" cy="65" r="5" fill="#00f5d4"/>
        <circle cx="190" cy="65" r="5" fill="#ffbe0b"/>
        <!-- Antenas -->
        <line x1="125" y1="45" x2="110" y2="15" stroke="#00d2ff" stroke-width="3"/>
        <line x1="195" y1="45" x2="210" y2="15" stroke="#00d2ff" stroke-width="3"/>
        <!-- Ondas de roteamento -->
        <circle cx="160" cy="25" r="14" fill="none" stroke="#00f5d4" stroke-width="2" stroke-dasharray="3 3"/>
        <text x="160" y="105" fill="#cbd5e1" font-size="11" font-family="sans-serif" text-anchor="middle">Direcionador de Pacotes</text>
      </svg>
    `,
    options: [
      { letter: 'A', text: 'Servir apenas como suporte físico para apoiar o computador em cima da mesa.', correct: false },
      { letter: 'B', text: 'Direcionar e encaminhar os pacotes de dados para o dispositivo de destino correto.', correct: true },
      { letter: 'C', text: 'Tirar fotos de quem está usando a internet.', correct: false },
      { letter: 'D', text: 'Transformar a tela do computador em uma televisão comum.', correct: false }
    ],
    explanation: 'Muito bem! O roteador é o maestro da rede: ele examina os pacotes de dados e os encaminha pelo melhor caminho até o dispositivo correto.'
  },
  {
    id: 3,
    title: 'Pergunta 3: Cabo de Rede ou Wi-Fi?',
    prompt: 'Qual é a principal diferença entre uma conexão com cabo de rede e uma conexão Wi-Fi?',
    illustrationSvg: `
      <svg viewBox="0 0 320 120" width="100%" height="100%">
        <!-- Lado Cabo -->
        <g transform="translate(10, 20)">
          <rect x="10" y="15" width="50" height="35" rx="4" fill="#0f214a" stroke="#00d2ff" stroke-width="2"/>
          <line x1="60" y1="32" x2="120" y2="32" stroke="#3a86ff" stroke-width="4"/>
          <text x="65" y="75" fill="#3a86ff" font-size="11" font-family="sans-serif" font-weight="bold">Cabo Físico</text>
        </g>
        <!-- Lado Wi-Fi -->
        <g transform="translate(170, 20)">
          <rect x="70" y="15" width="50" height="35" rx="4" fill="#0f214a" stroke="#00f5d4" stroke-width="2"/>
          <path d="M 20 20 A 25 25 0 0 1 50 20" stroke="#00f5d4" stroke-width="3" fill="none"/>
          <path d="M 26 28 A 15 15 0 0 1 44 28" stroke="#00f5d4" stroke-width="2.5" fill="none"/>
          <circle cx="35" cy="35" r="3" fill="#00f5d4"/>
          <text x="60" y="75" fill="#00f5d4" font-size="11" font-family="sans-serif" font-weight="bold">Ondas de Rádio</text>
        </g>
      </svg>
    `,
    options: [
      { letter: 'A', text: 'A conexão cabeada usa fios físicos, enquanto o Wi-Fi transmite dados por ondas de rádio pelo ar.', correct: true },
      { letter: 'B', text: 'O Wi-Fi só funciona se o computador estiver dentro da água.', correct: false },
      { letter: 'C', text: 'Os cabos de rede não conseguem transmitir dados digitais.', correct: false },
      { letter: 'D', text: 'O Wi-Fi não precisa de nenhum equipamento de rede para funcionar.', correct: false }
    ],
    explanation: 'Certíssimo! A conexão cabeada usa fios físicos (como o cabo de rede RJ-45), e o Wi-Fi utiliza ondas eletromagnéticas de rádio pelo ar para dar mobilidade aos aparelhos.'
  },
  {
    id: 4,
    title: 'Pergunta 4: A Grande Rede Mundial',
    prompt: 'O que é a Internet e qual é a sua principal função?',
    illustrationSvg: `
      <svg viewBox="0 0 320 120" width="100%" height="100%">
        <!-- Globo Conectado -->
        <circle cx="160" cy="60" r="42" fill="#081433" stroke="#00d2ff" stroke-width="2"/>
        <ellipse cx="160" cy="60" rx="42" ry="18" fill="none" stroke="#00f5d4" stroke-width="1.5"/>
        <ellipse cx="160" cy="60" rx="18" ry="42" fill="none" stroke="#00f5d4" stroke-width="1.5"/>
        <!-- Satélites/Nós -->
        <circle cx="95" cy="35" r="6" fill="#ffbe0b"/>
        <line x1="95" y1="35" x2="130" y2="45" stroke="#ffbe0b" stroke-width="1.5" stroke-dasharray="2 2"/>
        <circle cx="225" cy="85" r="6" fill="#ffbe0b"/>
        <line x1="225" y1="85" x2="190" y2="75" stroke="#ffbe0b" stroke-width="1.5" stroke-dasharray="2 2"/>
      </svg>
    `,
    options: [
      { letter: 'A', text: 'Um único computador gigante localizado no polo norte.', correct: false },
      { letter: 'B', text: 'Uma gigantesca rede mundial que interliga milhares de redes e servidores pelo planeta.', correct: true },
      { letter: 'C', text: 'Um programa de computador que só funciona desligado da tomada.', correct: false },
      { letter: 'D', text: 'Um tipo de bateria recarregável para celulares antigos.', correct: false }
    ],
    explanation: 'Perfeito! A Internet é uma enorme teia mundial de redes conectadas entre si, permitindo que qualquer pessoa acesse servidores, sites, vídeos e converse com pessoas de outros continentes.'
  },
  {
    id: 5,
    title: 'Pergunta 5: Compartilhamento em Rede',
    prompt: 'Qual das situações abaixo é um exemplo real de compartilhamento de recursos em uma rede de computadores?',
    illustrationSvg: `
      <svg viewBox="0 0 320 120" width="100%" height="100%">
        <!-- Computador 1 -->
        <rect x="30" y="25" width="50" height="35" rx="4" fill="#0d1e44" stroke="#00d2ff" stroke-width="2"/>
        <!-- Impressora Compartilhada no centro -->
        <g transform="translate(135, 30)">
          <rect x="0" y="10" width="50" height="30" rx="4" fill="#162c62" stroke="#ffbe0b" stroke-width="2"/>
          <rect x="10" y="0" width="30" height="10" fill="#ffffff" stroke="#94a3b8"/>
          <line x1="15" y1="20" x2="35" y2="20" stroke="#00f5d4" stroke-width="2"/>
        </g>
        <!-- Computador 2 -->
        <rect x="240" y="25" width="50" height="35" rx="4" fill="#0d1e44" stroke="#00d2ff" stroke-width="2"/>
        <!-- Conexões -->
        <line x1="80" y1="42" x2="135" y2="42" stroke="#00f5d4" stroke-width="2" stroke-dasharray="4 3"/>
        <line x1="185" y1="42" x2="240" y2="42" stroke="#00f5d4" stroke-width="2" stroke-dasharray="4 3"/>
        <text x="160" y="90" fill="#ffbe0b" font-size="11" font-family="sans-serif" text-anchor="middle" font-weight="bold">Impressora em Rede</text>
      </svg>
    `,
    options: [
      { letter: 'A', text: 'Dois computadores em salas diferentes imprimindo na mesma impressora conectada à rede.', correct: true },
      { letter: 'B', text: 'Usar uma caneta azul para escrever em um caderno de papel.', correct: false },
      { letter: 'C', text: 'Desligar o monitor do computador para economizar luz.', correct: false },
      { letter: 'D', text: 'Guardar um pendrive em uma gaveta trancada sem conectar em nenhum computador.', correct: false }
    ],
    explanation: 'Exatamente! Compartilhar uma impressora entre computadores da mesma rede é um clássico exemplo prático de colaboração e economia proporcionado pelas redes de computadores!'
  }
];

const QuizController = {
  currentIndex: 0,
  score: 0,
  correctCount: 0,
  selectedOptionIndex: null,
  isAnswerSubmitted: false,

  init() {
    this.currentIndex = 0;
    this.score = 0;
    this.correctCount = 0;
    this.selectedOptionIndex = null;
    this.isAnswerSubmitted = false;

    this.renderQuestion();
    this.bindActions();
  },

  renderQuestion() {
    const q = QUIZ_QUESTIONS[this.currentIndex];
    this.selectedOptionIndex = null;
    this.isAnswerSubmitted = false;

    // Atualiza contadores
    const counterPill = document.getElementById('quizCounterPill');
    const progressBar = document.getElementById('quizStepProgressBar');
    const promptText = document.getElementById('quizPrompt');
    const illustrationBox = document.getElementById('quizIllustration');
    const optionsContainer = document.getElementById('quizOptionsList');
    const feedbackBox = document.getElementById('quizFeedbackBox');
    const btnSubmit = document.getElementById('btnSubmitAnswer');
    const btnNext = document.getElementById('btnNextQuestion');

    if (counterPill) {
      counterPill.textContent = `Pergunta ${this.currentIndex + 1} de ${QUIZ_QUESTIONS.length}`;
    }

    if (progressBar) {
      const pct = ((this.currentIndex + 1) / QUIZ_QUESTIONS.length) * 100;
      progressBar.style.width = `${pct}%`;
    }

    if (promptText) {
      promptText.textContent = q.prompt;
    }

    if (illustrationBox) {
      illustrationBox.innerHTML = q.illustrationSvg;
    }

    if (feedbackBox) {
      feedbackBox.classList.remove('show', 'feedback-correct', 'feedback-wrong');
      feedbackBox.innerHTML = '';
    }

    if (btnSubmit) {
      btnSubmit.style.display = 'inline-flex';
      btnSubmit.disabled = true;
    }

    if (btnNext) {
      btnNext.style.display = 'none';
    }

    // Renderiza alternativas
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      q.options.forEach((opt, idx) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'quiz-option-item';
        item.setAttribute('data-index', idx);
        item.innerHTML = `
          <span class="quiz-option-letter">${opt.letter}</span>
          <span class="quiz-option-text">${opt.text}</span>
        `;

        item.addEventListener('click', () => {
          if (this.isAnswerSubmitted) return;
          this.selectOption(idx);
        });

        optionsContainer.appendChild(item);
      });
    }
  },

  selectOption(index) {
    this.selectedOptionIndex = index;
    const items = document.querySelectorAll('.quiz-option-item');
    items.forEach((item, idx) => {
      item.classList.toggle('selected', idx === index);
    });

    const btnSubmit = document.getElementById('btnSubmitAnswer');
    if (btnSubmit) {
      btnSubmit.disabled = false;
    }
  },

  submitAnswer() {
    if (this.selectedOptionIndex === null || this.isAnswerSubmitted) return;
    this.isAnswerSubmitted = true;

    const q = QUIZ_QUESTIONS[this.currentIndex];
    const chosen = q.options[this.selectedOptionIndex];
    const isCorrect = chosen.correct;

    const items = document.querySelectorAll('.quiz-option-item');
    items.forEach((item, idx) => {
      item.classList.add('disabled');
      if (q.options[idx].correct) {
        item.classList.add('state-correct');
      } else if (idx === this.selectedOptionIndex) {
        item.classList.add('state-wrong');
      }
    });

    const feedbackBox = document.getElementById('quizFeedbackBox');
    const btnSubmit = document.getElementById('btnSubmitAnswer');
    const btnNext = document.getElementById('btnNextQuestion');

    if (isCorrect) {
      this.score += 20;
      this.correctCount += 1;
      if (window.soundSystem) window.soundSystem.playCorrect();

      if (feedbackBox) {
        feedbackBox.classList.add('show', 'feedback-correct');
        feedbackBox.innerHTML = `
          <strong>🎉 Parabéns! Resposta Correta (+20 Pontos)</strong><br>
          ${q.explanation}
        `;
      }
    } else {
      if (window.soundSystem) window.soundSystem.playWrong();

      if (feedbackBox) {
        feedbackBox.classList.add('show', 'feedback-wrong');
        feedbackBox.innerHTML = `
          <strong>💡 Não foi desta vez, mas você aprendeu algo novo!</strong><br>
          ${q.explanation}
        `;
      }
    }

    if (btnSubmit) btnSubmit.style.display = 'none';
    if (btnNext) {
      btnNext.style.display = 'inline-flex';
      btnNext.focus();
    }
  },

  nextQuestion() {
    if (this.currentIndex + 1 < QUIZ_QUESTIONS.length) {
      this.currentIndex++;
      this.renderQuestion();
      if (window.soundSystem) window.soundSystem.playClick();
    } else {
      // Concluiu o Quiz! Salva pontuação
      if (window.StorageManager) {
        window.StorageManager.saveQuizResult(this.score, this.correctCount);
      }
      // Redireciona para o resultado
      window.location.href = 'resultado.html';
    }
  },

  bindActions() {
    const btnSubmit = document.getElementById('btnSubmitAnswer');
    const btnNext = document.getElementById('btnNextQuestion');

    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => this.submitAnswer());
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => this.nextQuestion());
    }
  }
};

window.QuizController = QuizController;

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('quizContainer')) {
    QuizController.init();
  }
});
