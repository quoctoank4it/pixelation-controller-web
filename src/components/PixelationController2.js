import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCaNitHpE7NbD8TryQgT-nBg0k5qlTlTMQ",
  authDomain: "pixelationcontroller.firebaseapp.com",
  databaseURL: "https://pixelationcontroller-default-rtdb.firebaseio.com",
  projectId: "pixelationcontroller",
  storageBucket: "pixelationcontroller.firebasestorage.app",
  messagingSenderId: "102762349077",
  appId: "1:102762349077:web:663fda9a4808e8e09a441c",
};

initializeApp(firebaseConfig);

const PixelationController2 = () => {
  const [rowData, setRowData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    const dbRef = ref(db, "eventwritelog");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const filteredData = Object.values(data || {}).filter(
        (item) => !item.Manual
      );
      setRowData(filteredData);
    });
  }, []);

  const handleRowSelected = (event) => {
    setSelectedRow(event.data);
    setShowModal(true);
  };

  const handleUpdate = (isPixelation) => {
    if (selectedRow) {
      const db = getDatabase();
      const dbRef = ref(db, `eventwritelog/${selectedRow.Ideventwritelog}`);
      update(dbRef, { isPixelation, Manual: true }).then(() => {
        setShowModal(false);
        setRowData((prevData) =>
          prevData.filter(
            (row) => row.Ideventwritelog !== selectedRow.Ideventwritelog
          )
        );
      });
    }
  };

  const columns = [
    { headerName: "Createtime", field: "Createtime" },
    { headerName: "IdUIStepHistory", field: "IdUIStepHistory" },
  ];

  const correctImageUrl = (url) => {
    if (!url) return "";
    return url
      .replace("github.com", "raw.githubusercontent.com")
      .replace("/blob/", "/");
  };

  return (
    <div
      className="ag-theme-alpine"
      style={{
        height: "calc(100vh - 40px)",
        width: "90%",
        maxWidth: "800px",
        margin: "20px auto",
      }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columns}
        rowSelection="single"
        onRowClicked={handleRowSelected}
      />

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "400px",
              textAlign: "center",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            {selectedRow && (
              <div>
                <img
                  src={correctImageUrl(selectedRow.Images[0])}
                  alt="Event Image"
                  style={{
                    width: "100%",
                    height: "auto",
                    marginBottom: "20px",
                    borderRadius: "4px",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <button
                    style={{
                      padding: "10px",
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleUpdate(true)}
                  >
                    Correct Pixelation
                  </button>
                  <button
                    style={{
                      padding: "10px",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleUpdate(false)}
                  >
                    Not Pixelation
                  </button>
                  <button
                    style={{
                      padding: "10px",
                      backgroundColor: "blue",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PixelationController2;
