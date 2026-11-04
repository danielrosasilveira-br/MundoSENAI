/**
 * ==============================================================================
 * MUNDO SENAI - DASHBOARD ADMINISTRATIVO & BUSINESS INTELLIGENCE
 * ==============================================================================
 * Painel administrativo em tempo real com Chart.js, indicadores KPI,
 * filtros reativos, gráficos analíticos e tabela de resultados paginada,
 * compatível universalmente com protocolos file:// e http://.
 */

// Cursos oficiais do Mundo SENAI (9 áreas da Pergunta 10)
const CURSOS_SENAI = [
  "Alimentos",
  "Construção Civil",
  "Eletroeletrônica",
  "Faculdade SENAI",
  "Gestão",
  "Máquinas Agrícolas e Veículos Pesados",
  "Metalmecânica",
  "Segurança do Trabalho",
  "Tecnologia da Informação"
];

// Classificações oficiais
const CLASSIFICACOES = [
  "Explorador Digital Inicial",
  "Usuário Digital em Desenvolvimento",
  "Usuário Digital Conectado",
  "Protagonista Digital"
];

// Paleta de cores para gráficos
const CORES = {
  roxoProfundo: "#31005F",
  roxoTech: "#51008A",
  azulEletrico: "#0759D9",
  azulNeon: "#00A9FF",
  magenta: "#E83E87",
  rosaDestaque: "#FF397D",
  ciano: "#38D9FF",
  branco: "#FFFFFF",
  fundoEscuro: "#080D2C"
};

// Estado da aplicação do Dashboard
const estadoDashboard = {
  avaliacoesBrutas: {},
  avaliacoesFiltradas: [],
  instanciasGraficos: {},
  desinscreverObservador: null,
  filtros: {
    dataInicial: "",
    dataFinal: "",
    classificacao: "todas",
    curso: "todos",
    termoBusca: ""
  },
  tabela: {
    paginaAtual: 1,
    itensPorPagina: 10,
    colunaOrdenacao: 'dataCadastro',
    ordemAscendente: false
  }
};

/**
 * Inicialização do Dashboard (Acesso Livre / Público)
 */
async function inicializarDashboard() {
  configurarEventosUI();
  inicializarRotacaoPaginas();
  await iniciarMonitoramentoTempoReal();
}

/**
 * Inicia a escuta contínua de dados do Firebase com onValue()
 */
async function iniciarMonitoramentoTempoReal() {
  const badgeStatus = document.getElementById('badge-status-conexao');

  const atualizarBadgeStatus = (status) => {
    if (!badgeStatus) return;
    badgeStatus.className = 'badge-conexao';

    if (status === 'conectado') {
      badgeStatus.classList.add('conectado');
      badgeStatus.innerHTML = '<span class="ponto-pulsante"></span> Conectado ao Firebase';
    } else if (status === 'conectado-local') {
      badgeStatus.classList.add('conectado-local');
      badgeStatus.innerHTML = '<span class="ponto-pulsante verde"></span> Demonstração Ativa';
    } else if (status === 'atualizando') {
      badgeStatus.classList.add('atualizando');
      badgeStatus.innerHTML = '<span class="spinner-mini"></span> Atualizando informações...';
    } else {
      badgeStatus.classList.add('desconectado');
      badgeStatus.innerHTML = '<span class="ponto-estatico vermelho"></span> Desconectado do Firebase';
    }
  };

  if (estadoDashboard.desinscreverObservador) {
    estadoDashboard.desinscreverObservador();
  }

  const fnObservar = window.observarAvaliacoes || (typeof observarAvaliacoes === 'function' ? observarAvaliacoes : null);
  if (fnObservar) {
    estadoDashboard.desinscreverObservador = await fnObservar(
      (dados) => {
        estadoDashboard.avaliacoesBrutas = dados || {};
        aplicarFiltrosEAtualizarInterface();
      },
      (status) => {
        atualizarBadgeStatus(status);
      }
    );
  }
}

/**
 * Configura eventos dos filtros, tabela e busca
 */
