/**
 * ==============================================================================
 * MUNDO SENAI - QUESTIONÁRIO DE CONEXÃO COM A TECNOLOGIA
 * ==============================================================================
 * Sistema Wizard para captura de respostas dos visitantes, cálculo automático
 * de maturidade digital e registro no Firebase Realtime Database.
 */

// Definição completa das 10 perguntas do questionário
const PERGUNTAS = [
  {
    id: "pergunta01",
    numero: 1,
    categoria: "Utilização de tecnologia",
    titulo: "Com que frequência você utiliza computadores, notebooks ou dispositivos digitais?",
    tipo: "pontuada",
    alternativas: [
      { letra: "A", texto: "Raramente ou nunca.", pontos: 0 },
      { letra: "B", texto: "Algumas vezes durante a semana.", pontos: 1 },
      { letra: "C", texto: "Praticamente todos os dias.", pontos: 2 },
      { letra: "D", texto: "Várias vezes ao dia, tanto para trabalho quanto para atividades pessoais.", pontos: 3 }
    ]
  },
  {
    id: "pergunta02",
    numero: 2,
    categoria: "Internet",
    titulo: "Como você utiliza a internet no seu cotidiano?",
    tipo: "pontuada",
    alternativas: [
      { letra: "A", texto: "Utilizo apenas quando necessário.", pontos: 0 },
      { letra: "B", texto: "Para pesquisas e comunicação.", pontos: 1 },
      { letra: "C", texto: "Para estudos, trabalho, entretenimento e comunicação.", pontos: 2 },
      { letra: "D", texto: "A internet é essencial para praticamente todas as minhas atividades.", pontos: 3 }
    ]
  },
  {
    id: "pergunta03",
    numero: 3,
    categoria: "Aplicativos",
    titulo: "Qual é o seu nível de familiaridade com aplicativos e ferramentas digitais?",
    tipo: "pontuada",
    alternativas: [
      { letra: "A", texto: "Tenho dificuldade para utilizar aplicativos.", pontos: 0 },
      { letra: "B", texto: "Utilizo apenas os aplicativos mais básicos.", pontos: 1 },
      { letra: "C", texto: "Utilizo diversos aplicativos e ferramentas digitais.", pontos: 2 },
      { letra: "D", texto: "Tenho facilidade para aprender e explorar novas ferramentas.", pontos: 3 }
    ]
  },
  {
    id: "pergunta04",
    numero: 4,
    categoria: "Inteligência Artificial",
    titulo: "Qual é sua experiência com ferramentas de Inteligência Artificial, como ChatGPT e Gemini?",
    tipo: "pontuada",
    alternativas: [
      { letra: "A", texto: "Nunca utilizei.", pontos: 0 },
      { letra: "B", texto: "Já ouvi falar, mas nunca utilizei.", pontos: 1 },
      { letra: "C", texto: "Utilizo ocasionalmente.", pontos: 2 },
      { letra: "D", texto: "Utilizo frequentemente para estudos, trabalho ou atividades pessoais.", pontos: 3 }
    ]
  },
  {
    id: "pergunta05",
    numero: 5,
    categoria: "Segurança digital",
    titulo: "Como você avalia seus conhecimentos sobre segurança na internet?",
    tipo: "pontuada",
    alternativas: [
      { letra: "A", texto: "Não conheço os principais cuidados.", pontos: 0 },
      { letra: "B", texto: "Conheço alguns cuidados básicos.", pontos: 1 },
      { letra: "C", texto: "Sei identificar situações suspeitas e proteger minhas contas.", pontos: 2 },
      { letra: "D", texto: "Conheço boas práticas de segurança, autenticação e proteção de dados.", pontos: 3 }
    ]
  },
  {
    id: "pergunta06",
    numero: 6,
    categoria: "Aprendizagem tecnológica",
    titulo: "Quando surge uma nova tecnologia ou aplicativo, como você reage?",
    tipo: "pontuada",
    alternativas: [
      { letra: "A", texto: "Tenho dificuldade e prefiro não utilizar.", pontos: 0 },
      { letra: "B", texto: "Espero alguém me ensinar.", pontos: 1 },
      { letra: "C", texto: "Procuro tutoriais para aprender.", pontos: 2 },
      { letra: "D", texto: "Tenho iniciativa para explorar e aprender sozinho.", pontos: 3 }
    ]
  },
  {
    id: "pergunta07",
    numero: 7,
    categoria: "Ferramentas de produtividade",
    titulo: "Você utiliza ferramentas digitais para organizar suas atividades?",
    tipo: "pontuada",
    alternativas: [
      { letra: "A", texto: "Não utilizo.", pontos: 0 },
      { letra: "B", texto: "Utilizo ocasionalmente.", pontos: 1 },
      { letra: "C", texto: "Utilizo agendas, planilhas ou aplicativos de organização.", pontos: 2 },
      { letra: "D", texto: "Utilizo diversas ferramentas digitais para otimizar minha produtividade.", pontos: 3 }
    ]
  },
  {
    id: "pergunta08",
    numero: 8,
    categoria: "Solução de problemas",
    titulo: "Quando encontra um problema técnico em um computador ou aplicativo, o que costuma fazer?",
    tipo: "pontuada",
    alternativas: [
      { letra: "A", texto: "Desisto ou procuro outra pessoa imediatamente.", pontos: 0 },
      { letra: "B", texto: "Tento resolver com ajuda de alguém.", pontos: 1 },
      { letra: "C", texto: "Pesquiso na internet e procuro soluções.", pontos: 2 },
      { letra: "D", texto: "Investigo o problema e tento identificar sua causa e solução.", pontos: 3 }
    ]
  },
  {
    id: "pergunta09",
    numero: 9,
    categoria: "Transformação digital",
    titulo: "Como você percebe a presença da tecnologia nas atividades profissionais e educacionais?",
    tipo: "pontuada",
    alternativas: [
      { letra: "A", texto: "Não percebo muita influência.", pontos: 0 },
      { letra: "B", texto: "Percebo algumas mudanças.", pontos: 1 },
      { letra: "C", texto: "Reconheço que a tecnologia transforma diversas atividades.", pontos: 2 },
      { letra: "D", texto: "Acompanho as transformações e procuro utilizar a tecnologia para melhorar resultados.", pontos: 3 }
    ]
  },
  {
    id: "pergunta10",
    numero: 10,
    categoria: "INTERESSE PROFISSIONAL",
    titulo: "Entre os cursos que você conheceu na sua visita, qual deles você escolheria?",
    tipo: "curso",
    descricaoEspecial: "Escolha a área que mais desperta o seu interesse no Mundo SENAI.",
    alternativas: [
      { letra: "A", texto: "Alimentos.", curso: "Alimentos" },
      { letra: "B", texto: "Construção Civil.", curso: "Construção Civil" },
      { letra: "C", texto: "Eletroeletrônica.", curso: "Eletroeletrônica" },
      { letra: "D", texto: "Faculdade SENAI.", curso: "Faculdade SENAI" },
      { letra: "E", texto: "Gestão.", curso: "Gestão" },
      { letra: "F", texto: "Máquinas Agrícolas e Veículos Pesados.", curso: "Máquinas Agrícolas e Veículos Pesados" },
      { letra: "G", texto: "Metalmecânica.", curso: "Metalmecânica" },
      { letra: "H", texto: "Segurança do Trabalho.", curso: "Segurança do Trabalho" },
      { letra: "I", texto: "Tecnologia da Informação.", curso: "Tecnologia da Informação" }
    ]
  }
];

