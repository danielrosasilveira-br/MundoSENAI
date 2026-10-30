/**
 * ===================================================================
 * MISSÃO HARDWARE — AVENTURA DENTRO DO COMPUTADOR
 * service-worker.js — Service Worker PWA para Funcionamento 100% Offline
 * ===================================================================
 */

const CACHE_NAME = 'missao-hardware-v1.0.0';

const ASSETS_TO_PRECACHE = [
  './',
  './index.html',
  './processador.html',
  './memoria-ram.html',
  './placa-mae.html',
  './armazenamento.html',
  './fonte.html',
  './perifericos.html',
  './montagem.html',
  './quiz.html',
  './resultado.html',
  './manifest.webmanifest',
  
  // Estilos CSS
  './css/base.css',
  './css/layout.css',
  './css/components.css',
  './css/animations.css',
  './css/pages.css',

  // Scripts JS
  './js/storage.js',
  './js/audio.js',
  './js/progress.js',
  './js/navigation.js',
  './js/map.js',
  './js/components.js',
  './js/assembly.js',
  './js/quiz.js',
  './js/results.js',
  './js/pwa.js',
  './js/app.js',
  './js/data/questions.js',

  // Marca Oficial SENAI
  './assets/images/logo-senai.png',

  // Ícones PWA
  './assets/icons/favicon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable.png',

  // Fontes Tipográficas Locais
  './assets/fonts/fonts.css',
  './assets/fonts/NunitoSans-Regular.ttf',
  './assets/fonts/NunitoSans-SemiBold.ttf',
  './assets/fonts/NunitoSans-Bold.ttf',
  './assets/fonts/Oxanium-SemiBold.ttf',
  './assets/fonts/Oxanium-Bold.ttf',
  './assets/fonts/Oxanium-ExtraBold.ttf',
  './assets/fonts/SpaceMono-Regular.ttf',
  './assets/fonts/SpaceMono-Bold.ttf'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Armazenando recursos essenciais em cache...');
      return cache.addAll(ASSETS_TO_PRECACHE);
    }).then(() => self.skipWaiting())
  );
});

// Ativação e Limpeza de Caches Antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[Service Worker] Removendo cache antigo:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptação de Requisições (Cache First com fallback para Network)
self.addEventListener('fetch', (event) => {
  // Ignora requisições não-GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // Se a resposta for válida, armazena no cache para uso futuro
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback offline caso tente navegar para uma página HTML desconhecida
        if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});

