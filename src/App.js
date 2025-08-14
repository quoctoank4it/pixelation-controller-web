import "./App.css";
import PixelationController from "./components/PixelationController";
import ErrorBoundary from "./components/ErrorBoundary";
import React, { useEffect, useState } from "react";
import "./InstallPrompt.css";

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallAlert, setShowInstallAlert] = useState(false);

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

  return (
    <ErrorBoundary>
      <div className="App">
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
