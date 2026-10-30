/**
 * WEBSITE 04 — HARDWARE DO COMPUTADOR INTERATIVO (js/hardware.js)
 * Diagrama Interativo do Gabinete, Simulador de Execução, Comparador e PC Builder.
 * 100% Vanilla JavaScript puro.
 */

(function () {
  'use strict';

  // 1. Dados dos Componentes do Gabinete Aberto
  const HARDWARE_COMPONENTS = {
    cpu: {
      name: 'Processador (CPU)',
      category: 'Unidade Central de Processamento',
      icon: '🧠',
      func: 'Executa todas as instruções dos programas, cálculos lógicos e aritméticos e coordena os demais componentes do sistema.',
      howItWorks: 'Opera em ciclos de clock por segundo (GHz), buscando instruções na memória, decodificando-as na Unidade de Controle e executando na ULA (Unidade Lógica e Aritmética).',
      specs: 'Frequência de clock (GHz), quantidade de núcleos (Cores), Threads, memória Cache L1/L2/L3 e TDP (potência térmica).',
      example: 'Determina a agilidade na compilação de código, renderização e processamento multitarefa.',
      relation: 'Instalado diretamente no soquete da placa-mãe e coberto pelo cooler para refrigeração térmica.'
    },
    motherboard: {
      name: 'Placa-Mãe (Motherboard)',
      category: 'Plataforma de Interconexão Principal',
      icon: '🎛️',
      func: 'Circuito impresso que interliga fisicamente e logicamente todos os componentes do computador.',
      howItWorks: 'Possui barramentos de cobre gravados em múltiplas camadas, chipset de controle de entradas/saídas e circuitos reguladores de tensão (VRM).',
      specs: 'Fator de forma (ATX, Micro-ATX, Mini-ITX), soquete do processador, versão do PCIe e portas traseiras.',
      example: 'Define quais processadores e memórias são suportados pelo seu computador.',
      relation: 'Aloja a CPU, slots de memória RAM, barramentos PCIe para a placa de vídeo e conectores SATA/M.2.'
    },
    ram: {
      name: 'Memória RAM',
      category: 'Memória Principal Volátil',
      icon: '⚡',
      func: 'Armazena temporariamente os programas em execução e os dados que o processador precisa acessar imediatamente.',
      howItWorks: 'Utiliza células capacitivas ultrarrápidas de semicondutores. Perde todos os dados armazenados quando o computador é desligado (volatilidade).',
      specs: 'Capacidade (GB), geração (DDR4 / DDR5), frequência (MHz/MT/s) e latência CAS (CL).',
      example: 'Permite manter dezenas de abas do navegador e ambientes de desenvolvimento (IDEs) abertos simultaneamente sem lentidão.',
      relation: 'Comunica-se em alta velocidade com a CPU através do controlador de memória integrado no processador.'
    },
    ssd: {
      name: 'SSD M.2 NVMe',
      category: 'Armazenamento Secundário Não Volátil',
      icon: '💾',
      func: 'Grava permanentemente o sistema operacional, softwares e arquivos do usuário em chips de memória flash.',
      howItWorks: 'Utiliza memória Flash NAND sem peças móveis, conectando-se diretamente às pistas PCIe da CPU com protocolo NVMe.',
      specs: 'Capacidade (GB/TB), protocolo (NVMe PCIe 4.0/5.0) e velocidades de leitura/escrita (ex: 7.000 MB/s).',
      example: 'Faz o Windows ou Linux inicializar em menos de 10 segundos e programas abrirem instantaneamente.',
      relation: 'Alimentado pela placa-mãe através do slot M.2 com dissipador térmico metálico.'
    },
    hdd: {
      name: 'Disco Rígido (HDD)',
      category: 'Armazenamento Magnético Mecânico',
      icon: '💿',
      func: 'Armazenamento em massa de baixo custo por gigabyte para backups, arquivos frios e grandes volumes de dados.',
      howItWorks: 'Discos magnéticos girando em alta rotação (5400 ou 7200 RPM) lidos por cabeçotes mecânicos móveis.',
      specs: 'Capacidade (TB), RPM (rotações por minuto), tamanho do buffer e interface SATA III (6 Gbps).',
      example: 'Ideal para armazenamento de bibliotecas de vídeos, imagens de máquinas virtuais e arquivos de longo prazo.',
      relation: 'Conectado à placa-mãe por cabo de dados SATA e à fonte por cabo de alimentação SATA de 15 pinos.'
    },
    gpu: {
      name: 'Placa de Vídeo Dedicada (GPU)',
      category: 'Processamento Gráfico e Paralelo',
      icon: '🎮',
      func: 'Processa cálculos gráficos complexos, renderização 3D, aceleração de Inteligência Artificial e gera imagem para os monitores.',
      howItWorks: 'Contém milhares de pequenos núcleos otimizados para cálculo paralelo vetorial simultâneo e memória VRAM dedicada.',
      specs: 'Arquitetura gráfica, quantidade de memória VRAM (GDDR6), largura do barramento e conexões HDMI/DisplayPort.',
      example: 'Essencial para desenvolvimento de jogos, modelagem CAD 3D, edição de vídeo e treinamento de modelos de IA.',
      relation: 'Encaixada no slot PCIe x16 mais próximo da CPU e alimentada por cabos PCIe de 8 ou 16 pinos da fonte.'
    },
    psu: {
      name: 'Fonte de Alimentação (PSU)',
      category: 'Conversão e Distribuição de Energia',
      icon: '🔌',
      func: 'Converte a corrente alternada (AC) da tomada (110V/220V) em correntes contínuas (DC) estáveis de +12V, +5V e +3.3V.',
      howItWorks: 'Usa transformadores, capacitores de alta voltagem e filtros para regular a energia e proteger contra sobrecargas.',
      specs: 'Potência nominal (Watts), certificação de eficiência (80 Plus Bronze/Gold) e padrão ATX.',
      example: 'Garante que os circuitos sensíveis da placa-mãe e da GPU recebam voltagem estável sem queimar.',
      relation: 'Distribui cabos de alimentação para a placa-mãe (24 pinos), CPU (EPS 8 pinos), GPU e discos.'
    },
    cooler: {
      name: 'Cooler da CPU (Air/Water Cooler)',
      category: 'Dissipação Térmica do Processador',
      icon: '❄️',
      func: 'Dissipa o calor intenso gerado pelo processador durante a execução de cálculos pesados.',
      howItWorks: 'Heatpipes de cobre conduzem o calor da superfície da CPU até aletas de alumínio, onde ventoinhas forçam o fluxo de ar fresco.',
      specs: 'TDP suportado em Watts, tamanho do radiador (120mm, 240mm, 360mm) e nível de ruído em decibéis (dBA).',
      example: 'Impede o estrangulamento térmico (thermal throttling) e desligamentos por superaquecimento.',
      relation: 'Fixado com pasta térmica de alta condutividade diretamente sobre o espalhador de calor (IHS) da CPU.'
    },
    fans: {
      name: 'Ventoinhas do Chassi (Fans)',
      category: 'Fluxo de Ar do Gabinete (Airflow)',
      icon: '💨',
      func: 'Garantem a circulação de ar fresco para dentro do gabinete (admissão) e expelem o ar quente acumulado (exaustão).',
      howItWorks: 'Motores elétricos com controle PWM ajustam a rotação conforme a temperatura interna dos sensores da placa-mãe.',
      specs: 'Diâmetro (120mm ou 140mm), fluxo de ar (CFM), pressão estática e iluminação ARGB.',
      example: 'Evita a formação de "bolsões de ar quente" sobre a placa de vídeo e os módulos de memória RAM.',
      relation: 'Conectadas aos conectores SYS_FAN de 4 pinos da placa-mãe para monitoramento de RPM.'
    },
    cables: {
      name: 'Barramentos e Cabos de Conexão',
      category: 'Vias de Dados e Alimentação',
      icon: '🔗',
      func: 'Condutores físicos que transportam energia elétrica e sinais de dados em alta velocidade entre os componentes.',
      howItWorks: 'Fios trançados de cobre com isolamento plástico e travas mecânicas para evitar desconexões acidentais.',
      specs: 'Bitola dos fios (AWG), conectores padronizados ATX e blindagem eletromagnética.',
      example: 'Permite o gerenciamento de cabos (cable management) para manter o visual limpo e o fluxo de ar desimpedido.',
      relation: 'Conectam a fonte aos circuitos e interligam botões do painel frontal à placa-mãe.'
    }
  };

  // 2. Etapas do Simulador de Execução ("Abrindo um Programa")
  const EXECUTION_STEPS = [
    {
      step: 1,
      title: '1. O Usuário Solicita a Abertura do Programa',
      icon: '🖱️',
      desc: 'O usuário clica duas vezes no ícone de um software (como um editor de código ou jogo). O Sistema Operacional intercepta a solicitação e consulta o diretório onde o arquivo executável está localizado.',
      highlight: 'cpu'
    },
    {
      step: 2,
      title: '2. Localização dos Arquivos no Armazenamento',
      icon: '💾',
      desc: 'O Sistema Operacional envia um comando de leitura para a controladora do SSD NVMe ou HDD. O dispositivo localiza os blocos físicos de dados onde o código compilado e os recursos estão gravados.',
      highlight: 'ssd'
    },
    {
      step: 3,
      title: '3. Carregamento para a Memória RAM',
      icon: '⚡',
      desc: 'Os arquivos executáveis, bibliotecas dinâmicas (.dll / .so) e dados iniciais são transferidos do armazenamento para a memória RAM. Isso é necessário porque a RAM é dezenas de vezes mais rápida que o disco.',
      highlight: 'ram'
    },
    {
      step: 4,
      title: '4. CPU Busca, Decodifica e Executa as Instruções',
      icon: '🧠',
      desc: 'O processador inicia o ciclo de busca (fetch-decode-execute). As instruções mais frequentes são guardadas no Cache L1/L2/L3 e a ULA realiza os cálculos lógicos para inicializar o software.',
      highlight: 'cpu'
    },
    {
      step: 5,
      title: '5. GPU Assume a Renderização Visual',
      icon: '🎮',
      desc: 'Se o programa possui interface gráfica ou elementos 3D, a CPU envia primitivas de desenho (draw calls) para a GPU. A placa de vídeo processa texturas, shaders e vetores na memória VRAM.',
      highlight: 'gpu'
    },
    {
      step: 6,
      title: '6. Apresentação do Resultado na Tela',
      icon: '🖥️',
      desc: 'O frame buffer final da GPU envia o sinal digital via cabo DisplayPort ou HDMI para o monitor. O usuário agora visualiza a janela do programa aberta e pronta para interação!',
      highlight: 'motherboard'
    }
  ];

  // 3. Dados do Comparador de Componentes
  const COMPARISONS_DATA = {
    storage: {
      title: 'HDD (Disco Rígido) vs. SSD (Unidade de Estado Sólido)',
      col1Title: 'Disco Rígido (HDD)',
      col1Points: [
        '<strong>Funcionamento:</strong> Pratos magnéticos mecânicos girando a 5400 ou 7200 RPM.',
        '<strong>Velocidade:</strong> Leitura sequencial típica entre 100 e 200 MB/s.',
        '<strong>Latência:</strong> Alta (10 a 15 milissegundos) devido à movimentação física da agulha.',
        '<strong>Resistência Física:</strong> Sensível a quedas e choques mecânicos.',
        '<strong>Custo por GB:</strong> Muito baixo, excelente para armazenamento em massa de múltiplos terabytes.'
      ],
      col2Title: 'Unidade de Estado Sólido (SSD)',
      col2Points: [
        '<strong>Funcionamento:</strong> Chips semicondutores de memória Flash NAND sem peças móveis.',
        '<strong>Velocidade:</strong> Até 550 MB/s em SATA e até 7.500 MB/s em SSDs NVMe PCIe 4.0.',
        '<strong>Latência:</strong> Quase instantânea (menos de 0.1 milissegundos).',
        '<strong>Resistência Física:</strong> Alta imunidade a vibrações e impactos moderados.',
        '<strong>Silêncio:</strong> Operação totalmente silenciosa e menor consumo de energia.'
      ]
    },
    memory: {
      title: 'Memória RAM vs. Armazenamento Secundário',
      col1Title: 'Memória RAM',
      col1Points: [
        '<strong>Volatilidade:</strong> Volátil — perde todo o conteúdo ao desligar o computador.',
        '<strong>Velocidade:</strong> Altíssima (larguras de banda superiores a 50.000 MB/s).',
        '<strong>Função:</strong> Espaço de trabalho imediato para o processador enquanto o PC está ligado.',
        '<strong>Capacidade Típica:</strong> 8 GB a 64 GB em computadores pessoais.'
      ],
      col2Title: 'Armazenamento (SSD / HDD)',
      col2Points: [
        '<strong>Volatilidade:</strong> Não volátil — preserva os dados com segurança sem energia.',
        '<strong>Velocidade:</strong> Menor que a RAM, mas suficiente para transferir grandes arquivos.',
        '<strong>Função:</strong> Guardar permanentemente o Windows, fotos, vídeos e programas.',
        '<strong>Capacidade Típica:</strong> 500 GB a 4.000 GB (4 TB).'
      ]
    },
    processors: {
      title: 'Processador (CPU) vs. Placa de Vídeo (GPU)',
      col1Title: 'Processador Central (CPU)',
      col1Points: [
        '<strong>Arquitetura:</strong> Poucos núcleos (ex: 4 a 24 núcleos) com altíssima velocidade e grande cache.',
        '<strong>Especialização:</strong> Execução sequencial rápida, tomada de decisões lógicas complexas e multitarefa variada.',
        '<strong>Analogia:</strong> Como um pequeno grupo de gênios matemáticos resolvendo equações sequenciais intricadas.'
      ],
      col2Title: 'Processador Gráfico (GPU)',
      col2Points: [
        '<strong>Arquitetura:</strong> Milhares de núcleos menores operando em paralelismo maciço.',
        '<strong>Especialização:</strong> Cálculos matriciais repetitivos de pixels, vértices 3D e tensores de Inteligência Artificial.',
        '<strong>Analogia:</strong> Como um exército de milhares de soldados executando operações idênticas simultaneamente.'
      ]
    },
    cooling: {
      title: 'Refrigeração a Ar (Air Cooler) vs. Refrigeração Líquida (Water Cooler)',
      col1Title: 'Air Cooler (Refrigeração a Ar)',
      col1Points: [
        '<strong>Mecanismo:</strong> Tubos condutores de cobre (heatpipes), aletas de alumínio e ventoinhas.',
        '<strong>Manutenção:</strong> Praticamente nula (basta retirar poeira das aletas). Sem risco de vazamento de fluído.',
        '<strong>Custo:</strong> Geralmente mais acessível e altamente confiável a longo prazo.'
      ],
      col2Title: 'Water Cooler (Refrigeração Líquida)',
      col2Points: [
        '<strong>Mecanismo:</strong> Bloco com bomba, mangueiras seladas, fluído refrigerante e radiador frontal/superior.',
        '<strong>Capacidade Térmica:</strong> Excelente para processadores topo de linha com overclocking e cargas contínuas.',
        '<strong>Estética:</strong> Visual limpo no interior do gabinete, com menos volume sobre os slots de memória RAM.'
      ]
    }
  };

  // 4. Peças do Simulador de Montagem (PC Builder)
  const BUILDER_DATABASE = {
    mobo: {
      b760: { name: 'ASUS Prime B760M-A (LGA1700, DDR4)', socket: 'LGA1700', ramGen: 'DDR4', price: 790 },
      b650: { name: 'Gigabyte B650M Aorus Elite (AM5, DDR5)', socket: 'AM5', ramGen: 'DDR5', price: 1150 },
      z790: { name: 'MSI PRO Z790-P (LGA1700, DDR5)', socket: 'LGA1700', ramGen: 'DDR5', price: 1490 }
    },
    cpu: {
      i5_13400: { name: 'Intel Core i5-13400 (LGA1700, TDP 65W)', socket: 'LGA1700', tdp: 65, price: 1250 },
      r7_7700: { name: 'AMD Ryzen 7 7700 (AM5, TDP 65W)', socket: 'AM5', tdp: 65, price: 1850 },
      i7_14700k: { name: 'Intel Core i7-14700K (LGA1700, TDP 125W)', socket: 'LGA1700', tdp: 125, price: 2490 }
    },
    ram: {
      ram16_ddr4: { name: '16GB (2x8GB) Kingston Fury DDR4 3200MHz', gen: 'DDR4', price: 290 },
      ram32_ddr4: { name: '32GB (2x16GB) Corsair Vengeance DDR4 3600MHz', gen: 'DDR4', price: 440 },
      ram32_ddr5: { name: '32GB (2x16GB) Kingston Fury DDR5 5600MHz', gen: 'DDR5', price: 690 }
    },
    storage: {
      ssd500: { name: 'SSD 500GB Kingston NV2 M.2 NVMe', price: 260 },
      ssd1tb: { name: 'SSD 1TB Kingston Renegade PCIe 4.0', price: 490 },
      ssd2tb: { name: 'SSD 2TB Samsung 980 Pro PCIe 4.0', price: 890 }
    },
    psu: {
      p500: { name: 'Fonte 500W MSI MAG 80 Plus Bronze', watts: 500, price: 290 },
      p650: { name: 'Fonte 650W Corsair CX650 80 Plus Bronze', watts: 650, price: 430 },
      p850: { name: 'Fonte 850W XPG Core Reactor 80 Plus Gold', watts: 850, price: 690 }
    },
    gpu: {
      integrated: { name: 'Vídeo Integrado do Processador (Sem placa dedicada)', tdp: 0, price: 0 },
      rtx4060: { name: 'GeForce RTX 4060 8GB GDDR6 (Consumo ~115W)', tdp: 115, price: 2190 },
      rtx4070: { name: 'GeForce RTX 4070 Super 12GB (Consumo ~220W)', tdp: 220, price: 4290 }
    }
  };

  // 5. Questões do Quiz de Hardware (10 perguntas)
  const HARDWARE_QUIZ = [
    {
      q: 'Qual componente é considerado o "cérebro" do computador, responsável por buscar, decodificar e executar instruções de máquina?',
      options: ['Placa-Mãe', 'Processador (CPU)', 'Memória RAM', 'Placa de Vídeo'],
      answer: 1,
      explanation: 'A CPU (Central Processing Unit) realiza os cálculos aritméticos e lógicos e comanda todas as tarefas essenciais do computador.'
    },
    {
      q: 'Por que a memória RAM é classificada como uma memória volátil?',
      options: [
        'Porque ela pode explodir com calor excessivo',
        'Porque perde todos os dados armazenados assim que o computador é desligado',
        'Porque grava dados apenas em discos magnéticos',
        'Porque possui peças móveis que giram a alta velocidade'
      ],
      answer: 1,
      explanation: 'A memória RAM necessita de corrente elétrica contínua para preservar o estado de seus capacitores microscópicos; sem energia, os dados se esvaem instantaneamente.'
    },
    {
      q: 'Qual é a principal vantagem de um SSD NVMe em comparação com um disco rígido mecânico tradicional (HDD)?',
      options: [
        'O SSD possui partes mecânicas que duram 100 anos',
        'O SSD consome muito mais energia elétrica',
        'O SSD é dezenas de vezes mais rápido, silencioso e sem partes móveis mecânicas',
        'O SSD só pode ser usado em computadores sem internet'
      ],
      answer: 2,
      explanation: 'SSDs utilizam chips de memória flash NAND e pistas PCIe com protocolo NVMe, atingindo milhares de megabytes por segundo com latência quase nula.'
    },
    {
      q: 'O que indica a certificação "80 Plus" presente em fontes de alimentação modernas?',
      options: [
        'Que a fonte dura no máximo 80 dias',
        'A garantia de pelo menos 80% de eficiência energética na conversão de AC para DC',
        'Que a fonte atinge até 80 graus Celsius de temperatura',
        'Que ela possui 80 conectores de energia diferentes'
      ],
      answer: 1,
      explanation: 'O selo 80 Plus atesta que a fonte aproveita eficientemente pelo menos 80% da energia que puxa da tomada, dissipando menos calor desnecessário.'
    },
    {
      q: 'O que acontece durante o fenômeno conhecido como "Thermal Throttling"?',
      options: [
        'O processador aumenta a velocidade para esfriar mais rápido',
        'O computador reduz intencionalmente a frequência de clock para não queimar por superaquecimento',
        'A ventoinha do gabinete para de girar',
        'A placa de vídeo é desconectada automaticamente'
      ],
      answer: 1,
      explanation: 'Como medida de autoproteção térmica, a CPU reduz sua frequência de operação quando atinge temperaturas críticas (próximas a 95°C-100°C), evitando danos físicos permanentes.'
    },
    {
      q: 'Em qual slot da placa-mãe é tradicionalmente instalada uma placa de vídeo dedicada?',
      options: ['Slot SATA III', 'Slot M.2 NVMe', 'Slot PCI Express x16', 'Slot USB 3.0'],
      answer: 2,
      explanation: 'O slot PCIe x16 fornece a maior largura de banda física e conexão direta com as pistas do processador para atender à demanda da GPU.'
    },
    {
      q: 'O que é a memória Cache (L1, L2 e L3) de um processador?',
      options: [
        'Um arquivo temporário salvo no HD para recuperar fotos',
        'Uma memória ultrarrápida integrada ao chip da CPU para reduzir o tempo de espera pela RAM',
        'Um antivírus gravado na placa-mãe',
        'A memória que guarda a senha da BIOS'
      ],
      answer: 1,
      explanation: 'A memória Cache opera em velocidades próximas ao ciclo de clock do processador, armazenando cópias de instruções imediatamente requeridas.'
    },
    {
      q: 'Ao montar um computador, o que é fundamental aplicar entre a superfície da CPU e a base do cooler?',
      options: ['Cola instantânea de secagem rápida', 'Pasta térmica de boa condutividade', 'Óleo lubrificante automotivo', 'Álcool em gel'],
      answer: 1,
      explanation: 'A pasta térmica preenche as microscópicas imperfeições de ar entre o espalhador de calor do processador (IHS) e a base do dissipador, facilitando a troca de calor.'
    },
    {
      q: 'Qual é a principal função do Chipset presente na placa-mãe?',
      options: [
        'Funcionar como monitor secundário',
        'Gerenciar as vias de comunicação entre o processador, memórias, discos e periféricos de entrada/saída',
        'Gerar som estéreo de alta fidelidade',
        'Substituir a necessidade de uma fonte de alimentação'
      ],
      answer: 1,
      explanation: 'O Chipset é o centro de controle que determina as capacidades de expansão, portas USB, pistas PCIe secundárias e suporte da placa-mãe.'
    },
    {
      q: 'O que significa a sigla TDP (Thermal Design Power) expressa em Watts nas especificações de hardware?',
      options: [
        'O tempo total de garantia do produto',
        'A quantidade máxima de calor que o sistema de refrigeração precisa ser capaz de dissipar sob carga típica',
        'A voltagem nominal da tomada residencial',
        'A velocidade de download do computador'
      ],
      answer: 1,
      explanation: 'O TDP indica aos montadores qual deve ser a capacidade mínima do cooler para resfriar adequadamente o componente em operação plena.'
    }
  ];

  // Estado Local
  let currentExecutionStep = 0;
  let flowTimer = null;
  let flowIsRunning = false;

  function init() {
    setupHotspots();
    setupExecutionSimulator();
    setupComparators();
    setupPCBuilder();
    setupHardwareQuiz();
    setupHardwareGlossary();
  }

  // 1. Interação do Gabinete Aberto
  function setupHotspots() {
    const hotspots = document.querySelectorAll('.hw-hotspot');
    const compButtons = document.querySelectorAll('.hw-comp-picker-btn');

    function selectComponent(compKey) {
      const data = HARDWARE_COMPONENTS[compKey];
      if (!data) return;

      // Destaque visual no SVG
      hotspots.forEach(h => h.classList.toggle('active', h.dataset.comp === compKey));
      compButtons.forEach(b => b.classList.toggle('active', b.dataset.comp === compKey));

      // Atualiza painel lateral
      document.getElementById('comp-detail-icon').textContent = data.icon;
      document.getElementById('comp-detail-title').textContent = data.name;
      document.getElementById('comp-detail-cat').textContent = data.category;
      document.getElementById('comp-detail-func').textContent = data.func;
      document.getElementById('comp-detail-how').textContent = data.howItWorks;
      document.getElementById('comp-detail-specs').textContent = data.specs;
      document.getElementById('comp-detail-example').textContent = data.example;
      document.getElementById('comp-detail-relation').textContent = data.relation;
    }

    hotspots.forEach(hotspot => {
      hotspot.addEventListener('click', () => {
        selectComponent(hotspot.dataset.comp);
      });
    });

    compButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        selectComponent(btn.dataset.comp);
      });
    });

    // Seleciona CPU inicialmente
    selectComponent('cpu');
  }

  // 2. Simulador de Execução de Software
  function setupExecutionSimulator() {
    const btnNext = document.getElementById('flow-btn-next');
    const btnPrev = document.getElementById('flow-btn-prev');
    const btnPlay = document.getElementById('flow-btn-play');
    const btnReset = document.getElementById('flow-btn-reset');

    function showStep(index) {
      currentExecutionStep = Math.max(0, Math.min(EXECUTION_STEPS.length - 1, index));
      const stepData = EXECUTION_STEPS[currentExecutionStep];

      // Atualiza círculos numerados
      document.querySelectorAll('.flow-step-circle').forEach((circle, idx) => {
        circle.classList.toggle('active', idx === currentExecutionStep);
        circle.classList.toggle('done', idx < currentExecutionStep);
      });

      // Atualiza texto do card
      document.getElementById('flow-step-icon').textContent = stepData.icon;
      document.getElementById('flow-step-title').textContent = stepData.title;
      document.getElementById('flow-step-desc').textContent = stepData.desc;

      // Destaca componente no diagrama do gabinete
      const hotspot = document.querySelector(`.hw-hotspot[data-comp="${stepData.highlight}"]`);
      if (hotspot) {
        document.querySelectorAll('.hw-hotspot').forEach(h => h.classList.remove('active'));
        hotspot.classList.add('active');
      }
    }

    if (btnNext) btnNext.addEventListener('click', () => showStep(currentExecutionStep + 1));
    if (btnPrev) btnPrev.addEventListener('click', () => showStep(currentExecutionStep - 1));

    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        flowIsRunning = !flowIsRunning;
        btnPlay.textContent = flowIsRunning ? 'Pausar' : 'Avanço Automático';

        if (flowIsRunning) {
          runAutoFlow();
        } else {
          clearTimeout(flowTimer);
        }
      });
    }

    function runAutoFlow() {
      if (!flowIsRunning) return;
      if (currentExecutionStep < EXECUTION_STEPS.length - 1) {
        showStep(currentExecutionStep + 1);
        flowTimer = setTimeout(runAutoFlow, 2500);
      } else {
        flowIsRunning = false;
        btnPlay.textContent = 'Avanço Automático';
      }
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        clearTimeout(flowTimer);
        flowIsRunning = false;
        if (btnPlay) btnPlay.textContent = 'Avanço Automático';
        showStep(0);
      });
    }

    showStep(0);
  }

  // 3. Comparador de Componentes
  function setupComparators() {
    const tabs = document.querySelectorAll('.comp-tab-btn');

    function renderComparison(key) {
      const data = COMPARISONS_DATA[key];
      if (!data) return;

      document.getElementById('comparator-title').textContent = data.title;
      document.getElementById('comp-col1-title').textContent = data.col1Title;
      document.getElementById('comp-col2-title').textContent = data.col2Title;

      const ul1 = document.getElementById('comp-col1-list');
      const ul2 = document.getElementById('comp-col2-list');

      ul1.innerHTML = data.col1Points.map(p => `<li style="margin-bottom: 0.5rem; font-size: 0.88rem; color: var(--text-muted);">${p}</li>`).join('');
      ul2.innerHTML = data.col2Points.map(p => `<li style="margin-bottom: 0.5rem; font-size: 0.88rem; color: var(--text-muted);">${p}</li>`).join('');
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderComparison(tab.dataset.comp);
      });
    });

    renderComparison('storage');
  }

  // 4. Simulador de Montagem (PC Builder)
  function setupPCBuilder() {
    const selMobo = document.getElementById('builder-mobo');
    const selCpu = document.getElementById('builder-cpu');
    const selRam = document.getElementById('builder-ram');
    const selStorage = document.getElementById('builder-storage');
    const selPsu = document.getElementById('builder-psu');
    const selGpu = document.getElementById('builder-gpu');

    function updateBuild() {
      const mobo = BUILDER_DATABASE.mobo[selMobo.value];
      const cpu = BUILDER_DATABASE.cpu[selCpu.value];
      const ram = BUILDER_DATABASE.ram[selRam.value];
      const storage = BUILDER_DATABASE.storage[selStorage.value];
      const psu = BUILDER_DATABASE.psu[selPsu.value];
      const gpu = BUILDER_DATABASE.gpu[selGpu.value];

      const totalPrice = mobo.price + cpu.price + ram.price + storage.price + psu.price + gpu.price;
      const totalTdp = cpu.tdp + gpu.tdp + 80; // 80W base para placa, fans, SSD

      document.getElementById('builder-price-val').textContent = `R$ ${totalPrice.toLocaleString('pt-BR')},00`;
      document.getElementById('builder-wattage-val').textContent = `Consumo Estimado: ~${totalTdp} W (Fonte: ${psu.watts} W)`;

      // Verificação de Compatibilidade Didática
      const alertBox = document.getElementById('builder-compat-alert');
      const incompatibilities = [];

      if (cpu.socket !== mobo.socket) {
        incompatibilities.push(`❌ Incompatibilidade de Soquete: O processador utiliza soquete <strong>${cpu.socket}</strong>, mas a placa-mãe selecionada suporta soquete <strong>${mobo.socket}</strong>.`);
      }

      if (ram.gen !== mobo.ramGen) {
        incompatibilities.push(`❌ Incompatibilidade de Memória: A memória selecionada é <strong>${ram.gen}</strong>, mas a placa-mãe suporta apenas módulos <strong>${mobo.ramGen}</strong>.`);
      }

      if (totalTdp > psu.watts) {
        incompatibilities.push(`⚠️ Alerta de Energia: O consumo estimado (${totalTdp} W) ultrapassa a potência máxima da fonte (${psu.watts} W). O computador pode desligar em carga alta.`);
      }

      if (incompatibilities.length > 0) {
        alertBox.className = 'compat-alert-box warning';
        alertBox.innerHTML = incompatibilities.join('<br>');
      } else {
        alertBox.className = 'compat-alert-box ok';
        alertBox.innerHTML = `✅ <strong>Configuração 100% Compatível!</strong> O soquete do processador casa com a placa-mãe, as memórias utilizam a geração correta (${mobo.ramGen}) e a fonte de ${psu.watts}W atende com folga o consumo do sistema.`;
      }
    }

    [selMobo, selCpu, selRam, selStorage, selPsu, selGpu].forEach(s => {
      if (s) s.addEventListener('change', updateBuild);
    });

    updateBuild();
  }

  // 5. Quiz de Hardware
  function setupHardwareQuiz() {
    let currentQ = 0;
    let score = 0;
    let bestScore = 0;

    try {
      bestScore = parseInt(localStorage.getItem('senai_hardware_quiz_best'), 10) || 0;
    } catch (e) {}

    const elProgress = document.getElementById('hw-quiz-progress');
    const elScore = document.getElementById('hw-quiz-score');
    const elQuestion = document.getElementById('hw-quiz-question');
    const elOptions = document.getElementById('hw-quiz-options');
    const elFeedback = document.getElementById('hw-quiz-feedback');
    const elFbTitle = document.getElementById('hw-quiz-fb-title');
    const elFbText = document.getElementById('hw-quiz-fb-text');
    const btnNext = document.getElementById('hw-quiz-btn-next');
    const elResult = document.getElementById('hw-quiz-result');

    function loadQuestion(idx) {
      if (idx >= HARDWARE_QUIZ.length) {
        showFinalResult();
        return;
      }

      const q = HARDWARE_QUIZ[idx];
      elProgress.textContent = `Pergunta ${idx + 1} de ${HARDWARE_QUIZ.length}`;
      elScore.textContent = `Pontos: ${score}/${HARDWARE_QUIZ.length}`;
      elQuestion.textContent = q.q;
      elFeedback.classList.remove('active');
      btnNext.style.display = 'none';

      elOptions.innerHTML = '';
      q.options.forEach((optText, optIdx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.innerHTML = `<strong>${String.fromCharCode(65 + optIdx)})</strong> <span>${optText}</span>`;
        btn.addEventListener('click', () => handleAnswer(optIdx, q.answer, q.explanation));
        elOptions.appendChild(btn);
      });
    }

    function handleAnswer(selectedIdx, correctIdx, explanation) {
      const buttons = elOptions.querySelectorAll('.quiz-option-btn');
      buttons.forEach(b => b.disabled = true);

      if (selectedIdx === correctIdx) {
        score++;
        buttons[selectedIdx].classList.add('correct');
        elFbTitle.textContent = '✅ Resposta Correta!';
        elFbTitle.style.color = '#059669';
      } else {
        buttons[selectedIdx].classList.add('wrong');
        buttons[correctIdx].classList.add('correct');
        elFbTitle.textContent = '❌ Resposta Incorreta';
        elFbTitle.style.color = '#dc2626';
      }

      elFbText.textContent = explanation;
      elFeedback.classList.add('active');
      btnNext.style.display = 'inline-flex';
      elScore.textContent = `Pontos: ${score}/${HARDWARE_QUIZ.length}`;
    }

    function showFinalResult() {
      if (score > bestScore) {
        bestScore = score;
        try {
          localStorage.setItem('senai_hardware_quiz_best', bestScore);
        } catch (e) {}
      }

      document.getElementById('hw-quiz-box').style.display = 'none';
      elResult.style.display = 'block';
      document.getElementById('hw-quiz-final-score').textContent = `${score} de ${HARDWARE_QUIZ.length} acertos (${Math.round((score / HARDWARE_QUIZ.length) * 100)}%)`;
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        currentQ++;
        loadQuestion(currentQ);
      });
    }

    const btnRestart = document.getElementById('hw-quiz-btn-restart');
    if (btnRestart) {
      btnRestart.addEventListener('click', () => {
        currentQ = 0;
        score = 0;
        document.getElementById('hw-quiz-box').style.display = 'block';
        elResult.style.display = 'none';
        loadQuestion(0);
      });
    }

    loadQuestion(0);
  }

  // 6. Busca no Glossário de Hardware
  function setupHardwareGlossary() {
    const input = document.getElementById('hw-glossary-search');
    const items = document.querySelectorAll('.hw-glossary-item');

    if (!input) return;

    input.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(term) ? 'block' : 'none';
      });
    });
  }

  window.addEventListener('DOMContentLoaded', init);

})();
