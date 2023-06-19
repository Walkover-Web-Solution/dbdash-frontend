import React from 'react';
import '@testing-library/jest-dom/extend-expect';

import { render, screen } from "@testing-library/react";
import TextArea from "../../component/TextArea/TextArea";
// import { fireEvent } from '@testing-library/react/types';
// import { fireEvent, render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";



test("renders TextArea component", () => {
  render(<TextArea onMessageSubmit={() => {}} isLoading={false} />);
  const textAreaElement = screen.getByPlaceholderText("Ask Something...");
  const buttonElement = screen.getByText("Ask");
  expect(textAreaElement).toBeInTheDocument();
  expect(buttonElement).toBeInTheDocument();
});


test("handles input change", () => {
    render(<TextArea onMessageSubmit={() => {}} isLoading={false} />);
    const textAreaElement = screen.getByPlaceholderText("Ask Something...");
    fireEvent.change(textAreaElement, { target: { value: "Test input" } });
    expect(textAreaElement.value).toBe("Test input");
  });

  test("submits form with valid input", () => {
    const handleSubmit = jest.fn();
    render(<TextArea onMessageSubmit={handleSubmit} isLoading={false} />);
    const textAreaElement = screen.getByPlaceholderText("Ask Something...");
    fireEvent.change(textAreaElement, { target: { value: "Test input" } });
    fireEvent.click(screen.getByText("Ask"));
    expect(handleSubmit).toHaveBeenCalledWith("Test input");
  });


  test("does not submit form when isLoading is true", () => {
    const handleSubmit = jest.fn();
    render(<TextArea onMessageSubmit={handleSubmit} isLoading={true} />);
    const textAreaElement = screen.getByPlaceholderText("Ask Something...");
    fireEvent.change(textAreaElement, { target: { value: "Test input" } });
    fireEvent.click(screen.getByText("Ask"));
    expect(handleSubmit).not.toHaveBeenCalled();
  });