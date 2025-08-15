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

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: "/logo192.png",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
