/**
 * ===================================================================
 * SUÍTE DE TESTES AUTOMATIZADOS DO PROJETO
 * ===================================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE_DIR = __dirname;
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASSOU: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FALHOU: ${message}`);
    failed++;
  }
}

console.log('========================================================');
console.log('INICIANDO AUDITORIA E TESTES - MISSÃO HARDWARE SENAI');
console.log('========================================================\n');

// 1. Verificação de Sintaxe JavaScript
console.log('1. SINTAXE DE ARQUIVOS JAVASCRIPT:');
const jsFiles = [
  'js/storage.js',
  'js/audio.js',
  'js/progress.js',
  'js/navigation.js',
  'js/map.js',
  'js/components.js',
  'js/assembly.js',
  'js/quiz.js',
  'js/results.js',
  'js/pwa.js',
  'js/app.js',
  'js/data/questions.js',
  'service-worker.js'
];

jsFiles.forEach(file => {
  const fullPath = path.join(BASE_DIR, file);
  assert(fs.existsSync(fullPath), `Arquivo ${file} existe`);
  try {
    execSync(`node --check "${fullPath}"`);
    assert(true, `Sintaxe JS válida em ${file}`);
  } catch (err) {
    assert(false, `Erro de sintaxe em ${file}: ${err.message}`);
  }
});

// 2. Verificação de Páginas HTML e Links Internos
console.log('\n2. INTEGRIDADE DAS 10 PÁGINAS HTML E RECURSOS VINCULADOS:');
const htmlPages = [
  'index.html',
  'processador.html',
  'memoria-ram.html',
  'placa-mae.html',
  'armazenamento.html',
  'fonte.html',
  'perifericos.html',
  'montagem.html',
  'quiz.html',
  'resultado.html'
];

assert(htmlPages.length === 10, 'Total de 10 páginas HTML obrigatórias planejadas');

htmlPages.forEach(page => {
  const fullPath = path.join(BASE_DIR, page);
  assert(fs.existsSync(fullPath), `Página ${page} existe no diretório raiz`);
  const content = fs.readFileSync(fullPath, 'utf8');

  // Verifica presença da logomarca oficial SENAI
  assert(content.includes('assets/images/logo-senai.png'), `Página ${page} referencia assets/images/logo-senai.png`);
  assert(content.includes('alt="Logomarca oficial do SENAI"'), `Página ${page} tem texto alternativo acessível na logomarca`);

  // Extrai e valida recursos locais
  const regex = /(?:src|href)=["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const rawUrl = match[1];
    if (rawUrl.startsWith('http') || rawUrl.startsWith('#') || rawUrl.startsWith('mailto')) continue;
    const cleanUrl = rawUrl.split('?')[0].split('#')[0];
    const targetFile = path.join(BASE_DIR, cleanUrl);
    assert(fs.existsSync(targetFile), `Recurso "${rawUrl}" em ${page} existe no disco`);
  }
});

// 3. Verificação do Arquivo da Logomarca Oficial do SENAI
console.log('\n3. VERIFICAÇÃO DA LOGOMARCA OFICIAL DO SENAI:');
const logoPath = path.join(BASE_DIR, 'assets/images/logo-senai.png');
assert(fs.existsSync(logoPath), 'Logomarca oficial do SENAI está presente em assets/images/logo-senai.png');
if (fs.existsSync(logoPath)) {
  const stat = fs.statSync(logoPath);
  assert(stat.size > 1000, `Logomarca tem tamanho real e válido: ${stat.size} bytes`);
}

// 4. Verificação das Fontes Locais Obrigatórias
console.log('\n4. VERIFICAÇÃO DAS FONTES LOCAIS (OXANIUM, NUNITO SANS, SPACE MONO):');
const fontFiles = [
  'assets/fonts/NunitoSans-Regular.ttf',
  'assets/fonts/NunitoSans-SemiBold.ttf',
  'assets/fonts/NunitoSans-Bold.ttf',
  'assets/fonts/Oxanium-SemiBold.ttf',
  'assets/fonts/Oxanium-Bold.ttf',
  'assets/fonts/Oxanium-ExtraBold.ttf',
  'assets/fonts/SpaceMono-Regular.ttf',
  'assets/fonts/SpaceMono-Bold.ttf',
  'assets/fonts/fonts.css'
];

fontFiles.forEach(f => {
  const fullFont = path.join(BASE_DIR, f);
  assert(fs.existsSync(fullFont), `Fonte local presente: ${f}`);
});

// 5. Verificação da Lógica do Quiz
console.log('\n5. VERIFICAÇÃO DO BANCO DE PERGUNTAS E PONTUAÇÃO:');
const qScript = fs.readFileSync(path.join(BASE_DIR, 'js/data/questions.js'), 'utf8');
const sandbox = {};
const fn = new Function('window', qScript);
fn(sandbox);

const questions = sandbox.HARDWARE_QUESTIONS;
assert(Array.isArray(questions), 'HARDWARE_QUESTIONS é um array');
assert(questions.length >= 10, `Banco tem pelo menos 10 perguntas (Encontradas: ${questions.length})`);

let allHaveOneCorrect = true;
let allHaveStableIds = true;
let allHaveExplanations = true;

questions.forEach((q, idx) => {
  const corrects = q.options.filter(o => o.correct === true);
  if (corrects.length !== 1) allHaveOneCorrect = false;
  if (!q.id || !q.options.every(o => o.id)) allHaveStableIds = false;
  if (!q.explanation || q.explanation.length < 10) allHaveExplanations = false;
});

assert(allHaveOneCorrect, 'Cada pergunta possui exatamente UMA alternativa correta');
assert(allHaveStableIds, 'Todas as perguntas e alternativas possuem IDs estáveis para suporte ao embaralhamento');
assert(allHaveExplanations, 'Todas as perguntas contêm explicações pedagógicas claras');

// 6. Verificação do PWA Manifest e Service Worker
console.log('\n6. VERIFICAÇÃO DO PWA E SERVICE WORKER:');
const manifestPath = path.join(BASE_DIR, 'manifest.webmanifest');
assert(fs.existsSync(manifestPath), 'manifest.webmanifest existe');
try {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert(manifest.name && manifest.short_name, 'Manifest contém nome e short_name');
  assert(manifest.display === 'standalone', 'Manifest configurado como standalone');
  assert(manifest.icons && manifest.icons.length >= 2, 'Manifest possui ícones');
  manifest.icons.forEach(icon => {
    const iconFile = path.join(BASE_DIR, icon.src);
    assert(fs.existsSync(iconFile), `Ícone do manifest existe: ${icon.src}`);
  });
} catch (e) {
  assert(false, `Erro ao analisar JSON do manifest: ${e.message}`);
}

const swPath = path.join(BASE_DIR, 'service-worker.js');
assert(fs.existsSync(swPath), 'service-worker.js existe');
const swContent = fs.readFileSync(swPath, 'utf8');
assert(swContent.includes('CACHE_NAME'), 'Service Worker define CACHE_NAME');
assert(swContent.includes('ASSETS_TO_PRECACHE'), 'Service Worker define ASSETS_TO_PRECACHE');
assert(swContent.includes('assets/images/logo-senai.png'), 'Service Worker inclui a logomarca do SENAI no cache');

console.log('\n========================================================');
console.log(`TOTAL DE TESTES EXECUTADOS: ${passed + failed}`);
console.log(`APROVADOS: ${passed} | FALHAS: ${failed}`);
console.log('========================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 TODOS OS REQUISITOS TÉCNICOS FORAM AUDITADOS E APROVADOS!');
}

