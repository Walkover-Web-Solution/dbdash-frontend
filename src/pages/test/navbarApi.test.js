import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../../component/apiDoc/navbarApi/navbarApi';
// import "../../component/apiDoc/apiCrudTab/basicStuff/basicStuff.scss"
// jest.mock("../../component/apiDoc/apiCrudTab/basicStuff/basicStuff.scss", () => require('./styleMock.js'));



describe('Navbar Component', () => {
  it('renders the component without errors', () => {
    render(<Navbar />);
    // If no error is thrown during rendering, the test passes
  });

  it('renders the organization and dbs select element', () => {
    render(<Navbar />);
    const selectElement = screen.getByLabelText('Organization-db');
    expect(selectElement).toBeInTheDocument();
  });

  it('renders the tables select element when there are tables', () => {
    render(<Navbar />);
    const selectElement = screen.getByLabelText('Tables-Name');
    expect(selectElement).toBeInTheDocument();
  });

  it('renders the API Documentation section by default', () => {
    render(<Navbar />);
    const apiDocSection = screen.getByTestId('api-doc-section');
    expect(apiDocSection).toBeInTheDocument();
  });

  it('renders the Webhook section when Webhook button is clicked', () => {
    render(<Navbar />);
    const webhookButton = screen.getByText('Webhook');
    webhookButton.click();
    const webhookSection = screen.getByTestId('webhook-section');
    expect(webhookSection).toBeInTheDocument();
  });

  it('renders the Auth Key section when Auth Key button is clicked', () => {
    render(<Navbar />);
    const authKeyButton = screen.getByText('Auth Key');
    authKeyButton.click();
    const authKeySection = screen.getByTestId('auth-key-section');
    expect(authKeySection).toBeInTheDocument();
  });
});