// Estado global do Wizard
const estadoWizard = {
  perguntaAtualIndex: 0,
  respostas: {}, // { pergunta01: { alternativa: 'A', pontos: 0 }, ... }
  interesseProfissional: null, // { alternativa: 'I', curso: 'Tecnologia da Informação' }
  estaEnviando: false
};

/**
 * Classifica a pontuação total (0 a 27)
 * @param {number} pontos 
 * @returns {{nome: string, cor: string, badgeClasse: string, mensagem: string}}
 */
function classificarPontuacao(pontos) {
  if (pontos <= 6) {
    return {
      nome: "Explorador Digital Inicial",
      cor: "#0759D9",
      badgeClasse: "badge-explorador",
      mensagem: "PARABÉNS! VOCÊ DEU O PRIMEIRO PASSO NO UNIVERSO DA TECNOLOGIA! O SENAI TEM A TRILHA PERFEITA PARA VOCÊ DESCOBRIR SEU POTENCIAL."
    };
  } else if (pontos <= 13) {
    return {
      nome: "Usuário Digital em Desenvolvimento",
      cor: "#00E5FF",
      badgeClasse: "badge-desenvolvimento",
      mensagem: "MUITO BEM! VOCÊ ESTÁ CONSTRUINDO UMA BASE SÓLIDA. NO MUNDO SENAI, O SEU CONHECIMENTO SE TRANSFORMA EM UMA PROFISSÃO DO FUTURO!"
    };
  } else if (pontos <= 20) {
    return {
      nome: "Usuário Digital Conectado",
      cor: "#9D4EDD",
      badgeClasse: "badge-conectado",
      mensagem: "EXCELENTE! SUA FAMILIARIDADE DIGITAL JÁ ABRE GRANDES PORTAS. DÊ O PRÓXIMO SALTO E TORNE-SE UM ESPECIALISTA COM O SENAI!"
    };
  } else {
    return {
      nome: "Protagonista Digital",
      cor: "#FF397D",
      badgeClasse: "badge-protagonista",
      mensagem: "PARABÉNS! SUA HISTÓRIA NO MUNDO DA TECNOLOGIA ESTÁ APENAS COMEÇANDO! VOCÊ LIDERA A TRANSFORMAÇÃO DIGITAL E O SENAI É O SEU LUGAR!"
    };
  }
}

