import { render, fireEvent } from "@testing-library/react";
import PopupModal from "../../component/popupModal";
// import PopupModal from "./PopupModal";

test("modal opens and closes correctly", () => {
  const setOpen = jest.fn();
  const { getByTestId } = render(
    <PopupModal open={true} setOpen={setOpen} />
  );

  const modal = getByTestId("modal");
  expect(modal).toBeInTheDocument();

  const closeButton = getByTestId("close-button");
  fireEvent.click(closeButton);
  expect(setOpen).toHaveBeenCalledWith(false);
});
