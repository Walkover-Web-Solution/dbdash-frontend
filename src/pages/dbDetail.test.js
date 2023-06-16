import React from "react";
import { shallow, mount } from "enzyme";
import { MemoryRouter, Route } from "react-router-dom";
import {DbDetails} from "./dbDetail";

// import DbDetail from "./DbDetail"; 

// Mock the dependencies
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));
jest.mock("../api/dbApi", () => ({
  getDbById: jest.fn().mockResolvedValue({
    data: {
      data: {
        tables: [
          { id: 1, name: "Table 1" },
          { id: 2, name: "Table 2" },
        ],
      },
    },
  }),
}));
jest.mock("../store/allTable/allTableSlice", () => ({
  setAllTablesData: jest.fn(),
}));
jest.mock("../store/table/tableSlice", () => ({
  resetData: jest.fn(),
}));

describe("DbDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    shallow(<DbDetails />);
  });

  it("fetches table data and renders TablesList component", async () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={["/db/123"]}>
        <Route path="/db/:dbId" component={DbDetails} />
      </MemoryRouter>
    );

    await new Promise((resolve) => setImmediate(resolve));

    expect(wrapper.find("TablesList").props().tables).toEqual(2);
    expect(wrapper.find("TablesList").props().dbData).toEqual({
      db: { tables: [{ id: 1, name: "Table 1" }, { id: 2, name: "Table 2" }] },
    });

    expect(wrapper).toMatchSnapshot();
  });
});