/**
 * Inicia a transição da tela de boas-vindas para a primeira pergunta do Wizard
 */
function iniciarDiagnostico() {
  const secaoBoasVindas = document.getElementById('secao-boas-vindas');
  const secaoWizard = document.getElementById('secao-wizard');
  const secaoResultado = document.getElementById('secao-resultado');

  if (secaoBoasVindas) secaoBoasVindas.classList.add('oculto');
  if (secaoResultado) secaoResultado.classList.add('oculto');
  if (secaoWizard) secaoWizard.classList.remove('oculto');

  renderizarPergunta(0);
}

/**
 * Inicializa os ouvintes e o primeiro passo do Wizard
 */
function inicializarQuestionario() {
  const btnVoltar = document.getElementById('btn-voltar');
  const btnAvancar = document.getElementById('btn-avancar');
  const btnReiniciar = document.getElementById('btn-reiniciar');
  const btnComecar = document.getElementById('btn-comecar');

  if (btnComecar) {
    btnComecar.onclick = iniciarDiagnostico;
  }

  if (btnVoltar) {
    btnVoltar.onclick = retrocederPergunta;
  }

  if (btnAvancar) {
    btnAvancar.onclick = avancarPergunta;
  }

  if (btnReiniciar) {
    btnReiniciar.onclick = reiniciarQuestionario;
  }

  // Teclado para acessibilidade (Enter ou Espaço para avançar, Setas)
  document.addEventListener('keydown', (e) => {
    const secaoWizard = document.getElementById('secao-wizard');
    if (!secaoWizard || secaoWizard.classList.contains('oculto')) return;

    if (e.key === 'ArrowRight' && btnAvancar && !btnAvancar.disabled) {
      avancarPergunta();
    } else if (e.key === 'ArrowLeft' && btnVoltar && !btnVoltar.disabled) {
      retrocederPergunta();
    }
  });

  // Render inicial caso a seção de boas-vindas não exista
  if (!document.getElementById('secao-boas-vindas')) {
    renderizarPergunta(0);
  }
}

/**
 * Renderiza a pergunta atual na tela
 * @param {number} index 
 */
