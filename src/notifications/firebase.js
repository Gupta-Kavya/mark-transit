import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  deleteToken,
} from "firebase/messaging";
import axios from "axios";

const firebaseConfig = {
  apiKey: "", // your-credentials
  authDomain: "",// your-credentials
  projectId: "",// your-credentials
  storageBucket: "",// your-credentials
  messagingSenderId: "",// your-credentials
  appId: "",// your-credentials
  measurementId: "",// your-credentials
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// Handle permission request for notifications (if applicable to your platform)
export async function generateToken(topic, studentId) {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted");

      const token = await getToken(messaging, {
        vapidKey:
          "BK_AxFe_gPiAJ8zlEewkEXwMKETtBLa_M_QmXx__vJDYInYKLyZ5amWGfxLD_iIk-79_7z4JG37hUCRzx8FSUbo",
        });
        console.log(token)

      axios
        .put(`${process.env.REACT_APP_API_BASE_URL}/update-fcm-token/${studentId}`, {
          fcmToken: token,
        })
        .then((response) => {
          console.log("Successfully updated FCM token");
        })
        .catch((error) => {
          console.error("There was a problem with the request:", error);
        });

      // console.log("FCM token:", token);

      subscribetoNotifications(token, topic);
    } else {
      console.log("Permission denied");
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }
}

const subscribetoNotifications = async (fcm_Device_token, topicName) => {
  try {
    let response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fcm_Device_token: fcm_Device_token,
        topicName: topicName,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

async function deleteFCMToken() {
  try {
    await deleteToken(messaging);
    console.log("FCM token deleted");
  } catch (error) {
    console.error("Error deleting FCM token:", error);
  }
}
