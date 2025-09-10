import React, { useEffect, useState } from "react";
import { ref, get, set } from "firebase/database";
import { database } from "../firebase";
import { messaging } from "../firebase";
import { getToken } from "firebase/messaging";

const Config = () => {
  const [ocrThreshold, setOcrThreshold] = useState("");
  const [pixelationThreshold, setPixelationThreshold] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPixelation, setSavingPixelation] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await get(ref(database, "ocrconfidencethreshold"));
        if (snap.exists()) setOcrThreshold(snap.val());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await get(ref(database, "pixelationconfidencethreshold"));
        if (snap.exists()) setPixelationThreshold(snap.val());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await set(ref(database, "ocrconfidencethreshold"), Number(ocrThreshold));
      alert("Saved successfully");
    } catch (e) {
      alert("Error saving");
    } finally {
      setSaving(false);
    }
  };

  const savePixelation = async () => {
    setSavingPixelation(true);
    try {
      await set(
        ref(database, "pixelationconfidencethreshold"),
        Number(pixelationThreshold)
      );
      alert("Saved successfully");
    } catch (e) {
      alert("Error saving");
    } finally {
      setSavingPixelation(false);
    }
  };

  const allowNotification = async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        `${process.env.PUBLIC_URL}/firebase-messaging-sw.js`
      );
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return alert("Permission denied");
      const token = await getToken(messaging, {
        vapidKey:
          "BIqbzuiiPkhZSf6cuyU3MSbI4Lld-dwNGjBA78KyfFiF7QCqphgvIS8faPvAiO_bB-soMb9Dgm6kTUVtdm0v-Io",
        serviceWorkerRegistration: registration,
      });
      console.log("FCM Token:", token);
      alert("Notification enabled");
    } catch (e) {
      console.error(e);
      alert("Error enabling notification");
    }
  };

  return (
    <div style={styles.box}>
      <h3 style={{ marginTop: 0 }}>Config System</h3>
      <div style={styles.row}>
        <label style={styles.label}>Pixelation Confidence Threshold</label>
        <input
          type="number"
          min={0}
          max={1}
          value={loading ? "" : pixelationThreshold}
          onChange={(e) => setPixelationThreshold(e.target.value)}
          style={styles.input}
          disabled={loading || savingPixelation}
        />
        <button
          onClick={savePixelation}
          disabled={loading || savingPixelation}
          style={styles.button}
        >
          {savingPixelation ? "Saving..." : "Save"}
        </button>
      </div>
      <div style={styles.row}>
        <label style={styles.label}>OCR Confidence Threshold</label>
        <input
          type="number"
          min={0}
          max={100}
          value={loading ? "" : ocrThreshold}
          onChange={(e) => setOcrThreshold(e.target.value)}
          style={styles.input}
          disabled={loading || saving}
        />
        <button
          onClick={save}
          disabled={loading || saving}
          style={styles.button}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
      <div style={styles.row}>
        <label style={styles.label}>
          Subscribe to pixelation notifications
        </label>

        <button onClick={allowNotification} style={styles.button}>
          Allow Notification
        </button>
      </div>
    </div>
  );
};

const styles = {
  box: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    maxWidth: 480,
    margin: "24px auto",
    boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
  },
  row: { display: "flex", alignItems: "center", gap: 12, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: 600 },
  input: { width: 100, padding: 6, borderRadius: 6, border: "1px solid #ccc" },
  button: {
    padding: "6px 16px",
    border: "none",
    background: "#28a745",
    color: "#fff",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default Config;
