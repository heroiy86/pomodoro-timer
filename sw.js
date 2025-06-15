const CACHE_NAME = 'pomodoro-timer-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/sounds/notification.mp3'
];

// キャッシュのインストール
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// フェッチイベントのリッスン
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

// 通知のリクエスト
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            for (const client of windowClients) {
                client.focus();
            }
            if (windowClients.length === 0) {
                return clients.openWindow('/');
            }
        })
    );
});
