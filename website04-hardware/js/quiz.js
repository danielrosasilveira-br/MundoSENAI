/**
 * ===================================================================
 * MISSÃO HARDWARE — AVENTURA DENTRO DO COMPUTADOR
 * js/quiz.js — Mecânica da Arena do Conhecimento
 * 5 Questões Sorteadas, Alternativas Embaralhadas com IDs Estáveis,
 * 2 Pontos por Acerto (0 a 10 Total), Sem Punição por Erro
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('quiz-app');
  if (!container) return;

  // Embaralha um array de forma imutável (Fisher-Yates)
  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Prepara 5 questões da base
  const allBank = window.HARDWARE_QUESTIONS || [];
  if (allBank.length < 5) {
    container.innerHTML = '<p>Banco de questões insuficiente.</p>';
    return;
  }

  const selectedQuestions = shuffleArray(allBank).slice(0, 5).map(q => ({
    ...q,
    options: shuffleArray(q.options)
  }));

  let currentIndex = 0;
  let score = 0;
  let correctCount = 0;
  let answeredCurrent = false;

  function renderQuestion() {
    answeredCurrent = false;
    const currentQ = selectedQuestions[currentIndex];
    const letters = ['A', 'B', 'C', 'D'];

    container.innerHTML = `
      <div class="quiz-hud-header">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 1.4rem;">🎯</span>
          <div>
            <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--turquesa); font-weight: 700;">Arena do Conhecimento</span>
            <h2 style="font-size: 1.15rem; color: #FFFFFF;">Missão de Verificação</h2>
          </div>
        </div>
        <div style="text-align: right;">
          <div class="indicador" style="font-size: 1.2rem; color: var(--verde-lima);">
            Questão ${currentIndex + 1} de 5
          </div>
          <div style="font-size: 0.8rem; color: #D4E0D7;">Valendo 2 pontos</div>
        </div>
      </div>

      <div class="quiz-card" role="region" aria-label="Questão ${currentIndex + 1}">
        <p class="question-text">${currentQ.question}</p>

        <div class="quiz-options-list" role="radiogroup" aria-label="Alternativas">
          ${currentQ.options.map((opt, idx) => `
            <button 
              type="button" 
              class="quiz-option-btn" 
              data-opt-id="${opt.id}" 
              data-is-correct="${opt.correct}"
              aria-checked="false"
              role="radio"
            >
              <span class="opt-letter">${letters[idx]}</span>
              <span class="opt-text">${opt.text}</span>
            </button>
          `).join('')}
        </div>

        <div id="quiz-feedback" class="quiz-feedback-box" aria-live="polite"></div>

        <div style="margin-top: 1.75rem; display: flex; justify-content: flex-end; gap: 1rem;">
          <button id="btn-confirm-answer" class="btn btn-primary btn-lima" disabled>
            Confirmar Resposta
          </button>
          <button id="btn-next-question" class="btn btn-turquesa" style="display: none;">
            ${currentIndex < 4 ? 'Próxima Questão ➔' : 'Ver Resultado Final 🏆'}
          </button>
        </div>
      </div>
    `;

    // Lógica de seleção de alternativas
    let selectedOptionBtn = null;
    const optionBtns = container.querySelectorAll('.quiz-option-btn');
    const confirmBtn = container.querySelector('#btn-confirm-answer');
    const nextBtn = container.querySelector('#btn-next-question');
    const feedbackBox = container.querySelector('#quiz-feedback');

    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (answeredCurrent) return;
        if (window.soundEngine) window.soundEngine.playClick();

        optionBtns.forEach(b => {
          b.classList.remove('selected');
          b.setAttribute('aria-checked', 'false');
        });

        btn.classList.add('selected');
        btn.setAttribute('aria-checked', 'true');
        selectedOptionBtn = btn;
        confirmBtn.disabled = false;
      });
    });

    // Confirmação da resposta
    confirmBtn.addEventListener('click', () => {
      if (!selectedOptionBtn || answeredCurrent) return;
      answeredCurrent = true;
      confirmBtn.style.display = 'none';
      nextBtn.style.display = 'inline-flex';
      nextBtn.focus();

      const isCorrect = selectedOptionBtn.getAttribute('data-is-correct') === 'true';

      optionBtns.forEach(b => {
        b.disabled = true;
        if (b.getAttribute('data-is-correct') === 'true') {
          b.classList.add('correct');
        } else if (b === selectedOptionBtn && !isCorrect) {
          b.classList.add('incorrect');
        }
      });

      if (isCorrect) {
        score += 2;
        correctCount += 1;
        if (window.soundEngine) window.soundEngine.playCorrect();
        feedbackBox.className = 'quiz-feedback-box show feedback-correct';
        feedbackBox.innerHTML = `
          <strong style="color: var(--cor-sucesso); display: flex; align-items: center; gap: 0.4rem; font-size: 1.1rem; margin-bottom: 0.4rem;">
            ✓ Resposta Exata! (+2 Pontos)
          </strong>
          <p style="margin: 0;">${currentQ.explanation}</p>
        `;
      } else {
        if (window.soundEngine) window.soundEngine.playError();
        feedbackBox.className = 'quiz-feedback-box show feedback-incorrect';
        feedbackBox.innerHTML = `
          <strong style="color: var(--cor-erro); display: flex; align-items: center; gap: 0.4rem; font-size: 1.1rem; margin-bottom: 0.4rem;">
            ℹ️ Não foi desta vez, mas você está aprendendo!
          </strong>
          <p style="margin: 0;">${currentQ.explanation}</p>
        `;
      }
    });

    // Próxima questão ou conclusão
    nextBtn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playClick();
      if (currentIndex < 4) {
        currentIndex++;
        renderQuestion();
      } else {
        // Salva resultado e vai para a tela de conquistas
        if (window.StorageService) {
          window.StorageService.saveQuizResult(score, correctCount, 5);
        }
        window.location.href = 'resultado.html';
      }
    });
  }

  renderQuestion();
});