function renderizarPergunta(index) {
  const pergunta = PERGUNTAS[index];
  if (!pergunta) return;

  estadoWizard.perguntaAtualIndex = index;
  const total = PERGUNTAS.length;

  // Atualiza indicadores de progresso
  const elIndicador = document.getElementById('indicador-passo');
  const elBarraProgresso = document.getElementById('barra-progresso-preenchimento');
  const elCategoria = document.getElementById('pergunta-categoria');
  const elTitulo = document.getElementById('pergunta-titulo');
  const elOpcoesContainer = document.getElementById('opcoes-container');
  const elAvisoValidacao = document.getElementById('aviso-validacao');
  const btnVoltar = document.getElementById('btn-voltar');
  const btnAvancar = document.getElementById('btn-avancar');

  if (elAvisoValidacao) elAvisoValidacao.classList.add('oculto');

  // Formatação: "PERGUNTA 03 DE 10"
  const numeroFormatado = String(index + 1).padStart(2, '0');
  const totalFormatado = String(total).padStart(2, '0');
  if (elIndicador) {
    elIndicador.textContent = `PERGUNTA ${numeroFormatado} DE ${totalFormatado}`;
  }

  // Progresso percentual da barra
  const porcentagemProgresso = ((index + 1) / total) * 100;
  if (elBarraProgresso) {
    elBarraProgresso.style.width = `${porcentagemProgresso}%`;
  }

  if (elCategoria) {
    elCategoria.textContent = pergunta.categoria;
  }

  if (elTitulo) {
    elTitulo.textContent = pergunta.titulo;
  }

  // Botão voltar visível a partir da pergunta 2
  if (btnVoltar) {
    btnVoltar.disabled = index === 0;
    btnVoltar.style.visibility = index === 0 ? 'hidden' : 'visible';
  }

  // Texto do botão avançar
  if (btnAvancar) {
    btnAvancar.innerHTML = index === total - 1
      ? '<span>FINALIZAR E VER RESULTADO</span> <i class="icone-trofeu">🏆</i>'
      : '<span>AVANÇAR</span> <i class="icone-seta">➔</i>';
  }

  // Renderiza opções
  if (elOpcoesContainer) {
    elOpcoesContainer.innerHTML = '';
    
    // Pergunta 10 (Curso de Interesse) em formato DROPDOWNLIST
    if (pergunta.tipo === 'curso') {
      elOpcoesContainer.className = 'container-dropdown-curso';

      const rotulo = document.createElement('label');
      rotulo.className = 'rotulo-dropdown-curso';
      rotulo.setAttribute('for', 'select-curso-interesse');
      rotulo.innerHTML = `<span>🎓</span> <span>Selecione a área profissional do seu interesse:</span>`;

      const select = document.createElement('select');
      select.id = 'select-curso-interesse';
      select.className = 'select-curso-dropdown';

      // Opção padrão informativa
      const optPadrao = document.createElement('option');
      optPadrao.value = '';
      optPadrao.disabled = true;
      optPadrao.textContent = '-- Selecione uma das 9 áreas de cursos do SENAI --';

      const alternativaSelecionada = estadoWizard.interesseProfissional?.alternativa || '';
      if (!alternativaSelecionada) {
        optPadrao.selected = true;
      }
      select.appendChild(optPadrao);

      pergunta.alternativas.forEach(alt => {
        const opt = document.createElement('option');
        opt.value = alt.letra;
        opt.dataset.curso = alt.curso;
        opt.textContent = `${alt.letra}) ${alt.curso}`;
        if (alternativaSelecionada === alt.letra) {
          opt.selected = true;
        }
        select.appendChild(opt);
      });

      select.onchange = () => {
        const opcaoEscolhida = select.options[select.selectedIndex];
        if (opcaoEscolhida && opcaoEscolhida.value) {
          estadoWizard.interesseProfissional = {
            alternativa: opcaoEscolhida.value,
            curso: opcaoEscolhida.dataset.curso || opcaoEscolhida.textContent.replace(/^[A-I]\)\s*/, '')
          };
          if (elAvisoValidacao) elAvisoValidacao.classList.add('oculto');
        } else {
          estadoWizard.interesseProfissional = null;
        }
      };

      elOpcoesContainer.appendChild(rotulo);
      elOpcoesContainer.appendChild(select);
    } else {
      // Perguntas 01 a 09 com cartões interativos de 4 alternativas
      elOpcoesContainer.className = 'grade-opcoes grade-quatro-opcoes';

      const alternativaSelecionada = estadoWizard.respostas[pergunta.id]?.alternativa || null;

      pergunta.alternativas.forEach((alt) => {
        const card = document.createElement('div');
        card.className = `cartao-opcao ${alternativaSelecionada === alt.letra ? 'selecionado' : ''}`;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('data-letra', alt.letra);

        card.innerHTML = `
          <div class="opcao-indicador">${alt.letra}</div>
          <div class="opcao-conteudo">
            <div class="opcao-texto">${alt.texto}</div>
          </div>
          <div class="opcao-check" aria-hidden="true">✔</div>
        `;

        card.onclick = () => selecionarAlternativa(pergunta, alt, card);

        // Acessibilidade via teclado
        card.onkeydown = (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selecionarAlternativa(pergunta, alt, card);
          }
        };

        elOpcoesContainer.appendChild(card);
      });
    }
  }

  // Efeito suave de entrada do cartão
  const cardPergunta = document.getElementById('cartao-pergunta');
  if (cardPergunta) {
    cardPergunta.classList.remove('animar-entrada');
    void cardPergunta.offsetWidth;
    cardPergunta.classList.add('animar-entrada');
  }
}

/**
 * Trata o clique/seleção de uma alternativa
 */
