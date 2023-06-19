import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
// import DbDetails from "./DbDetails";
import {DbDetails} from "../dbDetail";
// import { getDbById } from "../api/dbApi";
import { getDbById } from "../../api/dbApi";

import { setAllTablesData } from "../store/allTable/allTableSlice";
// import { resetData } from "../store/table/tableSlice";
import { resetData } from "../../store/table/tableSlice"; 
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

jest.mock("../../api/dbApi");
jest.mock("react-redux");
jest.mock("react-router-dom");

describe("DbDetails", () => {
  beforeEach(() => {
    getDbById.mockClear();
    useDispatch.mockClear();
    useParams.mockClear();
  });

  test("fetches db data from API and dispatches actions", async () => {
    const mockDbData = {
      data: {
        data: {
          db: {
            id: 1,
            name: "Test DB",
            tables: [{ id: 1, name: "Table 1" }, { id: 2, name: "Table 2" }],
          },
        },
      },
    };

    getDbById.mockResolvedValueOnce(mockDbData);
    useDispatch.mockReturnValueOnce(jest.fn());

    useParams.mockReturnValueOnce({ dbId: "1" });

    render(<DbDetails />);

    // Wait for the API call and dispatches to complete
    await waitFor(() => {
      expect(getDbById).toHaveBeenCalledTimes(1);
      expect(getDbById).toHaveBeenCalledWith("1");
      expect(useDispatch).toHaveBeenCalledTimes(1);
      expect(setAllTablesData).toHaveBeenCalledWith({
        dbId: "1",
        tables: mockDbData.data.data.db.tables,
      });
    });

    // Assert that the rendered component displays the fetched data
    const table1Element = screen.getByText("Table 1");
    const table2Element = screen.getByText("Table 2");
    expect(table1Element).toBeInTheDocument();
    expect(table2Element).toBeInTheDocument();
  });
});
