const cacheName = 'movie-catalog-cache-v1';
const assets = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png'
];

// Instalando o Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log('Cache aberto');
            return cache.addAll(assets);
        })
    );
});

// Ativando o Service Worker
self.addEventListener('activate', event => {
    const cacheWhitelist = [cacheName];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (!cacheWhitelist.includes(cache)) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Capturando as requisições e servindo os arquivos do cache
self.addEventListener('fetch', event => {
    // Verifica se o pedido é para a API (rede) ou para o arquivo estático
    if (event.request.url.includes('themoviedb.org')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    return response;
                })
                .catch(err => {
                    console.log('Erro ao buscar da rede:', err);
                    return caches.match(event.request);
                })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(cacheResponse => {
                return cacheResponse || fetch(event.request);
            })
        );
    }
});