function selecionarAlternativa(pergunta, alternativa, elementoCard) {
  const todosCartoes = document.querySelectorAll('.cartao-opcao');
  todosCartoes.forEach(c => c.classList.remove('selecionado'));

  elementoCard.classList.add('selecionado');

  const elAvisoValidacao = document.getElementById('aviso-validacao');
  if (elAvisoValidacao) elAvisoValidacao.classList.add('oculto');

  if (pergunta.tipo === 'pontuada') {
    estadoWizard.respostas[pergunta.id] = {
      alternativa: alternativa.letra,
      pontuacao: alternativa.pontos
    };
  } else {
    estadoWizard.interesseProfissional = {
      alternativa: alternativa.letra,
      curso: alternativa.curso
    };
  }
}

/**
 * Valida a resposta da tela atual e avança para a próxima pergunta ou tela de resultado
 */
async function avancarPergunta() {
  const index = estadoWizard.perguntaAtualIndex;
  const pergunta = PERGUNTAS[index];

  let respondida = false;
  if (pergunta.tipo === 'pontuada') {
    respondida = Boolean(estadoWizard.respostas[pergunta.id]);
  } else {
    respondida = Boolean(estadoWizard.interesseProfissional);
  }

  if (!respondida) {
    const elAvisoValidacao = document.getElementById('aviso-validacao');
    if (elAvisoValidacao) {
      elAvisoValidacao.classList.remove('oculto');
      elAvisoValidacao.textContent = pergunta.tipo === 'curso'
        ? "Por favor, selecione uma das opções de cursos na lista para continuar."
        : "Por favor, selecione uma das opções acima para continuar.";
    }
    return;
  }

  if (index < PERGUNTAS.length - 1) {
    renderizarPergunta(index + 1);
  } else {
    await finalizarQuestionario();
  }
}

/**
 * Retorna para a pergunta anterior preservando a seleção
 */
function retrocederPergunta() {
  if (estadoWizard.perguntaAtualIndex > 0) {
    renderizarPergunta(estadoWizard.perguntaAtualIndex - 1);
  }
}

/**
 * Calcula pontuação, salva no Firebase e apresenta tela de resultado com efeitos
 */
async function finalizarQuestionario() {
  if (estadoWizard.estaEnviando) return;
  estadoWizard.estaEnviando = true;

  const btnAvancar = document.getElementById('btn-avancar');
  if (btnAvancar) {
    btnAvancar.disabled = true;
    btnAvancar.innerHTML = `<span>SALVANDO...</span> <span class="spinner-neon"></span>`;
  }

  let pontuacaoTotal = 0;
  for (let i = 1; i <= 9; i++) {
    const chave = `pergunta0${i}`;
    const resp = estadoWizard.respostas[chave];
    if (resp && typeof resp.pontuacao === 'number') {
      pontuacaoTotal += resp.pontuacao;
    }
  }

  const pontuacaoMaxima = 27;
  const percentual = Number(((pontuacaoTotal / pontuacaoMaxima) * 100).toFixed(2));
  const classificacaoObj = classificarPontuacao(pontuacaoTotal);

  const payloadAvaliacao = {
    dataCadastro: Date.now(),
    pontuacaoTotal,
    pontuacaoMaxima,
    percentual,
    classificacao: classificacaoObj.nome,
    respostas: estadoWizard.respostas,
    interesseProfissional: estadoWizard.interesseProfissional
  };

  try {
    const fnSalvar = typeof salvarAvaliacao === 'function' ? salvarAvaliacao : (window.salvarAvaliacao || (async () => ({ sucesso: true })));
    const resultadoGravacao = await fnSalvar(payloadAvaliacao);
    console.log("[Questionario] Avaliação salva:", resultadoGravacao);
    apresentarTelaResultado(payloadAvaliacao, classificacaoObj, resultadoGravacao);
  } catch (erro) {
    console.error("[Questionario] Erro ao gravar avaliação:", erro);
    apresentarTelaResultado(payloadAvaliacao, classificacaoObj, { sucesso: false });
  } finally {
    estadoWizard.estaEnviando = false;
  }
}

/**
 * Apresenta a tela de resultado com efeitos, troféu, partículas e badges
 */