function configurarEventosUI() {
  const inputDataInicio = document.getElementById('filtro-data-inicio');
  const inputDataFim = document.getElementById('filtro-data-fim');
  const selectClassificacao = document.getElementById('filtro-classificacao');
  const selectCurso = document.getElementById('filtro-curso');
  const btnLimpar = document.getElementById('btn-limpar-filtros');
  const inputBusca = document.getElementById('input-busca-tabela');
  const btnExportar = document.getElementById('btn-exportar-csv');

  if (selectCurso && selectCurso.children.length <= 1) {
    CURSOS_SENAI.forEach(curso => {
      const opt = document.createElement('option');
      opt.value = curso;
      opt.textContent = curso;
      selectCurso.appendChild(opt);
    });
  }

  const onChangeFiltro = () => {
    estadoDashboard.filtros.dataInicial = inputDataInicio ? inputDataInicio.value : "";
    estadoDashboard.filtros.dataFinal = inputDataFim ? inputDataFim.value : "";
    estadoDashboard.filtros.classificacao = selectClassificacao ? selectClassificacao.value : "todas";
    estadoDashboard.filtros.curso = selectCurso ? selectCurso.value : "todos";
    estadoDashboard.tabela.paginaAtual = 1;
    aplicarFiltrosEAtualizarInterface();
  };

  if (inputDataInicio) inputDataInicio.addEventListener('change', onChangeFiltro);
  if (inputDataFim) inputDataFim.addEventListener('change', onChangeFiltro);
  if (selectClassificacao) selectClassificacao.addEventListener('change', onChangeFiltro);
  if (selectCurso) selectCurso.addEventListener('change', onChangeFiltro);

  if (inputBusca) {
    inputBusca.addEventListener('input', (e) => {
      estadoDashboard.filtros.termoBusca = e.target.value.trim().toLowerCase();
      estadoDashboard.tabela.paginaAtual = 1;
      aplicarFiltrosEAtualizarInterface();
    });
  }

  if (btnLimpar) {
    btnLimpar.addEventListener('click', () => {
      if (inputDataInicio) inputDataInicio.value = "";
      if (inputDataFim) inputDataFim.value = "";
      if (selectClassificacao) selectClassificacao.value = "todas";
      if (selectCurso) selectCurso.value = "todos";
      if (inputBusca) inputBusca.value = "";

      estadoDashboard.filtros = {
        dataInicial: "",
        dataFinal: "",
        classificacao: "todas",
        curso: "todos",
        termoBusca: ""
      };
      estadoDashboard.tabela.paginaAtual = 1;
      aplicarFiltrosEAtualizarInterface();
    });
  }

  if (btnExportar) {
    btnExportar.addEventListener('click', exportarDadosCSV);
  }
}

/**
 * ==============================================================================
 * GERENCIADOR DE ROTAÇÃO AUTOMÁTICA DE PÁGINAS (30 SEGUNDOS - MODO APRESENTAÇÃO/TV)
 * ==============================================================================
 */
const GERENCIADOR_ROTACAO = {
  duracaoSegundos: 30,
  segundosRestantes: 30,
  paginaIndex: 0,
  pausado: false,
  timerId: null,
  paginas: [
    { id: 'pagina-kpis', titulo: 'Visão Geral & KPIs' },
    { id: 'pagina-cursos', titulo: 'Interesse em Cursos' },
    { id: 'pagina-maturidade', titulo: 'Maturidade Digital' }
  ]
};

function inicializarRotacaoPaginas() {
  const botoesMenu = document.querySelectorAll('.sidebar-nav .menu-link');
  const btnToggle = document.getElementById('btn-toggle-rotacao');
  const iconeBtn = document.getElementById('icone-btn-rotacao');
  const textoBtn = document.getElementById('texto-btn-rotacao');

  // Evento de clique direto nos links/botões da barra lateral
  botoesMenu.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      mudarPaginaDashboard(index);
    });
  });

  // Botão de Pausar / Retomar transição
  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
      GERENCIADOR_ROTACAO.pausado = !GERENCIADOR_ROTACAO.pausado;
      if (GERENCIADOR_ROTACAO.pausado) {
        if (iconeBtn) iconeBtn.textContent = '▶️';
        if (textoBtn) textoBtn.textContent = 'Retomar';
        btnToggle.style.borderColor = 'var(--rosa-destaque)';
      } else {
        if (iconeBtn) iconeBtn.textContent = '⏸️';
        if (textoBtn) textoBtn.textContent = 'Pausar';
        btnToggle.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      }
    });
  }

  // Botões de navegação direta entre as telas (◀ Anterior / Próxima ▶)
  const btnAnterior = document.getElementById('btn-pagina-anterior');
  const btnProxima = document.getElementById('btn-pagina-proxima');

  if (btnAnterior) {
    btnAnterior.addEventListener('click', () => {
      const total = GERENCIADOR_ROTACAO.paginas.length;
      const anteriorIndex = (GERENCIADOR_ROTACAO.paginaIndex - 1 + total) % total;
      mudarPaginaDashboard(anteriorIndex);
    });
  }

  if (btnProxima) {
    btnProxima.addEventListener('click', () => {
      const proximoIndex = (GERENCIADOR_ROTACAO.paginaIndex + 1) % GERENCIADOR_ROTACAO.paginas.length;
      mudarPaginaDashboard(proximoIndex);
    });
  }

  // Toque/Clique no card de rotação para avançar imediatamente para a próxima tela
  const cardRotacao = document.querySelector('.controle-rotacao-card');
  if (cardRotacao) {
    cardRotacao.style.cursor = 'pointer';
    cardRotacao.addEventListener('click', () => {
      const proximoIndex = (GERENCIADOR_ROTACAO.paginaIndex + 1) % GERENCIADOR_ROTACAO.paginas.length;
      mudarPaginaDashboard(proximoIndex);
    });
  }

  // Timer com contagem regressiva de 1 segundo
  if (GERENCIADOR_ROTACAO.timerId) {
    clearInterval(GERENCIADOR_ROTACAO.timerId);
  }

  GERENCIADOR_ROTACAO.timerId = setInterval(() => {
    if (GERENCIADOR_ROTACAO.pausado) return;

    GERENCIADOR_ROTACAO.segundosRestantes--;
    atualizarBarraProgressoRotacao();

    if (GERENCIADOR_ROTACAO.segundosRestantes <= 0) {
      const proximoIndex = (GERENCIADOR_ROTACAO.paginaIndex + 1) % GERENCIADOR_ROTACAO.paginas.length;
      mudarPaginaDashboard(proximoIndex);
    }
  }, 1000);

  // Inicializa na página 0 (Visão Geral & KPIs)
  mudarPaginaDashboard(0);
}

