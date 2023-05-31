
import React, { useCallback } from "react";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCells } from "../store/table/tableThunk";
import PropTypes from "prop-types";
import "./GalleryBody.css"

function GalleryBody({
  rows,
//   cellsSelected,
  prepareRow,
  headerGroups,
}) {
  const dispatch = useDispatch();
  const tableId = useSelector((state) => state.table.tableId);

  const handleCopy = (event, value) => {
    event.clipboardData.setData("text/plain", value);
    event.preventDefault();
    document.execCommand("copy");
  };

  const handlePaste = (event, row, cell) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    const arr = text.split(", ");

    for (let i = 0; i < arr.length; i++) {
      const updatedRowIndex =
        cell.row.original?.["fld" + tableId.substring(3) + "autonumber"] + i;
      if (cell?.column?.dataType !== "attachment") {
        const value = arr[i].replace(/(^"|"$)/g, ""); // Remove inverted commas
        dispatch(
          updateCells({
            columnId: cell.column.id,
            rowIndex: updatedRowIndex,
            value: value,
          })
        );
      }
    }
  };

  const RenderCard = useCallback(
    ({ row }) => {
      prepareRow(row);
      console.log(row.cells[1]);
      let attached = row.cells.find((cell) => cell.column.dataType === "attachment");
      let checkbox=row.cells[0];
      return (
        <div
          key={row.getRowProps().key}
          className="dbdash-custom-card"
          style={{
            backgroundColor: row.isSelected ? "#E8E8E8" : "#CCE0FE",
            width: "300px",
            height: "400px",
            overflowY: "auto",
            color: "blue",
            position: "relative", // Add position relative
          }}
        >
          <div className="label-todo" style={{ position: "absolute", top: 0, right: 0,zIndex:11 }}>
          {checkbox.render("Cell")}
          </div>
          {attached && attached.value && (
            <div className="carousel-container" style={{ position: "sticky", top: 0, zIndex: 10 }}>
              <div
                style={{
                  display: "flex",
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {attached.value.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt=""
                    className="image-thumbnail"
                    style={{ marginRight: "10px" }}
                    onClick={() => window.open(img, "_blank")}
                  />
                ))}
              </div>
            </div>
          )}
          {row.cells.map((cell, index) => {
            return (
              (cell.value || cell.column.dataType === "check") &&
              cell.column.dataType !== "attachment" && (
                <div
                  key={cell.getCellProps().key}
                  className={cell.column.dataType !== "check" ? "dbdash-custom-card-item" : "checkbox"}
                  data-column-id={cell.column.id}
                  data-row-id={cell.row.original.id}
                  style={{
                    backgroundColor: "white",
                  }}
                  {...cell.getCellProps({
                    onCopy: (event) => handleCopy(event, cell.value),
                    onPaste: (event) => handlePaste(event, cell.row, cell),
                  })}
                >
                  <div className="dbdash-custom-card-item-content">
                    {headerGroups[0]?.headers[index].label !== "check" &&
                      headerGroups[0]?.headers[index].label !== "+" &&
                      headerGroups[0]?.headers[index].dataType !== "attachment" &&
                      cell.value ? (
                      <div className="header-label">{headerGroups[0]?.headers[index].label}</div>
                    ) : null}
                    {cell.column.dataType !== "attachment" && cell.value && (
                      <div className="cell-content" style={{ color: "red" }}>
                        {cell.column.dataType === "multipleselect" && Array.isArray(cell.value) ? (
                          <div className="chips-container">
                            {cell.value.map((chip, chipIndex) => (
                              <div key={chipIndex} className="chip">
                                {chip}
                              </div>
                            ))}
                          </div>
                        ) : (
                          cell.value
                        )}
                      </div>
                    )}
                  </div>
                 
                </div>
              )
            );
          })}
        </div>
      );
    },
    [prepareRow]
  );
  
  
  return (
    <div className="dbdash-card-view">
    {rows.map((row, index) => (
      <div className="grid-item" key={index}>
        <RenderCard row={row} headerGroups={headerGroups} />
      </div>
    ))}
  </div>
  );
}

GalleryBody.propTypes = {
  rows: PropTypes.array.isRequired,
  cellsSelected: PropTypes.object.isRequired,
  prepareRow: PropTypes.func.isRequired,
  headerGroups:PropTypes.any
};

export default memo(GalleryBody);