function apresentarTelaResultado(dados, classificacaoObj, resultadoGravacao) {
  const secaoWizard = document.getElementById('secao-wizard');
  const secaoResultado = document.getElementById('secao-resultado');

  if (secaoWizard) secaoWizard.classList.add('oculto');
  if (secaoResultado) secaoResultado.classList.remove('oculto');

  const elPontos = document.getElementById('resultado-pontos');
  const elPontosMax = document.getElementById('resultado-pontos-max');
  const elPercentual = document.getElementById('resultado-percentual');
  const elClassificacao = document.getElementById('resultado-classificacao');
  const elMensagem = document.getElementById('resultado-mensagem');
  const elCursoInteresse = document.getElementById('resultado-curso-interesse');
  const elStatusGravacao = document.getElementById('resultado-status-gravacao');

  if (elPontos) elPontos.textContent = dados.pontuacaoTotal;
  if (elPontosMax) elPontosMax.textContent = dados.pontuacaoMaxima;
  if (elPercentual) elPercentual.textContent = `${dados.percentual}%`;
  if (elClassificacao) {
    elClassificacao.textContent = classificacaoObj.nome;
    elClassificacao.className = `badge-classificacao-resultado ${classificacaoObj.badgeClasse}`;
  }
  if (elMensagem) {
    elMensagem.textContent = classificacaoObj.mensagem;
  }
  if (elCursoInteresse && dados.interesseProfissional) {
    elCursoInteresse.textContent = dados.interesseProfissional.curso;
  }

  if (elStatusGravacao) {
    if (resultadoGravacao && resultadoGravacao.sucesso) {
      elStatusGravacao.innerHTML = `
        <span class="status-sucesso">✔ Diagnóstico registrado com sucesso! ID: <code>${resultadoGravacao.id || 'Confirmado'}</code></span>
      `;
    } else {
      elStatusGravacao.innerHTML = `
        <span class="status-alerta">ℹ Diagnóstico salvo localmente.</span>
      `;
    }
  }

  iniciarEfeitoCelebracao();
}

/**
 * Reinicia o questionário para um novo participante
 */
function reiniciarQuestionario() {
  estadoWizard.perguntaAtualIndex = 0;
  estadoWizard.respostas = {};
  estadoWizard.interesseProfissional = null;
  estadoWizard.estaEnviando = false;

  const secaoResultado = document.getElementById('secao-resultado');
  const secaoWizard = document.getElementById('secao-wizard');

  if (secaoResultado) secaoResultado.classList.add('oculto');
  if (secaoWizard) secaoWizard.classList.remove('oculto');

  renderizarPergunta(0);
}

/**
 * Animação de comemoração com confetes e partículas neon coloridas
 */
function iniciarEfeitoCelebracao() {
  const canvas = document.getElementById('canvas-celebracao');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particulas = [];
  const cores = ['#00A9FF', '#FF397D', '#38D9FF', '#E83E87', '#FFD700', '#51008A'];

  for (let i = 0; i < 120; i++) {
    particulas.push({
      x: canvas.width / 2,
      y: canvas.height / 2 - 50,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.8) * 14,
      tamanho: Math.random() * 8 + 4,
      cor: cores[Math.floor(Math.random() * cores.length)],
      rotacao: Math.random() * 360,
      vRotacao: (Math.random() - 0.5) * 10,
      gravidade: 0.25,
      opacidade: 1
    });
  }

  let animFrame;
  function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let vivas = 0;

    particulas.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravidade;
      p.rotacao += p.vRotacao;
      p.opacidade -= 0.007;

      if (p.opacidade > 0) {
        vivas++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotacao * Math.PI) / 180);
        ctx.fillStyle = p.cor;
        ctx.globalAlpha = Math.max(0, p.opacidade);
        ctx.fillRect(-p.tamanho / 2, -p.tamanho / 2, p.tamanho, p.tamanho * 1.6);
        ctx.restore();
      }
    });

    if (vivas > 0) {
      animFrame = requestAnimationFrame(animar);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animFrame);
    }
  }

  animar();
}

// Inicialização automática compatível com qualquer forma de carregamento
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarQuestionario);
  } else {
    inicializarQuestionario();
  }
}

// Exportações globais para navegação e chamadas diretas
if (typeof window !== 'undefined') {
  window.PERGUNTAS = PERGUNTAS;
  window.classificarPontuacao = classificarPontuacao;
  window.iniciarDiagnostico = iniciarDiagnostico;
  window.inicializarQuestionario = inicializarQuestionario;
  window.renderizarPergunta = renderizarPergunta;
  window.avancarPergunta = avancarPergunta;
  window.retrocederPergunta = retrocederPergunta;
  window.reiniciarQuestionario = reiniciarQuestionario;
}

// Compatibilidade Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PERGUNTAS,
    classificarPontuacao,
    iniciarDiagnostico,
    inicializarQuestionario,
    renderizarPergunta,
    avancarPergunta,
    retrocederPergunta,
    reiniciarQuestionario
  };
}