function atualizarBarraProgressoRotacao() {
  const elContagem = document.getElementById('timer-contagem');
  const elBarra = document.getElementById('rotacao-barra-progresso');

  if (elContagem) {
    elContagem.textContent = `${GERENCIADOR_ROTACAO.segundosRestantes}s`;
  }

  if (elBarra) {
    const decorrido = GERENCIADOR_ROTACAO.duracaoSegundos - GERENCIADOR_ROTACAO.segundosRestantes;
    const percentual = Math.min(100, Math.max(0, (decorrido / GERENCIADOR_ROTACAO.duracaoSegundos) * 100));
    elBarra.style.width = `${percentual}%`;
  }
}

function mudarPaginaDashboard(novoIndex) {
  GERENCIADOR_ROTACAO.paginaIndex = novoIndex;
  GERENCIADOR_ROTACAO.segundosRestantes = GERENCIADOR_ROTACAO.duracaoSegundos;

  atualizarBarraProgressoRotacao();

  // Atualiza identificação textual da tela ativa no controle superior
  const elNomePagina = document.getElementById('rotacao-nome-pagina');
  if (elNomePagina) {
    const titulosCurto = [
      'TELA 01 DE 03 • KPIS',
      'TELA 02 DE 03 • CURSOS',
      'TELA 03 DE 03 • MATURIDADE'
    ];
    elNomePagina.textContent = titulosCurto[novoIndex] || `TELA 0${novoIndex + 1} DE 03`;
  }

  // Ativa a tela selecionada e oculta as demais
  GERENCIADOR_ROTACAO.paginas.forEach((p, idx) => {
    const el = document.getElementById(p.id);
    if (el) {
      if (idx === novoIndex) {
        el.classList.add('ativa');
      } else {
        el.classList.remove('ativa');
      }
    }
  });

  // Atualiza destaque no menu lateral
  const botoesMenu = document.querySelectorAll('.sidebar-nav .menu-link');
  botoesMenu.forEach((btn, idx) => {
    if (idx === novoIndex) {
      btn.classList.add('ativo');
    } else {
      btn.classList.remove('ativo');
    }
  });

  // Notifica e redesenha os gráficos Chart.js com as dimensões reais visíveis da tela
  const sincronizarGraficos = () => {
    Object.values(estadoDashboard.instanciasGraficos).forEach(chart => {
      if (chart) {
        if (typeof chart.resize === 'function') {
          chart.resize();
        }
        if (typeof chart.update === 'function') {
          chart.update('none');
        }
      }
    });
  };

  requestAnimationFrame(sincronizarGraficos);
  setTimeout(sincronizarGraficos, 80);
  setTimeout(sincronizarGraficos, 250);
  setTimeout(sincronizarGraficos, 450);
}

/**
 * Filtra as avaliações de acordo com os filtros selecionados
 */
