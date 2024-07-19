
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// eslint-disable-next-line no-undef
firebase.initializeApp({
    apiKey: "",// your-credentials
    authDomain: "",// your-credentials
    projectId: "",// your-credentials
    storageBucket: "",// your-credentials
    messagingSenderId: "", // your-credentials
    appId: "",// your-credentials
    measurementId: "",// your-credentials
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
