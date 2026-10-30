/**
 * WEBSITE 03 — REDES DE COMPUTADORES INTERATIVAS (js/redes.js)
 * Simuladores de Topologias, Modelo OSI, Consulta DNS e Quiz Interativo.
 * 100% Vanilla JavaScript puro.
 */

(function () {
  'use strict';

  // Dados dos 10 Equipamentos de Rede
  const EQUIPMENTS_DATA = {
    pc: {
      name: 'Computador Desktop',
      category: 'Dispositivo Final (Host)',
      desc: 'Estação de trabalho conectada à rede via placa de rede (NIC) Ethernet cabeada.',
      howItWorks: 'Converte os dados das aplicações em pacotes IP e quadros Ethernet, transmitindo sinais elétricos através do cabo de rede.',
      practicalExample: 'Utilizado em laboratórios de informática do SENAI para desenvolvimento de sistemas e acesso a servidores locais.',
      icon: `<svg viewBox="0 0 48 48" fill="none"><rect x="4" y="6" width="40" height="26" rx="3" fill="#3b82f6"/><rect x="8" y="10" width="32" height="18" fill="#1e293b"/><path d="M18 32 L14 42 H34 L30 32" stroke="#64748b" stroke-width="3"/></svg>`
    },
    notebook: {
      name: 'Notebook',
      category: 'Dispositivo Móvel',
      desc: 'Computador portátil com conectividade dupla (Wi-Fi e porta Ethernet).',
      howItWorks: 'Utiliza adaptadores sem fio (802.11) para modular sinais de rádio ou conexão física via cabo para enviar pacotes de dados.',
      practicalExample: 'Utilizado por estudantes e instrutores para pesquisa e conexão remota à rede corporativa.',
      icon: `<svg viewBox="0 0 48 48" fill="none"><rect x="10" y="8" width="28" height="20" rx="2" fill="#0284c7"/><path d="M4 36 H44 L40 40 H8 Z" fill="#64748b"/></svg>`
    },
    server: {
      name: 'Servidor Dedicado',
      category: 'Provedor de Serviços',
      desc: 'Computador de alta performance configurado para fornecer recursos, aplicações ou dados a outros computadores da rede.',
      howItWorks: 'Executa serviços como páginas web (HTTP/HTTPS), bancos de dados ou compartilhamento de arquivos, respondendo a requisições dos clientes.',
      practicalExample: 'Hospeda o portal acadêmico do SENAI e os bancos de dados dos sistemas educacionais.',
      icon: `<svg viewBox="0 0 48 48" fill="none"><rect x="8" y="6" width="32" height="10" rx="2" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><rect x="8" y="19" width="32" height="10" rx="2" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><rect x="8" y="32" width="32" height="10" rx="2" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><circle cx="14" cy="11" r="2" fill="#22c55e"/><circle cx="14" cy="24" r="2" fill="#22c55e"/><circle cx="14" cy="37" r="2" fill="#22c55e"/></svg>`
    },
    switch: {
      name: 'Switch de Rede',
      category: 'Concentrador Camada 2 (Enlace)',
      desc: 'Equipamento inteligente que interliga múltiplos computadores dentro da mesma rede local (LAN).',
      howItWorks: 'Lê o endereço físico (MAC Address) contido no cabeçalho do quadro e encaminha a mensagem apenas para a porta do destinatário.',
      practicalExample: 'Conecta 24 ou 48 computadores de uma sala de aula SENAI, evitando colisões de tráfego.',
      icon: `<svg viewBox="0 0 48 48" fill="none"><rect x="4" y="14" width="40" height="20" rx="4" fill="#003d73" stroke="#005caa" stroke-width="2"/><circle cx="12" cy="24" r="2" fill="#22c55e"/><circle cx="20" cy="24" r="2" fill="#38bdf8"/><circle cx="28" cy="24" r="2" fill="#22c55e"/><circle cx="36" cy="24" r="2" fill="#f59e0b"/></svg>`
    },
    router: {
      name: 'Roteador',
      category: 'Encaminhador Camada 3 (Rede)',
      desc: 'Dispositivo responsável por conectar redes diferentes e determinar a melhor rota para o tráfego dos pacotes.',
      howItWorks: 'Examina o endereço IP de destino no cabeçalho do pacote e consulta tabelas de roteamento para direcioná-lo ao próximo salto.',
      practicalExample: 'Conecta a rede local da sua escola ou residência com a rede do provedor de Internet.',
      icon: `<svg viewBox="0 0 48 48" fill="none"><rect x="6" y="20" width="36" height="16" rx="4" fill="#334155"/><line x1="12" y1="20" x2="6" y2="8" stroke="#64748b" stroke-width="3"/><line x1="36" y1="20" x2="42" y2="8" stroke="#64748b" stroke-width="3"/><circle cx="18" cy="28" r="2" fill="#22c55e"/><circle cx="24" cy="28" r="2" fill="#22c55e"/><circle cx="30" cy="28" r="2" fill="#38bdf8"/></svg>`
    },
    modem: {
      name: 'Modem (Modulador/Demodulador)',
      category: 'Conversor de Sinais',
      desc: 'Aparelho que converte sinais digitais do computador em sinais analógicos/ópticos adequados para transmissão pela linha do provedor.',
      howItWorks: 'Modula pulsos elétricos ou luz da fibra óptica (FTTH) em dados digitais binários reconhecíveis pelo roteador.',
      practicalExample: 'Modem óptico (ONT) instalado na residência para receber a fibra de banda larga.',
      icon: `<svg viewBox="0 0 48 48" fill="none"><rect x="12" y="8" width="24" height="32" rx="4" fill="#1e293b" stroke="#64748b" stroke-width="2"/><line x1="24" y1="14" x2="24" y2="22" stroke="#38bdf8" stroke-width="2"/><circle cx="24" cy="30" r="2" fill="#22c55e"/></svg>`
    },
    ap: {
      name: 'Ponto de Acesso Wi-Fi (AP)',
      category: 'Extensão de Rede Sem Fio',
      desc: 'Dispositivo que recebe a rede cabeada e transmite ondas de rádio para conectar celulares, notebooks e tablets sem fio.',
      howItWorks: 'Transmite dados nas frequências de 2.4 GHz e 5 GHz (normas 802.11ax/ac/n), convertendo ondas de rádio em quadros Ethernet.',
      practicalExample: 'Aparelhos instalados no teto dos corredores e salas do SENAI para prover Wi-Fi institucional.',
      icon: `<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="8" fill="#005caa"/><path d="M12 12 A 16 16 0 0 1 36 12" stroke="#0284c7" stroke-width="3" fill="none"/><path d="M6 6 A 24 24 0 0 1 42 6" stroke="#38bdf8" stroke-width="3" fill="none"/></svg>`
    },
    firewall: {
      name: 'Firewall de Borda',
      category: 'Segurança de Rede',
      desc: 'Barreira de segurança que monitora e controla o tráfego de entrada e saída com base em políticas de segurança predefinidas.',
      howItWorks: 'Inspeciona cabeçalhos de pacotes, portas (como 80, 443, 22) e dados, bloqueando invasões ou tráfego malicioso.',
      practicalExample: 'Impede tentativas externas de invasão aos servidores e bloqueia sites não autorizados na rede escolar.',
      icon: `<svg viewBox="0 0 48 48" fill="none"><path d="M24 4 L40 10 V24 C40 34 24 44 24 44 C24 44 8 34 8 24 V10 Z" fill="#b91c1c" stroke="#ef4444" stroke-width="2"/><path d="M24 14 V34" stroke="#ffffff" stroke-width="3"/><path d="M16 24 H32" stroke="#ffffff" stroke-width="3"/></svg>`
    },
    cable: {
      name: 'Cabo de Rede Par Trançado (UTP)',
      category: 'Meio Físico de Transmissão',
      desc: 'Cabo de cobre composto por 4 pares trançados de fios com conectores RJ-45 nas pontas.',
      howItWorks: 'Transmite sinais elétricos que representam bits (zeros e uns). O trançamento dos pares cancela interferências eletromagnéticas externas.',
      practicalExample: 'Cabos azuis Cat6 conectando os computadores dos alunos às tomadas de rede nas paredes.',
      icon: `<svg viewBox="0 0 48 48" fill="none"><path d="M10 38 Q 24 10 38 10" stroke="#005caa" stroke-width="6" stroke-linecap="round"/><rect x="34" y="6" width="10" height="8" rx="2" fill="#f59e0b"/></svg>`
    },
    printer: {
      name: 'Impressora de Rede',
      category: 'Periférico Compartilhado',
      desc: 'Impressora equipada com placa de rede própria e endereço IP fixo.',
      howItWorks: 'Recebe filas de impressão enviadas por múltiplos computadores usando o protocolo IPP (Internet Printing Protocol) ou LPR.',
      practicalExample: 'Impressora compartilhada na secretaria ou coordenação pedagógica acessível por todos os instrutores.',
      icon: `<svg viewBox="0 0 48 48" fill="none"><rect x="10" y="16" width="28" height="18" rx="2" fill="#475569"/><rect x="14" y="6" width="20" height="10" fill="#cbd5e1"/><rect x="14" y="26" width="20" height="12" fill="#ffffff" stroke="#94a3b8"/><line x1="14" y1="20" x2="20" y2="20" stroke="#22c55e" stroke-width="2"/></svg>`
    }
  };

  // Dados das 7 Camadas do Modelo OSI
  const OSI_LAYERS_DATA = {
    7: {
      name: 'Aplicação (Layer 7)',
      pdu: 'Dados',
      function: 'Interface direta com os softwares e usuários finais. Fornece serviços de rede como navegação web, envio de e-mails e transferência de arquivos.',
      protocols: 'HTTP, HTTPS, DNS, FTP, SMTP, SSH, Telnet, DHCP',
      practicalExample: 'Quando você digita uma URL no Google Chrome, a requisição HTTP é gerada na camada de aplicação.',
      adjacent: 'Comunica-se diretamente com o usuário e entrega dados para a Camada 6 (Apresentação).'
    },
    6: {
      name: 'Apresentação (Layer 6)',
      pdu: 'Dados',
      function: 'Responsável pela tradução, formatação, compressão e criptografia dos dados, garantindo que o receptor possa entender as informações.',
      protocols: 'SSL, TLS, ASCII, UTF-8, JPEG, PNG, MP4',
      practicalExample: 'Criptografia HTTPS com TLS que protege suas senhas durante o tráfego.',
      adjacent: 'Recebe dados da Camada 7 e os envia padronizados para a Camada 5 (Sessão).'
    },
    5: {
      name: 'Sessão (Layer 5)',
      pdu: 'Dados',
      function: 'Estabelece, gerencia, mantém e finaliza diálogos e sessões de comunicação entre as aplicações em máquinas distintas.',
      protocols: 'NetBIOS, RPC, Sockets, PPTP, NFS',
      practicalExample: 'Manter sua conta logada enquanto você navega entre diferentes páginas do portal educacional.',
      adjacent: 'Fica entre a Camada 6 (Apresentação) e a Camada 4 (Transporte).'
    },
    4: {
      name: 'Transporte (Layer 4)',
      pdu: 'Segmentos (TCP) / Datagramas (UDP)',
      function: 'Garante o transporte confiável ou rápido dos dados de ponta a ponta. Realiza controle de fluxo, multiplexação por portas e retransmissão de perdas.',
      protocols: 'TCP (confiável, orientado à conexão), UDP (rápido, sem confirmação)',
      practicalExample: 'O TCP reenvia pacotes perdidos em um download; o UDP transmite streaming ao vivo sem atrasos.',
      adjacent: 'Segmenta dados da Camada 5 e entrega para a Camada 3 (Rede).'
    },
    3: {
      name: 'Rede (Layer 3)',
      pdu: 'Pacotes',
      function: 'Responsável pelo endereçamento lógico (IP) e roteamento dos pacotes através de múltiplas redes intermediárias até o destino.',
      protocols: 'IPv4, IPv6, ICMP (Ping), ARP, OSPF, BGP',
      practicalExample: 'Roteadores analisando o IP de destino para escolher o caminho mais rápido na Internet.',
      adjacent: 'Encapsula segmentos da Camada 4 em pacotes e entrega para a Camada 2 (Enlace).'
    },
    2: {
      name: 'Enlace de Dados (Layer 2)',
      pdu: 'Quadros (Frames)',
      function: 'Responsável pela transmissão livre de erros no enlace físico direto, endereçamento físico (MAC Address) e controle de acesso ao meio.',
      protocols: 'Ethernet (802.3), Wi-Fi (802.11), PPP, Switches Camada 2',
      practicalExample: 'O Switch da sala de aula lendo o endereço MAC da placa de rede para entregar o quadro à porta correta.',
      adjacent: 'Empacota bits da Camada 1 em quadros e interage com a Camada 3 (Rede).'
    },
    1: {
      name: 'Física (Layer 1)',
      pdu: 'Bits',
      function: 'Transmissão e recepção da sequência de bits brutos não estruturados sobre o meio físico mecânico, elétrico ou óptico.',
      protocols: 'Cabos de cobre UTP, Fibra Óptica, Rádio Wi-Fi, Conectores RJ-45, Hubs',
      practicalExample: 'Pulsos de tensão elétrica de 5V percorrendo o cabo de rede ou pulsos de laser na fibra óptica.',
      adjacent: 'Converte quadros da Camada 2 em sinais físicos no meio de transmissão.'
    }
  };

  // Questões do Quiz de Redes (10 perguntas didáticas)
  const NETWORKS_QUIZ = [
    {
      q: 'Qual equipamento de rede opera prioritariamente na Camada 2 (Enlace de Dados) e utiliza endereços MAC para encaminhar o tráfego?',
      options: ['Hub', 'Switch', 'Roteador', 'Modem'],
      answer: 1,
      explanation: 'O Switch opera na Camada 2 do Modelo OSI, lendo o endereço físico (MAC Address) dos quadros Ethernet para entregá-los na porta correta.'
    },
    {
      q: 'Qual é a principal função do protocolo DNS na arquitetura da Internet?',
      options: [
        'Criptografar mensagens trocadas por e-mail',
        'Traduzir nomes de domínio amigáveis (ex: senai.br) em endereços IP numéricos',
        'Distribuir endereços IP automaticamente na rede local',
        'Garantir a integridade física dos cabos de rede'
      ],
      answer: 1,
      explanation: 'O DNS (Domain Name System) funciona como a "lista telefônica" da Internet, convertendo domínios legíveis para humanos nos endereços IP usados pelas máquinas.'
    },
    {
      q: 'Qual é a diferença fundamental entre os protocolos de transporte TCP e UDP?',
      options: [
        'O TCP é não confiável e mais rápido; o UDP garante entrega ordenada',
        'O TCP garante a entrega e ordem dos dados com confirmação; o UDP prioriza velocidade sem confirmação',
        'O TCP opera na Camada 3 e o UDP opera na Camada 7',
        'O TCP é exclusivo para redes sem fio e o UDP para redes cabeadas'
      ],
      answer: 1,
      explanation: 'O TCP é orientado à conexão com handshake em 3 vias e retransmissão de perdas, enquanto o UDP transmite sem garantias, ideal para streaming e jogos em tempo real.'
    },
    {
      q: 'O que representa um endereço MAC (Media Access Control)?',
      options: [
        'Um endereço lógico temporário atribuído por um servidor DHCP',
        'O identificador físico único e permanente gravado pelo fabricante na placa de rede',
        'O protocolo de criptografia de senhas em sites bancários',
        'A máscara de sub-rede utilizada para dividir redes IP'
      ],
      answer: 1,
      explanation: 'O endereço MAC possui 48 bits (ex: 00:1A:2B:3C:4D:5E) e é o identificador físico permanente da interface de rede (NIC).'
    },
    {
      q: 'Em qual camada do modelo OSI ocorre o roteamento de pacotes baseado em endereços lógicos (IP)?',
      options: ['Camada 1 — Física', 'Camada 2 — Enlace de Dados', 'Camada 3 — Rede', 'Camada 4 — Transporte'],
      answer: 2,
      explanation: 'A Camada 3 (Rede) é onde atuam os roteadores, sendo responsável pelo endereçamento lógico (IPv4/IPv6) e roteamento de pacotes entre diferentes redes.'
    },
    {
      q: 'Como é classificada geograficamente uma rede que interliga computadores em uma mesma sala, prédio ou campus universitário?',
      options: ['PAN (Personal Area Network)', 'LAN (Local Area Network)', 'MAN (Metropolitan Area Network)', 'WAN (Wide Area Network)'],
      answer: 1,
      explanation: 'LAN (Local Area Network ou Rede Local) abrange áreas geograficamente limitadas como uma residência, escritório ou escola.'
    },
    {
      q: 'Qual protocolo é responsável por atribuir automaticamente configurações de rede (IP, máscara, gateway e DNS) aos clientes conectados?',
      options: ['DHCP', 'HTTP', 'FTP', 'SNMP'],
      answer: 0,
      explanation: 'O DHCP (Dynamic Host Configuration Protocol) automatiza a concessão de endereços IP e parâmetros essenciais para dispositivos que entram na rede.'
    },
    {
      q: 'O que é a técnica de "Encapsulamento" no tráfego de dados em redes?',
      options: [
        'O processo de quebrar um cabo físico para reparar conexões',
        'O empacotamento sucessivo de dados, adicionando cabeçalhos de controle ao descer pelas camadas do modelo OSI',
        'A desativação do firewall para acelerar downloads',
        'A compressão de arquivos em formato ZIP'
      ],
      answer: 1,
      explanation: 'No encapsulamento, cada camada adiciona seu próprio cabeçalho (ex: porta no Transporte, IP na Rede, MAC no Enlace) aos dados originais antes do envio.'
    },
    {
      q: 'Qual dispositivo atua como barreira de segurança, controlando e filtrando o fluxo de dados que entra e sai de uma rede com base em regras?',
      options: ['Ponto de Acesso', 'Firewall', 'Switch não gerenciável', 'Repetidor'],
      answer: 1,
      explanation: 'O Firewall inspeciona o tráfego e bloqueia conexões não autorizadas ou portas perigosas para proteger os hosts internos.'
    },
    {
      q: 'Qual é o formato de um endereço IPv4 padrão?',
      options: [
        '4 blocos de números decimais separados por pontos (32 bits no total, ex: 192.168.1.1)',
        '8 blocos hexadecimais separados por dois pontos (128 bits no total)',
        'Uma sequência alfanumérica de 16 caracteres',
        'Um único número inteiro de 8 dígitos'
      ],
      answer: 0,
      explanation: 'O IPv4 é composto por 32 bits divididos em 4 octetos decimais de 0 a 255 (ex: 172.16.254.1).'
    }
  ];

  // Estado do Simulador de Rede
  let simCurrentStep = 0;
  let simTimer = null;
  let simIsRunning = false;

  const TOPOLOGIES = {
    corp: {
      nodes: [
        { id: 'node-pc', title: 'PC Aluno', ip: '192.168.10.15', pos: 10 },
        { id: 'node-switch', title: 'Switch Local', ip: 'Layer 2 MAC', pos: 36 },
        { id: 'node-router', title: 'Roteador Borda', ip: '192.168.10.1', pos: 64 },
        { id: 'node-server', title: 'Servidor SENAI', ip: '200.18.45.10', pos: 90 }
      ],
      steps: [
        {
          step: 1,
          packetPos: 10,
          activeNode: 'node-pc',
          badge: '1. Origem',
          text: 'O computador do estudante prepara uma requisição HTTP. O sistema encapsula os dados em pacotes IP com IP de origem 192.168.10.15 e destino 200.18.45.10.'
        },
        {
          step: 2,
          packetPos: 36,
          activeNode: 'node-switch',
          badge: '2. Comutação Local',
          text: 'O Switch da sala de aula recebe o quadro Ethernet. Ele consulta sua tabela de endereços MAC e encaminha o tráfego diretamente para a porta do Roteador.'
        },
        {
          step: 3,
          packetPos: 64,
          activeNode: 'node-router',
          badge: '3. Roteamento IP',
          text: 'O Roteador analisa o endereço IP de destino na Camada 3. Ele consulta a tabela de rotas externa e envia o pacote através do link de Internet para a rede de destino.'
        },
        {
          step: 4,
          packetPos: 90,
          activeNode: 'node-server',
          badge: '4. Servidor Web',
          text: 'O Servidor recebe o pacote, valida a integridade na Camada de Transporte (TCP) e processa a solicitação da página web, gerando uma resposta HTTP 200 OK.'
        },
        {
          step: 5,
          packetPos: 10,
          activeNode: 'node-pc',
          badge: '5. Retorno dos Dados',
          text: 'Os pacotes de resposta retornam pelo caminho inverso até o computador do aluno, que renderiza os dados na tela. Conexão completada com sucesso!'
        }
      ]
    },
    home: {
      nodes: [
        { id: 'node-pc', title: 'Notebook Wi-Fi', ip: '192.168.1.100', pos: 10 },
        { id: 'node-switch', title: 'Ponto Acesso (AP)', ip: '802.11ax', pos: 36 },
        { id: 'node-router', title: 'Modem Roteador', ip: '192.168.1.1', pos: 64 },
        { id: 'node-server', title: 'Nuvem / Cloud', ip: '104.26.12.33', pos: 90 }
      ],
      steps: [
        {
          step: 1,
          packetPos: 10,
          activeNode: 'node-pc',
          badge: '1. Conexão Sem Fio',
          text: 'O notebook transmite dados convertidos em radiofrequência (ondas eletromagnéticas) destinadas à antena do ponto de acesso Wi-Fi.'
        },
        {
          step: 2,
          packetPos: 36,
          activeNode: 'node-switch',
          badge: '2. Conversão de Meio',
          text: 'O Ponto de Acesso (AP) converte as ondas de rádio em pulsos elétricos no cabo de rede par trançado conectado ao modem residencial.'
        },
        {
          step: 3,
          packetPos: 64,
          activeNode: 'node-router',
          badge: '3. Tradução NAT & Fibra',
          text: 'O Modem/Roteador realiza a tradução de endereços (NAT), convertendo o IP local privado para o IP público da fibra óptica e enviando ao provedor.'
        },
        {
          step: 4,
          packetPos: 90,
          activeNode: 'node-server',
          badge: '4. Servidor em Nuvem',
          text: 'Os servidores em nuvem recebem os dados, executam a consulta e devolvem as informações solicitadas.'
        },
        {
          step: 5,
          packetPos: 10,
          activeNode: 'node-pc',
          badge: '5. Conclusão',
          text: 'Os dados chegam de volta ao notebook via Wi-Fi, finalizando a transação de rede.'
        }
      ]
    }
  };

  // Inicialização Geral
  function init() {
    setupEquipmentsModal();
    setupOSIInteractions();
    setupNetworkSimulator();
    setupDNSSimulator();
    setupQuiz();
    setupGlossarySearch();
  }

  // 1. Modal dos Equipamentos
  function setupEquipmentsModal() {
    const modal = document.getElementById('equipment-modal');
    const closeBtn = document.getElementById('equipment-modal-close');
    const cards = document.querySelectorAll('.equipment-card');

    cards.forEach(card => {
      card.addEventListener('click', () => {
        const key = card.dataset.equip;
        const data = EQUIPMENTS_DATA[key];
        if (!data) return;

        document.getElementById('modal-equip-title').textContent = data.name;
        document.getElementById('modal-equip-cat').textContent = data.category;
        document.getElementById('modal-equip-icon').innerHTML = data.icon;
        document.getElementById('modal-equip-desc').textContent = data.desc;
        document.getElementById('modal-equip-how').textContent = data.howItWorks;
        document.getElementById('modal-equip-example').textContent = data.practicalExample;

        modal.classList.add('active');
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  // 2. Modelo OSI Interativo
  function setupOSIInteractions() {
    const layerBars = document.querySelectorAll('.osi-layer-bar');
    layerBars.forEach(bar => {
      bar.addEventListener('click', () => {
        layerBars.forEach(b => b.classList.remove('selected'));
        bar.classList.add('selected');

        const layerNum = bar.dataset.layer;
        const data = OSI_LAYERS_DATA[layerNum];
        if (!data) return;

        document.getElementById('osi-info-title').textContent = data.name;
        document.getElementById('osi-info-pdu').textContent = data.pdu;
        document.getElementById('osi-info-func').textContent = data.function;
        document.getElementById('osi-info-proto').textContent = data.protocols;
        document.getElementById('osi-info-example').textContent = data.practicalExample;
        document.getElementById('osi-info-adjacent').textContent = data.adjacent;
      });
    });
  }

  // 3. Simulador de Rede
  function setupNetworkSimulator() {
    const btnSend = document.getElementById('sim-btn-send');
    const btnPause = document.getElementById('sim-btn-pause');
    const btnReset = document.getElementById('sim-btn-reset');
    const selectTopology = document.getElementById('sim-select-topology');

    let currentTopoKey = 'corp';

    function renderTopologyNodes() {
      const topo = TOPOLOGIES[currentTopoKey];
      const nodeElements = [
        document.getElementById('node-pc'),
        document.getElementById('node-switch'),
        document.getElementById('node-router'),
        document.getElementById('node-server')
      ];

      topo.nodes.forEach((n, idx) => {
        if (nodeElements[idx]) {
          nodeElements[idx].querySelector('.node-title').textContent = n.title;
          nodeElements[idx].querySelector('.node-ip').textContent = n.ip;
        }
      });
    }

    function runStep(index) {
      const topo = TOPOLOGIES[currentTopoKey];
      if (index >= topo.steps.length) {
        simIsRunning = false;
        btnSend.disabled = false;
        return;
      }

      const stepData = topo.steps[index];
      simCurrentStep = index;

      // Animação do Pacote
      const token = document.getElementById('sim-packet-token');
      token.style.display = 'block';
      token.style.left = `${stepData.packetPos}%`;

      // Destaque do Nó Ativo
      document.querySelectorAll('.network-node').forEach(node => {
        node.classList.toggle('active', node.id === stepData.activeNode);
      });

      // Atualiza Log Didático
      document.getElementById('sim-log-step').textContent = stepData.badge;
      document.getElementById('sim-log-text').textContent = stepData.text;

      simTimer = setTimeout(() => {
        if (simIsRunning) {
          runStep(index + 1);
        }
      }, 2200);
    }

    if (btnSend) {
      btnSend.addEventListener('click', () => {
        simIsRunning = true;
        btnSend.disabled = true;
        runStep(0);
      });
    }

    if (btnPause) {
      btnPause.addEventListener('click', () => {
        simIsRunning = !simIsRunning;
        btnPause.textContent = simIsRunning ? 'Pausar' : 'Continuar';
        if (simIsRunning) {
          runStep(simCurrentStep);
        } else {
          clearTimeout(simTimer);
        }
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        clearTimeout(simTimer);
        simIsRunning = false;
        btnSend.disabled = false;
        simCurrentStep = 0;
        const token = document.getElementById('sim-packet-token');
        token.style.display = 'none';
        token.style.left = '10%';
        document.querySelectorAll('.network-node').forEach(n => n.classList.remove('active'));
        document.getElementById('sim-log-step').textContent = 'Pronto';
        document.getElementById('sim-log-text').textContent = 'Clique em "Enviar Dados" para iniciar a animação didática.';
      });
    }

    if (selectTopology) {
      selectTopology.addEventListener('change', (e) => {
        currentTopoKey = e.target.value;
        if (btnReset) btnReset.click();
        renderTopologyNodes();
      });
    }

    renderTopologyNodes();
  }

  // 4. Simulador de Consulta DNS
  function setupDNSSimulator() {
    const btnSimulate = document.getElementById('btn-dns-simulate');
    const inputDomain = document.getElementById('dns-query-domain');
    const stepCards = document.querySelectorAll('.dns-step-card');
    const resultBox = document.getElementById('dns-result-box');

    if (!btnSimulate) return;

    btnSimulate.addEventListener('click', () => {
      const domain = (inputDomain.value || 'senai.br').trim();
      btnSimulate.disabled = true;
      resultBox.style.display = 'none';

      stepCards.forEach(c => c.classList.remove('active'));

      // Executa os 5 passos didáticos da consulta
      const delay = 1200;
      stepCards.forEach((card, idx) => {
        setTimeout(() => {
          stepCards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');

          if (idx === stepCards.length - 1) {
            setTimeout(() => {
              btnSimulate.disabled = false;
              resultBox.style.display = 'block';
              document.getElementById('dns-result-domain').textContent = domain;
            }, 800);
          }
        }, idx * delay);
      });
    });
  }

  // 5. Quiz Interativo de Redes
  function setupQuiz() {
    let currentQ = 0;
    let score = 0;
    let bestScore = 0;

    try {
      bestScore = parseInt(localStorage.getItem('senai_redes_quiz_best'), 10) || 0;
    } catch (e) {}

    const elProgress = document.getElementById('quiz-progress-text');
    const elScore = document.getElementById('quiz-score-badge');
    const elQuestion = document.getElementById('quiz-question-title');
    const elOptions = document.getElementById('quiz-options-grid');
    const elFeedback = document.getElementById('quiz-feedback-box');
    const elFbTitle = document.getElementById('quiz-fb-title');
    const elFbText = document.getElementById('quiz-fb-text');
    const btnNext = document.getElementById('quiz-btn-next');
    const elResult = document.getElementById('quiz-final-result');

    function loadQuestion(idx) {
      if (idx >= NETWORKS_QUIZ.length) {
        showFinalResult();
        return;
      }

      const q = NETWORKS_QUIZ[idx];
      elProgress.textContent = `Pergunta ${idx + 1} de ${NETWORKS_QUIZ.length}`;
      elScore.textContent = `Pontos: ${score}/${NETWORKS_QUIZ.length}`;
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
      elScore.textContent = `Pontos: ${score}/${NETWORKS_QUIZ.length}`;
    }

    function showFinalResult() {
      if (score > bestScore) {
        bestScore = score;
        try {
          localStorage.setItem('senai_redes_quiz_best', bestScore);
        } catch (e) {}
      }

      document.getElementById('quiz-quiz-box').style.display = 'none';
      elResult.style.display = 'block';
      document.getElementById('quiz-final-score-text').textContent = `${score} de ${NETWORKS_QUIZ.length} acertos (${Math.round((score / NETWORKS_QUIZ.length) * 100)}%)`;
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        currentQ++;
        loadQuestion(currentQ);
      });
    }

    const btnRestart = document.getElementById('quiz-btn-restart');
    if (btnRestart) {
      btnRestart.addEventListener('click', () => {
        currentQ = 0;
        score = 0;
        document.getElementById('quiz-quiz-box').style.display = 'block';
        elResult.style.display = 'none';
        loadQuestion(0);
      });
    }

    loadQuestion(0);
  }

  // 6. Busca no Glossário de Redes
  function setupGlossarySearch() {
    const input = document.getElementById('glossary-search');
    const items = document.querySelectorAll('.glossary-item');

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