function filtrarAvaliacoes(avaliacoesObj, filtros) {
  const lista = [];

  for (const [id, item] of Object.entries(avaliacoesObj)) {
    if (!item) continue;
    const registro = { id, ...item };

    if (filtros.dataInicial) {
      const dataInicioTimestamp = new Date(filtros.dataInicial + 'T00:00:00').getTime();
      if (registro.dataCadastro < dataInicioTimestamp) continue;
    }

    if (filtros.dataFinal) {
      const dataFimTimestamp = new Date(filtros.dataFinal + 'T23:59:59').getTime();
      if (registro.dataCadastro > dataFimTimestamp) continue;
    }

    if (filtros.classificacao && filtros.classificacao !== 'todas') {
      if (registro.classificacao !== filtros.classificacao) continue;
    }

    if (filtros.curso && filtros.curso !== 'todos') {
      const cursoRegistro = registro.interesseProfissional?.curso || "";
      if (cursoRegistro !== filtros.curso) continue;
    }

    if (filtros.termoBusca) {
      const busca = filtros.termoBusca;
      const idMatch = id.toLowerCase().includes(busca);
      const classMatch = (registro.classificacao || "").toLowerCase().includes(busca);
      const cursoMatch = (registro.interesseProfissional?.curso || "").toLowerCase().includes(busca);
      if (!idMatch && !classMatch && !cursoMatch) continue;
    }

    lista.push(registro);
  }

  return lista;
}

/**
 * Aplica os filtros, recalcula métricas e atualiza todos os componentes
 */
function aplicarFiltrosEAtualizarInterface() {
  const filtradas = filtrarAvaliacoes(estadoDashboard.avaliacoesBrutas, estadoDashboard.filtros);
  estadoDashboard.avaliacoesFiltradas = filtradas;

  atualizarIndicadoresPrincipais(filtradas);
  atualizarGraficoClassificacao(filtradas);
  atualizarGraficoDistribuicaoPontuacao(filtradas);
  atualizarGraficoPontuacaoPorPergunta(filtradas);
  atualizarGraficoEvolucao(filtradas);
  atualizarGraficoInteresseCursos(filtradas);
  atualizarGraficoDistribuicaoRespostas(filtradas);
}

/**
 * 7.1 Indicadores principais (Cards)
 */
