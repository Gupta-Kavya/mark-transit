
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// eslint-disable-next-line no-undef
firebase.initializeApp({
    apiKey: "AIzaSyCnwuwsmIEnrb_HaqeI8adOIjt4PZ5kKnw",
    authDomain: "marklogistics-84539.firebaseapp.com",
    projectId: "marklogistics-84539",
    storageBucket: "marklogistics-84539.appspot.com",
    messagingSenderId: "62817675406",
    appId: "1:62817675406:web:2c03752d25258cdbb4c1df",
    measurementId: "G-2BSCHEYWY5",
});


// eslint-disable-next-line no-undef
const messaging = firebase.messaging();


messaging.onBackgroundMessage((payload) => {
    console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload
    );
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.image
    };
  
    // eslint-disable-next-line no-restricted-globals
    self.registration.showNotification(notificationTitle, notificationOptions);
  });