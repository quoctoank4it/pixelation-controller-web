importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCaNitHpE7NbD8TryQgT-nBg0k5qlTlTMQ",
  authDomain: "pixelationcontroller.firebaseapp.com",
  projectId: "pixelationcontroller",
  storageBucket: "pixelationcontroller.firebasestorage.app",
  messagingSenderId: "102762349077",
  appId: "1:102762349077:web:663fda9a4808e8e09a441c",
});

const messaging = firebase.messaging();

// Hiển thị notification khi app đang background
messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: "/logo192.png",
    data: {
      url: `${payload.data.url}/pixelation-controller-web/` || "/", // URL muốn mở khi click
    },
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Xử lý click vào notification
self.addEventListener("notificationclick", function (event) {
  event.notification.close(); // đóng notification

  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // Nếu có tab đang mở, focus nó
        for (let client of windowClients) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        // Nếu không có, mở tab mới
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