function atualizarIndicadoresPrincipais(avaliacoes) {
  const elTotal = document.getElementById('kpi-total-avaliacoes');
  const elMedia = document.getElementById('kpi-media-pontuacao');
  const elAproveitamento = document.getElementById('kpi-aproveitamento-medio');
  const elClassPredominante = document.getElementById('kpi-classificacao-predominante');
  const elMaiorPontuacao = document.getElementById('kpi-maior-pontuacao');

  // Novos elementos de KPIs
  const elCursoMaisVotado = document.getElementById('kpi-curso-mais-votado');
  const elCursoMaisVotadoSub = document.getElementById('kpi-curso-mais-votado-sub');
  const elProtagonistasQtd = document.getElementById('kpi-protagonistas-qtd');
  const elProtagonistasSub = document.getElementById('kpi-protagonistas-sub');
  const elTaxaConectados = document.getElementById('kpi-taxa-conectados');
  const elTaxaConectadosSub = document.getElementById('kpi-taxa-conectados-sub');
  const elMelhorCompetencia = document.getElementById('kpi-melhor-competencia');
  const elMelhorCompetenciaSub = document.getElementById('kpi-melhor-competencia-sub');

  const total = avaliacoes.length;

  if (total === 0) {
    if (elTotal) elTotal.textContent = "0";
    if (elMedia) elMedia.textContent = "0.0 pts";
    if (elAproveitamento) elAproveitamento.textContent = "0.0%";
    if (elClassPredominante) elClassPredominante.textContent = "Nenhuma";
    if (elMaiorPontuacao) elMaiorPontuacao.textContent = "0 / 27";
    if (elCursoMaisVotado) elCursoMaisVotado.textContent = "-";
    if (elCursoMaisVotadoSub) elCursoMaisVotadoSub.textContent = "0 votos (0%)";
    if (elProtagonistasQtd) elProtagonistasQtd.textContent = "0";
    if (elProtagonistasSub) elProtagonistasSub.textContent = "0% dos participantes";
    if (elTaxaConectados) elTaxaConectados.textContent = "0.0%";
    if (elTaxaConectadosSub) elTaxaConectadosSub.textContent = "0 participantes";
    if (elMelhorCompetencia) elMelhorCompetencia.textContent = "-";
    if (elMelhorCompetenciaSub) elMelhorCompetenciaSub.textContent = "Maior pontuação média";
    return;
  }

  let somaPontos = 0;
  let somaPercentual = 0;
  let maiorPonto = 0;
  const contagemClassificacoes = {};
  const contagemCursos = {};
  CURSOS_SENAI.forEach(c => { contagemCursos[c] = 0; });

  const nomesCompetencias = [
    "Uso de Dispositivos",
    "Internet & Conexão",
    "Uso de Aplicativos",
    "Inteligência Artificial",
    "Segurança & Senhas",
    "Aprendizado Digital",
    "Produtividade Digital",
    "Resolução de Problemas",
    "Inovação & Futuro"
  ];
  const somasPerguntas = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  avaliacoes.forEach(a => {
    const pontos = Number(a.pontuacaoTotal) || 0;
    const perc = Number(a.percentual) || 0;
    somaPontos += pontos;
    somaPercentual += perc;
    if (pontos > maiorPonto) maiorPonto = pontos;

    const c = a.classificacao || "Outro";
    contagemClassificacoes[c] = (contagemClassificacoes[c] || 0) + 1;

    // Contagem de cursos escolhidos
    const curso = a.interesseProfissional?.curso;
    if (curso && contagemCursos[curso] !== undefined) {
      contagemCursos[curso]++;
    }

    // Soma de perguntas para competência destaque
    if (a.respostas) {
      for (let i = 1; i <= 9; i++) {
        const resp = a.respostas[`pergunta0${i}`];
        if (resp && typeof resp.pontuacao === 'number') {
          somasPerguntas[i - 1] += resp.pontuacao;
        }
      }
    }
  });

  const mediaPontos = (somaPontos / total).toFixed(1);
  const mediaPerc = (somaPercentual / total).toFixed(1);

  // Classificação predominante
  let classPredominante = "Nenhuma";
  let maxOcorrencias = -1;
  for (const [classe, qtd] of Object.entries(contagemClassificacoes)) {
    if (qtd > maxOcorrencias) {
      maxOcorrencias = qtd;
      classPredominante = classe;
    }
  }

  // Curso mais escolhido
  let cursoLider = { nome: "Nenhum", qtd: 0 };
  for (const [curso, qtd] of Object.entries(contagemCursos)) {
    if (qtd > cursoLider.qtd) {
      cursoLider = { nome: curso, qtd };
    }
  }
  const percCursoLider = total > 0 ? ((cursoLider.qtd / total) * 100).toFixed(1) : "0";

  // Protagonistas Digitais (Nível Máximo)
  const qtdProtagonistas = contagemClassificacoes["Protagonista Digital"] || 0;
  const percProtagonistas = ((qtdProtagonistas / total) * 100).toFixed(1);

  // Alta Conexão Digital (Conectado + Protagonista >= 14 pts)
  const qtdAltaConexao = (contagemClassificacoes["Usuário Digital Conectado"] || 0) + qtdProtagonistas;
  const percAltaConexao = ((qtdAltaConexao / total) * 100).toFixed(1);

  // Competência com maior média
  let melhorComp = { nome: "Nenhuma", media: -1 };
  for (let i = 0; i < 9; i++) {
    const mediaPergunta = somasPerguntas[i] / total;
    if (mediaPergunta > melhorComp.media) {
      melhorComp = { nome: nomesCompetencias[i], media: mediaPergunta };
    }
  }

  if (elTotal) elTotal.textContent = total.toLocaleString('pt-BR');
  if (elMedia) elMedia.textContent = `${mediaPontos} pts`;
  if (elAproveitamento) elAproveitamento.textContent = `${mediaPerc}%`;
  if (elClassPredominante) elClassPredominante.textContent = classPredominante;
  if (elMaiorPontuacao) elMaiorPontuacao.textContent = `${maiorPonto} / 27`;

  // Atualização dos 4 novos cards de KPI
  if (elCursoMaisVotado) elCursoMaisVotado.textContent = cursoLider.nome;
  if (elCursoMaisVotadoSub) elCursoMaisVotadoSub.textContent = `${cursoLider.qtd} votos (${percCursoLider}%)`;

  if (elProtagonistasQtd) elProtagonistasQtd.textContent = `${qtdProtagonistas}`;
  if (elProtagonistasSub) elProtagonistasSub.textContent = `${percProtagonistas}% dos participantes`;

  if (elTaxaConectados) elTaxaConectados.textContent = `${percAltaConexao}%`;
  if (elTaxaConectadosSub) elTaxaConectadosSub.textContent = `${qtdAltaConexao} de ${total} participantes`;

  if (elMelhorCompetencia) elMelhorCompetencia.textContent = melhorComp.nome;
  if (elMelhorCompetenciaSub) elMelhorCompetenciaSub.textContent = `Média: ${melhorComp.media.toFixed(1)} / 3.0 pts`;
}

/**
 * 7.2 Gráfico de Distribuição por Classificação (Doughnut)
 */
