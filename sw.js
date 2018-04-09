var cacheName = 'realtime-voting-v1';
var subdir = '';
var filesToCache = [
    subdir + '/',
    subdir + '/index.html',
    subdir + '/assets/favicons/favicon-love.ico',
    subdir + '/assets/favicons/favicon-chart.ico',
    subdir + '/assets/ratings/emo1.png',
    subdir + '/assets/ratings/emo2.png',
    subdir + '/assets/ratings/emo3.png',
    subdir + '/assets/ratings/emo4.png',
    subdir + '/assets/ratings/emo5.png',
    subdir + '/site.css',
    subdir + '/cdn/reset.min.css',
    subdir + '/cdn/jquery-3.3.1.min.js',
    subdir + '/cdn/ably.min-1.js',
    subdir + '/js/vote.js'
];

// install
self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] installing…');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

// activate
self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] now ready to handle fetches!');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

// fetch
self.addEventListener('fetch', function (e) {
    console.log('[ServiceWorker] now fetch!');
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request).then(function (response) {
                var shouldCache = response.ok;

                if (e.request.method == 'POST') {
                    shouldCache = false;
                }

                if (shouldCache) {
                    return caches.open(cacheName).then(function (cache) {
                        console.log('[ServiceWorker] caching new fetch');
                        cache.put(e.request, response.clone());
                        return response;
                    });
                } else {
                    return response;
                }
            });
        })
    );
});
