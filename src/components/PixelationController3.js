import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

initializeApp(firebaseConfig);

const PixelationController3 = () => {
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
    { headerName: "IdUIStepHistory", field: "IdUIStepHistory" },
    { headerName: "Createtime", field: "Createtime" },
    {
      headerName: "Manual",
      field: "Manual",
      cellRenderer: (params) => (params.value ? "Yes" : "No"),
    },
  ];

  return (
    <div
      className="ag-theme-alpine"
      style={{
        height: "100%",
        width: "100%",
        margin: "20px auto",
        maxWidth: "800px",
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
            boxSizing: "border-box",
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
              boxSizing: "border-box",
            }}
          >
            {selectedRow && (
              <div>
                <img
                  src={selectedRow.Images[0]}
                  alt="Event Image"
                  style={{
                    width: "100%",
                    height: "auto",
                    marginBottom: "20px",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    style={{
                      flex: 1,
                      padding: "10px",
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      minWidth: "120px",
                    }}
                    onClick={() => handleUpdate(true)}
                  >
                    Correct Pixelation
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: "10px",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      minWidth: "120px",
                    }}
                    onClick={() => handleUpdate(false)}
                  >
                    Not Pixelation
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

export default PixelationController3;
