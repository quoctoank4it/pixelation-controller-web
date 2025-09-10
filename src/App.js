import "./App.css";
import PixelationController from "./components/PixelationController";
import ErrorBoundary from "./components/ErrorBoundary";
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Config from "./components/Config";
import History from "./components/History";
import "./InstallPrompt.css";

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallAlert, setShowInstallAlert] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallAlert(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstallAlert(false);
  };

  const handleCancel = () => setShowInstallAlert(false);

  return (
    <ErrorBoundary>
      <div className="App">
        <Header active={activeTab} onChange={setActiveTab} />
        <div style={{ padding: "0 16px" }}>
          {activeTab === "home" && <PixelationController />}
          {activeTab === "history" && <History />}
          {activeTab === "config" && <Config />}
        </div>
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
