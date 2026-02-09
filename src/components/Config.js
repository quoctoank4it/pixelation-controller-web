import React, { useEffect, useState } from "react";
import { ref, get, set } from "firebase/database";
import { database } from "../firebase";
import { messaging } from "../firebase";
import { getToken } from "firebase/messaging";

const Config = () => {
  const [ocrThreshold, setOcrThreshold] = useState("");
  const [pixelationThreshold, setPixelationThreshold] = useState("");
  const [incorrectPixelationThreshold, setIncorrectPixelationThreshold] = useState("");
  const [zoominfoTest, setZoominfoTest] = useState(false);
  const [activeLicenseDate, setActiveLicenseDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPixelation, setSavingPixelation] = useState(false);
  const [savingIncorrectPixelation, setSavingIncorrectPixelation] = useState(false);
  const [savingZoominfo, setSavingZoominfo] = useState(false);
  const [savingActiveLicenseDate, setSavingActiveLicenseDate] = useState(false);

  const toDateTimeText = (value) => {
    const pad = (num) => String(num).padStart(2, "0");
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    const ss = pad(date.getSeconds());
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  };

  const normalizeDateTimeText = (value) => {
    if (!value) return "";
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) return value;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return toDateTimeText(parsed.toISOString());
  };
  useEffect(() => {
    const load = async () => {
      try {
        const snap = await get(ref(database, "zoominfo_test"));
        if (snap.exists()) setZoominfoTest(!!snap.val());
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);
  const saveZoominfo = async () => {
    setSavingZoominfo(true);
    try {
      await set(ref(database, "zoominfo_test"), zoominfoTest);
      alert("Saved successfully");
    } catch (e) {
      alert("Error saving");
    } finally {
      setSavingZoominfo(false);
    }
  };

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
        const snap = await get(ref(database, "active_license_date"));
        if (snap.exists()) {
          const value = snap.val();
          setActiveLicenseDate(normalizeDateTimeText(value));
        }
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

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await get(ref(database, "incorrectpixelationconfidencethreshold"));
        if (snap.exists()) setIncorrectPixelationThreshold(snap.val());
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

  const saveIncorrectPixelation = async () => {
    setSavingIncorrectPixelation(true);
    try {
      await set(
        ref(database, "incorrectpixelationconfidencethreshold"),
        Number(incorrectPixelationThreshold)
      );
      alert("Saved successfully");
    } catch (e) {
      alert("Error saving");
    } finally {
      setSavingIncorrectPixelation(false);
    }
  };

  const saveActiveLicenseDate = async () => {
    setSavingActiveLicenseDate(true);
    try {
      await set(
        ref(database, "active_license_date"),
        normalizeDateTimeText(activeLicenseDate)
      );
      alert("Saved successfully");
    } catch (e) {
      alert("Error saving");
    } finally {
      setSavingActiveLicenseDate(false);
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
        <label style={styles.label}>zoominfo_test</label>
        <input
          type="checkbox"
          checked={zoominfoTest}
          onChange={async e => {
            const checked = e.target.checked;
            setZoominfoTest(checked);
            setSavingZoominfo(true);
            try {
              await set(ref(database, "zoominfo_test"), checked);
            } catch (e) {
              alert("Error saving");
            } finally {
              setSavingZoominfo(false);
            }
          }}
          disabled={savingZoominfo}
          style={{ width: 20, height: 20 }}
        />
      </div>
      <div style={styles.row}>
        <label style={styles.label}>
          Threshold for GPT to detect pixelation
        </label>
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
      {/* <div style={styles.row}>
        <label style={styles.label}>
          Threshold for GPT to detect incorrect pixelation
        </label>
        <input
          type="number"
          min={0}
          max={1}
          value={loading ? "" : incorrectPixelationThreshold}
          onChange={(e) => setIncorrectPixelationThreshold(e.target.value)}
          style={styles.input}
          disabled={loading || savingIncorrectPixelation}
        />
        <button
          onClick={saveIncorrectPixelation}
          disabled={loading || savingIncorrectPixelation}
          style={styles.button}
        >
          {savingIncorrectPixelation ? "Saving..." : "Save"}
        </button>
      </div> */}
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
      <div style={styles.row}>
        <label style={styles.label}>active_license_date</label>
        <input
          type="text"
          placeholder="YYYY-MM-DD HH:mm:ss"
          value={loading ? "" : activeLicenseDate}
          onChange={(e) => setActiveLicenseDate(e.target.value)}
          style={styles.inputWide}
          disabled={loading || savingActiveLicenseDate}
        />
        <button
          onClick={saveActiveLicenseDate}
          disabled={loading || savingActiveLicenseDate}
          style={styles.button}
        >
          {savingActiveLicenseDate ? "Saving..." : "Save"}
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
    maxWidth: 510,
    margin: "24px auto",
    boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
  },
  row: { display: "flex", alignItems: "center", gap: 12, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: 600 },
  input: { width: 100, padding: 6, borderRadius: 6, border: "1px solid #ccc" },
  inputWide: {
    width: 200,
    padding: 6,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
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
