import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaNitHpE7NbD8TryQgT-nBg0k5qlTlTMQ",
  authDomain: "pixelationcontroller.firebaseapp.com",
  databaseURL: "https://pixelationcontroller-default-rtdb.firebaseio.com",
  projectId: "pixelationcontroller",
  storageBucket: "pixelationcontroller.firebasestorage.app",
  messagingSenderId: "102762349077",
  appId: "1:102762349077:web:663fda9a4808e8e09a441c",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const PixelationControllerWeb = () => {
  const [rowData, setRowData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    const dbRef = ref(database, "eventwritelog");
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setRowData(formattedData);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRowSelection = (event) => {
    const selectedNode = event.api.getSelectedNodes()[0];
    if (selectedNode) {
      setSelectedRow(selectedNode.data);
      setPopupVisible(true);
    }
  };

  const handleUpdate = (isPixelation) => {
    if (selectedRow) {
      const dbRef = ref(database, `eventwritelog/${selectedRow.id}`);
      update(dbRef, {
        isPixelation: isPixelation,
        Manual: true,
      });
      setPopupVisible(false);
      setSelectedRow(null);
    }
  };

  return (
    <div>
      <h1>Pixelation Controller</h1>
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={[
            {
              headerName: "IdUIStepHistory",
              field: "IdUIStepHistory",
              sortable: true,
              filter: true,
            },
            {
              headerName: "Createtime",
              field: "Createtime",
              sortable: true,
              filter: true,
            },
            {
              headerName: "Manual",
              field: "Manual",
              sortable: true,
              filter: true,
            },
          ]}
          rowSelection="single"
          onRowClicked={handleRowSelection}
          modules={[ClientSideRowModelModule]}
        />
      </div>

      {popupVisible && selectedRow && (
        <div className="popup">
          <div className="popup-content">
            <h2>Image Preview</h2>
            <img
              src={selectedRow.Images[0]}
              alt="Preview"
              style={{ maxWidth: "100%" }}
            />
            <div className="popup-buttons">
              <button onClick={() => handleUpdate(true)}>
                Correct Pixelation
              </button>
              <button onClick={() => handleUpdate(false)}>
                Not Pixelation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PixelationControllerWeb;
