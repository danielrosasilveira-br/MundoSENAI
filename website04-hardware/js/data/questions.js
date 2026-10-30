/**
 * ===================================================================
 * MISSÃO HARDWARE — AVENTURA DENTRO DO COMPUTADOR
 * js/data/questions.js — Banco de Perguntas Educativas com IDs Estáveis
 * Linguagem clara e amigável para estudantes de 12 anos
 * ===================================================================
 */

const HARDWARE_QUESTIONS = [
  {
    id: 'q_cpu_func',
    topic: 'processador',
    question: 'Qual é a função principal do processador (CPU) em um computador?',
    explanation: 'A CPU é o "cérebro" da máquina: ela recebe comandos, faz cálculos matemáticos e lógicos rápidos e coordena a execução de programas.',
    options: [
      { id: 'opt_1', text: 'Executar instruções e realizar operações matemáticas e lógicas fundamentais.', correct: true },
      { id: 'opt_2', text: 'Guardar todas as fotos e vídeos mesmo quando o computador é desligado.', correct: false },
      { id: 'opt_3', text: 'Transmitir apenas eletricidade da tomada para o monitor.', correct: false },
      { id: 'opt_4', text: 'Imprimir papéis e controlar o volume físico dos fones.', correct: false }
    ]
  },
  {
    id: 'q_ram_volatil',
    topic: 'memoria-ram',
    question: 'Por que dizemos que a memória RAM é "volátil"?',
    explanation: 'A RAM precisa de eletricidade constante para manter as informações. Se você desligar o computador da tomada, os dados abertos nela somem!',
    options: [
      { id: 'opt_1', text: 'Porque ela esquenta tanto que evapora como fumaça.', correct: false },
      { id: 'opt_2', text: 'Porque seu conteúdo é perdido quando o computador é desligado.', correct: true },
      { id: 'opt_3', text: 'Porque ela só funciona se o computador estiver conectado à internet.', correct: false },
      { id: 'opt_4', text: 'Porque ela nunca pode ser alterada nem receber novos programas.', correct: false }
    ]
  },
  {
    id: 'q_mobo_conexoes',
    topic: 'placa-mae',
    question: 'Qual é o papel da placa-mãe (Motherboard) no computador?',
    explanation: 'A placa-mãe é como uma grande cidade de circuitos que conecta a CPU, a RAM, os discos e a fonte, permitindo que conversem entre si.',
    options: [
      { id: 'opt_1', text: 'Conectar todos os componentes e permitir a comunicação entre eles.', correct: true },
      { id: 'opt_2', text: 'Substituir a necessidade de uma fonte de energia.', correct: false },
      { id: 'opt_3', text: 'Servir apenas como suporte de metal sem nenhum circuito elétrico.', correct: false },
      { id: 'opt_4', text: 'Armazenar jogos pesados sem precisar de SSD ou HD.', correct: false }
    ]
  },
  {
    id: 'q_ssd_hd_diff',
    topic: 'armazenamento',
    question: 'Qual é uma diferença fundamental entre o SSD e o disco rígido tradicional (HD)?',
    explanation: 'O HD possui discos magnéticos giratórios e um braço mecânico, enquanto o SSD usa circuitos eletrônicos integrados (chips de memória flash) sem partes móveis.',
    options: [
      { id: 'opt_1', text: 'O SSD não possui discos mecânicos móveis, usando memória eletrônica.', correct: true },
      { id: 'opt_2', text: 'O HD só armazena fotos preto e branco e o SSD fotos coloridas.', correct: false },
      { id: 'opt_3', text: 'O HD perde todos os dados quando desligado e o SSD não.', correct: false },
      { id: 'opt_4', text: 'O SSD precisa ser lubrificado com óleo periodicamente.', correct: false }
    ]
  },
  {
    id: 'q_fonte_papel',
    topic: 'fonte',
    question: 'Para que serve a fonte de alimentação em um computador desktop?',
    explanation: 'A fonte pega a energia da tomada (alta e alternada) e a transforma em correntes contínuas e seguras (12V, 5V, 3.3V) para cada circuito do PC.',
    options: [
      { id: 'opt_1', text: 'Converter e distribuir energia elétrica adequada aos componentes.', correct: true },
      { id: 'opt_2', text: 'Transmitir internet via cabo para o teclado.', correct: false },
      { id: 'opt_3', text: 'Criar gráficos em alta definição para a tela.', correct: false },
      { id: 'opt_4', text: 'Tocar músicas e sons nos alto-falantes.', correct: false }
    ]
  },
  {
    id: 'q_perif_entrada',
    topic: 'perifericos',
    question: 'Quais dos itens abaixo são exemplos típicos de periféricos de ENTRADA de dados?',
    explanation: 'Dispositivos de entrada enviam sinais para dentro do computador. O teclado envia letras e números e o mouse envia comandos de movimento e clique.',
    options: [
      { id: 'opt_1', text: 'Teclado e mouse.', correct: true },
      { id: 'opt_2', text: 'Monitor e impressora.', correct: false },
      { id: 'opt_3', text: 'Fones de ouvido e alto-falante.', correct: false },
      { id: 'opt_4', text: 'Fonte de alimentação e cooler.', correct: false }
    ]
  },
  {
    id: 'q_perif_saida',
    topic: 'perifericos',
    question: 'Qual destes periféricos tem como função principal a SAÍDA de informações visuais para o usuário?',
    explanation: 'O monitor projeta as imagens geradas pela placa de vídeo para que você possa enxergar e interagir com o sistema.',
    options: [
      { id: 'opt_1', text: 'Monitor de vídeo.', correct: true },
      { id: 'opt_2', text: 'Webcam.', correct: false },
      { id: 'opt_3', text: 'Microfone.', correct: false },
      { id: 'opt_4', text: 'Leitor de código de barras.', correct: false }
    ]
  },
  {
    id: 'q_montagem_soquete',
    topic: 'montagem',
    question: 'Na montagem de um computador, onde o processador (CPU) deve ser instalado na placa-mãe?',
    explanation: 'O processador possui um local exclusivo e delicado na placa-mãe chamado soquete da CPU (socket), com pinos e travas de segurança.',
    options: [
      { id: 'opt_1', text: 'No soquete apropriado para CPU.', correct: true },
      { id: 'opt_2', text: 'Em qualquer porta USB externa.', correct: false },
      { id: 'opt_3', text: 'Dentro da gaveta do SSD.', correct: false },
      { id: 'opt_4', text: 'Solto em cima do ventilador da fonte.', correct: false }
    ]
  },
  {
    id: 'q_ram_vs_ssd',
    topic: 'armazenamento',
    question: 'Quando você salva um arquivo de texto no computador, onde ele fica gravado de forma permanente?',
    explanation: 'Ao salvar, o arquivo sai da memória temporária (RAM) e é gravado no disco persistente (SSD ou HD) para não ser apagado ao desligar.',
    options: [
      { id: 'opt_1', text: 'No dispositivo de armazenamento permanente (SSD ou HD).', correct: true },
      { id: 'opt_2', text: 'Na memória RAM temporária.', correct: false },
      { id: 'opt_3', text: 'Diretamente no cabo do monitor.', correct: false },
      { id: 'opt_4', text: 'No leitor de CD que estiver vazio.', correct: false }
    ]
  },
  {
    id: 'q_calculadora_cotidiano',
    topic: 'processador',
    question: 'Ao abrir a calculadora do computador e digitar "15 + 27", quem realiza a conta matemática?',
    explanation: 'A CPU possui uma unidade interna chamada ULA (Unidade Lógica e Aritmética) responsável por efetuar todas as somas, subtrações e contas!',
    options: [
      { id: 'opt_1', text: 'O processador (CPU), por meio de seus circuitos de cálculo.', correct: true },
      { id: 'opt_2', text: 'O cabo de energia da tomada.', correct: false },
      { id: 'opt_3', text: 'O vidro externo da tela do monitor.', correct: false },
      { id: 'opt_4', text: 'Apenas a caixa plástica do gabinete.', correct: false }
    ]
  },
  {
    id: 'q_webcam_funcao',
    topic: 'perifericos',
    question: 'A webcam é um periférico classificado como:',
    explanation: 'A webcam captura imagens e luz do mundo real e as converte em dados digitais enviados para o computador, funcionando como entrada.',
    options: [
      { id: 'opt_1', text: 'Dispositivo de entrada de imagem e vídeo.', correct: true },
      { id: 'opt_2', text: 'Dispositivo de saída de energia elétrica.', correct: false },
      { id: 'opt_3', text: 'Memória permanente de alta velocidade.', correct: false },
      { id: 'opt_4', text: 'Processador secundário de áudio.', correct: false }
    ]
  },
  {
    id: 'q_seguranca_fonte',
    topic: 'fonte',
    question: 'Por que nunca devemos abrir ou mexer por dentro de uma fonte de alimentação?',
    explanation: 'As fontes possuem capacitores que retêm eletricidade perigosa mesmo fora da tomada! Manutenções internas devem ser feitas apenas por técnicos habilitados.',
    options: [
      { id: 'opt_1', text: 'Porque seus componentes internos retêm eletricidade perigosa.', correct: true },
      { id: 'opt_2', text: 'Porque ela perderá todas as fotos salvas na internet.', correct: false },
      { id: 'opt_3', text: 'Porque o computador esquecerá como falar português.', correct: false },
      { id: 'opt_4', text: 'Porque os circuitos dela se desmancham na água.', correct: false }
    ]
  }
];

window.HARDWARE_QUESTIONS = HARDWARE_QUESTIONS;