function atualizarGraficoClassificacao(avaliacoes) {
  const canvas = document.getElementById('grafico-classificacao');
  if (!canvas || !window.Chart) return;

  const contagem = {
    "Explorador Digital Inicial": 0,
    "Usuário Digital em Desenvolvimento": 0,
    "Usuário Digital Conectado": 0,
    "Protagonista Digital": 0
  };

  avaliacoes.forEach(a => {
    if (contagem[a.classificacao] !== undefined) {
      contagem[a.classificacao]++;
    }
  });

  const dados = [
    contagem["Explorador Digital Inicial"],
    contagem["Usuário Digital em Desenvolvimento"],
    contagem["Usuário Digital Conectado"],
    contagem["Protagonista Digital"]
  ];

  // Cores de alto contraste e distinção imediata para cada nível de maturidade:
  // 1. Explorador Digital Inicial: Azul Elétrico (#0759D9)
  // 2. Usuário Digital em Desenvolvimento: Ciano Neon (#00E5FF)
  // 3. Usuário Digital Conectado: Roxo / Violeta Neon (#9D4EDD)
  // 4. Protagonista Digital: Rosa Choque / Magenta Destaque (#FF397D)
  const coresClassificacao = [
    '#0759D9',
    '#00E5FF',
    '#9D4EDD',
    '#FF397D'
  ];

  if (estadoDashboard.instanciasGraficos.classificacao) {
    estadoDashboard.instanciasGraficos.classificacao.data.datasets[0].data = dados;
    estadoDashboard.instanciasGraficos.classificacao.data.datasets[0].backgroundColor = coresClassificacao;
    estadoDashboard.instanciasGraficos.classificacao.update();
    return;
  }

  estadoDashboard.instanciasGraficos.classificacao = new window.Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: Object.keys(contagem),
      datasets: [{
        data: dados,
        backgroundColor: coresClassificacao,
        borderColor: '#080D2C',
        borderWidth: 3,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#FFFFFF',
            font: { family: 'Inter', size: (typeof window !== 'undefined' && window.innerWidth < 640) ? 9.5 : 10.5, weight: 600 },
            padding: (typeof window !== 'undefined' && window.innerWidth < 640) ? 6 : 8,
            boxWidth: 10,
            usePointStyle: true,
            pointStyle: 'rectRounded'
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const val = ctx.raw || 0;
              const perc = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
              return ` ${ctx.label}: ${val} (${perc}%)`;
            }
          }
        }
      },
      cutout: '58%'
    }
  });
}

/**
 * 7.3 Gráfico de Distribuição de Pontuação (Barra)
 */
function atualizarGraficoDistribuicaoPontuacao(avaliacoes) {
  const canvas = document.getElementById('grafico-distribuicao-pontuacao');
  if (!canvas || !window.Chart) return;

  const faixas = {
    "0 a 6 pts": 0,
    "7 a 13 pts": 0,
    "14 a 20 pts": 0,
    "21 a 27 pts": 0
  };

  avaliacoes.forEach(a => {
    const p = Number(a.pontuacaoTotal) || 0;
    if (p <= 6) faixas["0 a 6 pts"]++;
    else if (p <= 13) faixas["7 a 13 pts"]++;
    else if (p <= 20) faixas["14 a 20 pts"]++;
    else faixas["21 a 27 pts"]++;
  });

  const labels = Object.keys(faixas);
  const dados = Object.values(faixas);

  if (estadoDashboard.instanciasGraficos.pontuacao) {
    estadoDashboard.instanciasGraficos.pontuacao.data.datasets[0].data = dados;
    estadoDashboard.instanciasGraficos.pontuacao.update();
    return;
  }

  estadoDashboard.instanciasGraficos.pontuacao = new window.Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Participantes',
        data: dados,
        backgroundColor: 'rgba(0, 169, 255, 0.75)',
        borderColor: '#00A9FF',
        borderWidth: 2,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.06)' },
          ticks: { color: '#E0E7FF', font: { family: 'Inter' } }
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.06)' },
          ticks: { precision: 0, color: '#E0E7FF', font: { family: 'Inter' } }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

/**
 * 7.4 Gráfico de Pontuação Média por Pergunta (Barras Horizontais)
 */
