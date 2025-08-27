import "./App.css";
import PixelationController from "./components/PixelationController";
import ErrorBoundary from "./components/ErrorBoundary";
import React, { useEffect, useState } from "react";
import { messaging, database } from "./firebase";
import { getToken } from "firebase/messaging";
import { ref, set, get, update } from "firebase/database";

import "./InstallPrompt.css";

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallAlert, setShowInstallAlert] = useState(false);
  const [ocrThreshold, setOcrThreshold] = useState(0);
  const [loadingOcr, setLoadingOcr] = useState(true);
  // Load ocrconfidencethreshold from Firebase on mount
  useEffect(() => {
    const fetchOcrThreshold = async () => {
      try {
        const snapshot = await get(ref(database, "ocrconfidencethreshold"));
        if (snapshot.exists()) {
          setOcrThreshold(snapshot.val());
        }
      } catch (e) {
        console.error("Error loading ocrconfidencethreshold", e);
      } finally {
        setLoadingOcr(false);
      }
    };
    fetchOcrThreshold();
  }, []);
  // Handle input change and update to Firebase
  const handleOcrInputChange = (e) => {
    setOcrThreshold(e.target.value);
  };

  const handleOcrSave = async () => {
    try {
      await set(ref(database, "ocrconfidencethreshold"), Number(ocrThreshold));
      alert("Cập nhật ocrconfidencethreshold thành công!");
    } catch (e) {
      alert("Lỗi khi cập nhật ocrconfidencethreshold");
    }
  };

  useEffect(() => {
    const handler = (e) => {
      console.log("beforeinstallprompt event fired", e);
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallAlert(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log("User choice outcome:", outcome);
      setDeferredPrompt(null);
      setShowInstallAlert(false);
    }
  };

  const handleCancel = () => {
    setShowInstallAlert(false);
  };

  const allowNotification = async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        `${process.env.PUBLIC_URL}/firebase-messaging-sw.js`
      );
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey:
            "BIqbzuiiPkhZSf6cuyU3MSbI4Lld-dwNGjBA78KyfFiF7QCqphgvIS8faPvAiO_bB-soMb9Dgm6kTUVtdm0v-Io",
          serviceWorkerRegistration: registration,
        });
        console.log("FCM Token:", token);

        // Lưu token lên Realtime Database
        await set(ref(database, "tokens/" + token), {
          token: token,
          createdAt: Date.now(),
        });

        alert("Token saved and notifications allowed!");
      } else {
        alert("Permission denied");
      }
    } catch (err) {
      console.error(err);
      alert("Error getting token");
    }
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <button
          onClick={allowNotification}
          style={{
            marginTop: "16px",
            height: "40px",
            padding: "0 16px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "4px",
          }}
        >
          Allow Notification
        </button>

        {/* OCR Confidence Threshold Input */}
        <div
          style={{
            margin: "24px auto",
            maxWidth: 400,
            background: "#f8f8f8",
            padding: 16,
            borderRadius: 8,
          }}
        >
          <label
            htmlFor="ocr-threshold"
            style={{ fontWeight: 600, marginRight: 8 }}
          >
            OCR Confidence Threshold:
          </label>
          <input
            id="ocr-threshold"
            type="number"
            min="0"
            max="100"
            value={loadingOcr ? "" : ocrThreshold}
            onChange={handleOcrInputChange}
            style={{ width: 80, marginRight: 8, padding: 4 }}
            disabled={loadingOcr}
          />
          <button
            onClick={handleOcrSave}
            disabled={loadingOcr}
            style={{
              padding: "4px 12px",
              borderRadius: 4,
              border: "none",
              background: "#28a745",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>

        <PixelationController />
        {showInstallAlert && (
          <div className="install-banner">
            <div className="install-banner-content">
              <div className="install-banner-icon">📱</div>
              <div className="install-banner-text">
                <div className="install-banner-title">Install Toan's App</div>
                <div className="install-banner-subtitle">
                  Experience better on your device
                </div>
              </div>
              <div className="install-banner-actions">
                <button
                  className="install-banner-btn install-btn"
                  onClick={handleInstallClick}
                >
                  Install
                </button>
                <button
                  className="install-banner-btn close-btn"
                  onClick={handleCancel}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
