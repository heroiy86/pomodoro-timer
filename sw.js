const CACHE_NAME = 'pomodoro-timer-v1';
const urlsToCache = [
  '/pomodoro-timer/',
  '/pomodoro-timer/index.html',
  '/pomodoro-timer/styles.css',
  '/pomodoro-timer/script.js',
  '/pomodoro-timer/sounds/notification.mp3'
];

// キャッシュのインストール
self.addEventListener('install', event => {
    console.log('Service Worker: インストール中');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: キャッシュ中');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Service Worker: キャッシュエラー', error);
                throw error;
            })
    );
});

// キャッシュのアクティベート
self.addEventListener('activate', event => {
    console.log('Service Worker: アクティベート中');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: 古いキャッシュを削除:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// フェッチイベントのリッスン
self.addEventListener('fetch', event => {
    console.log('Service Worker: フェッチイベント', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('Service Worker: キャッシュから読み込み');
                    return response;
                }
                console.log('Service Worker: ネットワークから読み込み');
                return fetch(event.request)
                    .then(response => {
                        if (response.ok) {
                            return caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, response.clone());
                                    return response;
                                });
                        }
                        return response;
                    });
            })
    );
});

// 通知のリクエスト
self.addEventListener('notificationclick', event => {
    console.log('Service Worker: 通知クリック');
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            for (const client of windowClients) {
                client.focus();
            }
            if (windowClients.length === 0) {
                return clients.openWindow('/pomodoro-timer/');
            }
        })
    );
});

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