function atualizarGraficoPontuacaoPorPergunta(avaliacoes) {
  const canvas = document.getElementById('grafico-pontuacao-pergunta');
  if (!canvas || !window.Chart) return;

  const total = avaliacoes.length;
  const labels = [
    "P1. Dispositivos",
    "P2. Uso Internet",
    "P3. Aplicativos",
    "P4. Inteligência Art.",
    "P5. Segurança",
    "P6. Aprendizagem",
    "P7. Produtividade",
    "P8. Solução Probl.",
    "P9. Transf. Digital"
  ];

  const somas = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  avaliacoes.forEach(a => {
    if (!a.respostas) return;
    for (let i = 1; i <= 9; i++) {
      const pId = `pergunta0${i}`;
      const resp = a.respostas[pId];
      if (resp && typeof resp.pontuacao === 'number') {
        somas[i - 1] += resp.pontuacao;
      }
    }
  });

  const medias = somas.map(s => (total > 0 ? Number((s / total).toFixed(2)) : 0));

  if (estadoDashboard.instanciasGraficos.perguntas) {
    estadoDashboard.instanciasGraficos.perguntas.data.datasets[0].data = medias;
    estadoDashboard.instanciasGraficos.perguntas.update();
    return;
  }

  estadoDashboard.instanciasGraficos.perguntas = new window.Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Média de Pontos (0 a 3)',
        data: medias,
        backgroundColor: 'rgba(56, 217, 255, 0.75)',
        borderColor: '#38D9FF',
        borderWidth: 2,
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          min: 0,
          max: 3,
          grid: { color: 'rgba(255, 255, 255, 0.06)' },
          ticks: { color: '#E0E7FF', stepSize: 0.5, font: { family: 'Inter' } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.06)' },
          ticks: { 
            color: '#E0E7FF', 
            font: { 
              family: 'Inter', 
              size: (typeof window !== 'undefined' && window.innerWidth < 640) ? 9.5 : 11 
            } 
          }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

/**
 * 7.5 Gráfico de Evolução Temporal das Avaliações (Linha)
 */
function atualizarGraficoEvolucao(avaliacoes) {
  const canvas = document.getElementById('grafico-evolucao');
  if (!canvas || !window.Chart) return;

  const agrupamentoPorDia = {};

  avaliacoes.forEach(a => {
    if (!a.dataCadastro) return;
    const dataObj = new Date(a.dataCadastro);
    const chaveDia = dataObj.toLocaleDateString('pt-BR');
    agrupamentoPorDia[chaveDia] = (agrupamentoPorDia[chaveDia] || 0) + 1;
  });

  const labels = Object.keys(agrupamentoPorDia);
  const dados = Object.values(agrupamentoPorDia);

  if (labels.length === 0) {
    labels.push(new Date().toLocaleDateString('pt-BR'));
    dados.push(0);
  }

  if (estadoDashboard.instanciasGraficos.evolucao) {
    estadoDashboard.instanciasGraficos.evolucao.data.labels = labels;
    estadoDashboard.instanciasGraficos.evolucao.data.datasets[0].data = dados;
    estadoDashboard.instanciasGraficos.evolucao.update();
    return;
  }

  estadoDashboard.instanciasGraficos.evolucao = new window.Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Avaliações Diárias',
        data: dados,
        borderColor: '#FF397D',
        backgroundColor: 'rgba(255, 57, 125, 0.18)',
        fill: true,
        tension: 0.35,
        borderWidth: 3,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#FF397D',
        pointRadius: 5,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.06)' },
          ticks: { color: '#E0E7FF', font: { family: 'Inter' } }
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.06)' },
          ticks: { precision: 0, color: '#E0E7FF', font: { family: 'Inter' } }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

/**
 * 7.6 GRÁFICO ESPECIAL – INTERESSE NOS CURSOS DO SENAI (9 Categorias)
 */
