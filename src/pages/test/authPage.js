import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Authpage from '../authPage';
import axios from "axios";
import { toast } from "react-toastify";

describe('Authpage component', () => {
  it('renders the component correctly', () => {
    render(<Authpage />);
  
    // Ensure that the component renders without throwing an error
    // You can add more specific assertions based on the component's structure
    expect(screen.getByText('DB DASH')).toBeInTheDocument();
    expect(screen.getByText('Create Your Account!')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });
  
  it('renders the login page by default', () => {
    render(<Authpage />);
  
    // Ensure that the login page is rendered by default
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('No account?')).toBeInTheDocument();
  });
  
  it('renders the signup page when switching to signup', () => {
    render(<Authpage />);
  
    // Switch to the signup page
    fireEvent.click(screen.getByText('Create an account!'));
  
    // Ensure that the signup page is rendered
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Already a User?')).toBeInTheDocument();
  });
  
  it('calls the signupHandleSubmit function on signup form submission', () => {
    const signupHandleSubmit = jest.fn();
    render(<Authpage />);
  
    // Switch to the signup page
    fireEvent.click(screen.getByText('Create an account!'));
  
    // Fill in the signup form
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
  
    // Submit the signup form
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
  
    // Ensure that the signupHandleSubmit function is called with the correct data
    expect(signupHandleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    });
  });
  
  it('calls the loginHandleSubmit function on login form submission', () => {
    const loginHandleSubmit = jest.fn();
    render(<Authpage />);
  
    // Fill in the login form
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
  
    // Submit the login form
    fireEvent.click(screen.getByRole('button', { name: 'Log In' }));
  
    // Ensure that the loginHandleSubmit function is called with the correct data
    expect(loginHandleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
