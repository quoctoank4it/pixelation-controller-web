import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { initializeApp } from "firebase/app";
import ConfirmModal from "./ConfirmModal";
import { format } from "date-fns";

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

const PixelationController = () => {
  const [rowData, setRowData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState("");

  useEffect(() => {
    const db = getDatabase();
    const dbRef = ref(db, "eventwritelog");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const filteredData = Object.values(data || {}).filter(
        (item) => !item.Manual
      );
      // Sort the filtered data by Createtime in descending order
      const sortedData = filteredData.sort(
        (a, b) => new Date(b.Createtime) - new Date(a.Createtime)
      );

      setRowData(sortedData);
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
    {
      headerName: "No",
      valueGetter: (params) => {
        return params.node.rowIndex + 1; // Thêm 1 vì rowIndex bắt đầu từ 0
      },
      sortable: false, // Vô hiệu hóa sắp xếp
      width: 60,
    },
    {
      headerName: "GPTResult",
      field: "GPTResult",
      valueGetter: (params) => {
        if (params.data && typeof params.data.GPTResult !== "undefined") {
          return params.data.GPTResult ? "True" : "False";
        }
        return "";
      },
      width: 60,
    },
    {
      headerName: "MachineName",
      field: "Machinename",
    },
    {
      headerName: "Createtime",
      valueGetter: (params) => {
        return format(new Date(params.data.Createtime), "yyyy-MM-dd HH:mm:ss");
      },
    },
  ];

  const correctImageUrl = (url) => {
    if (!url) return "";
    return url
      .replace("github.com", "raw.githubusercontent.com")
      .replace("/blob/", "/");
  };

  const handleCorrectClick = () => {
    setCurrentAction("correct");
    setModalOpen(true);
  };

  const handleNotClick = () => {
    setCurrentAction("not");
    setModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (currentAction === "correct") {
      handleUpdate(true);
      console.log("Correct!");
    } else if (currentAction === "not") {
      handleUpdate(false);
      console.log("Not!");
    }
    setModalOpen(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
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
      <h2>Detect Pixelation Hybrid</h2>
      {Array.isArray(rowData) &&
        Array.isArray(columns) &&
        columns.length > 0 && (
          <AgGridReact
            rowData={rowData}
            columnDefs={columns}
            defaultColDef={{
              sortable: true,
              filter: false,
              resizable: true,
              minWidth: 100,
            }}
            onRowClicked={handleRowSelected}
            pagination={false}
            paginationPageSize={20}
            rowSelection="single"
            suppressRowClickSelection={true}
            animateRows={true}
          />
        )}

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
                    onClick={() => handleCorrectClick()}
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
                    onClick={() => handleNotClick()}
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
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction}
        message={`Are you sure you want to update it?`}
      />
    </div>
  );
};

export default PixelationController;