function atualizarGraficoInteresseCursos(avaliacoes) {
  const canvas = document.getElementById('grafico-cursos-senai');
  const elCursoMaisEscolhido = document.getElementById('kpi-curso-mais-escolhido');
  const elPercentualMaisEscolhido = document.getElementById('kpi-perc-mais-escolhido');

  if (!canvas || !window.Chart) return;

  const total = avaliacoes.length;
  const contagemCursos = {};
  CURSOS_SENAI.forEach(c => contagemCursos[c] = 0);

  avaliacoes.forEach(a => {
    const c = a.interesseProfissional?.curso;
    if (c && contagemCursos[c] !== undefined) {
      contagemCursos[c]++;
    }
  });

  const dados = CURSOS_SENAI.map(c => contagemCursos[c]);

  let maisEscolhido = { curso: "Nenhum", qtd: -1 };

  CURSOS_SENAI.forEach(c => {
    const qtd = contagemCursos[c];
    if (qtd > maisEscolhido.qtd) {
      maisEscolhido = { curso: c, qtd };
    }
  });

  const percMais = total > 0 ? ((maisEscolhido.qtd / total) * 100).toFixed(1) : 0;

  if (elCursoMaisEscolhido) elCursoMaisEscolhido.textContent = maisEscolhido.curso;
  if (elPercentualMaisEscolhido) elPercentualMaisEscolhido.textContent = `${maisEscolhido.qtd} votos (${percMais}%)`;

  const coresBarras = CURSOS_SENAI.map(c => {
    if (c === maisEscolhido.curso && maisEscolhido.qtd > 0) {
      return '#FF397D';
    }
    return 'rgba(7, 89, 217, 0.75)';
  });

  const coresBordas = CURSOS_SENAI.map(c => {
    if (c === maisEscolhido.curso && maisEscolhido.qtd > 0) {
      return '#FFFFFF';
    }
    return '#38D9FF';
  });

  if (estadoDashboard.instanciasGraficos.cursos) {
    estadoDashboard.instanciasGraficos.cursos.data.datasets[0].data = dados;
    estadoDashboard.instanciasGraficos.cursos.data.datasets[0].backgroundColor = coresBarras;
    estadoDashboard.instanciasGraficos.cursos.data.datasets[0].borderColor = coresBordas;
    estadoDashboard.instanciasGraficos.cursos.update();
    return;
  }

  estadoDashboard.instanciasGraficos.cursos = new window.Chart(canvas, {
    type: 'bar',
    data: {
      labels: CURSOS_SENAI,
      datasets: [{
        label: 'Visitantes Interessados',
        data: dados,
        backgroundColor: coresBarras,
        borderColor: coresBordas,
        borderWidth: 2,
        borderRadius: 8
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.06)' },
          ticks: { precision: 0, color: '#E0E7FF', font: { family: 'Inter' } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.06)' },
          ticks: { color: '#FFFFFF', font: { family: 'Inter', weight: 600, size: 12 } }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const val = ctx.raw || 0;
              const perc = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
              return ` ${val} participantes (${perc}% de interesse)`;
            }
          }
        }
      }
    }
  });
}

/**
 * 7.7 Gráfico de Distribuição de Respostas por Alternativa (A, B, C, D)
 */
function atualizarGraficoDistribuicaoRespostas(avaliacoes) {
  const canvas = document.getElementById('grafico-distribuicao-respostas');
  if (!canvas || !window.Chart) return;

  const labels = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9"];
  const contagem = {
    A: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    B: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    C: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    D: [0, 0, 0, 0, 0, 0, 0, 0, 0]
  };

  avaliacoes.forEach(a => {
    if (!a.respostas) return;
    for (let i = 1; i <= 9; i++) {
      const resp = a.respostas[`pergunta0${i}`];
      if (resp && resp.alternativa && contagem[resp.alternativa]) {
        contagem[resp.alternativa][i - 1]++;
      }
    }
  });

  if (estadoDashboard.instanciasGraficos.respostas) {
    estadoDashboard.instanciasGraficos.respostas.data.datasets[0].data = contagem.A;
    estadoDashboard.instanciasGraficos.respostas.data.datasets[1].data = contagem.B;
    estadoDashboard.instanciasGraficos.respostas.data.datasets[2].data = contagem.C;
    estadoDashboard.instanciasGraficos.respostas.data.datasets[3].data = contagem.D;
    estadoDashboard.instanciasGraficos.respostas.update();
    return;
  }

  estadoDashboard.instanciasGraficos.respostas = new window.Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'Alt. A (0 pt)', data: contagem.A, backgroundColor: '#51008A', borderRadius: 4 },
        { label: 'Alt. B (1 pt)', data: contagem.B, backgroundColor: '#0759D9', borderRadius: 4 },
        { label: 'Alt. C (2 pts)', data: contagem.C, backgroundColor: '#00A9FF', borderRadius: 4 },
        { label: 'Alt. D (3 pts)', data: contagem.D, backgroundColor: '#FF397D', borderRadius: 4 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          grid: { color: 'rgba(255, 255, 255, 0.06)' },
          ticks: { color: '#E0E7FF', font: { family: 'Inter' } }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.06)' },
          ticks: { precision: 0, color: '#E0E7FF', font: { family: 'Inter' } }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#E0E7FF', font: { family: 'Inter', size: 11 } }
        }
      }
    }
  });
}

// Inicialização automática compatível
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarDashboard);
  } else {
    inicializarDashboard();
  }
}

// Exportações globais para navegadores
if (typeof window !== 'undefined') {
  window.CURSOS_SENAI = CURSOS_SENAI;
  window.CLASSIFICACOES = CLASSIFICACOES;
  window.filtrarAvaliacoes = filtrarAvaliacoes;
  window.inicializarDashboard = inicializarDashboard;
}

// Compatibilidade Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CURSOS_SENAI,
    CLASSIFICACOES,
    filtrarAvaliacoes,
    inicializarDashboard
  };
}
