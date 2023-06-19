import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {ApiDocPage} from '../apidocPage';

describe('ApiDocPage', () => {
  it('renders the main navbar and navbar API components', () => {
    render(
      <MemoryRouter>
        <ApiDocPage />
      </MemoryRouter>
    );

    // Assert that the main navbar is rendered
    expect(screen.getByRole('navigation', { name: 'MainNavbar' })).toBeInTheDocument();

    // Assert that the navbar API is rendered
    expect(screen.getByRole('navigation', { name: 'NavbarApi' })).toBeInTheDocument();
  });

  it('passes the correct props to the main navbar and navbar API components', () => {
    render(
      <MemoryRouter>
        <ApiDocPage />
      </MemoryRouter>
    );

    // Assert that the dbtoredirect prop is passed to the main navbar component
    expect(screen.getByRole('navigation', { name: 'MainNavbar' })).toHaveAttribute(
      'dbtoredirect',
      ''
    );

    // Assert that the tabletoredirect prop is passed to the main navbar component
    expect(screen.getByRole('navigation', { name: 'MainNavbar' })).toHaveAttribute(
      'tabletoredirect',
      ''
    );

    // Assert that the dbtoredirect prop is passed to the navbar API component
    expect(screen.getByRole('navigation', { name: 'NavbarApi' })).toHaveAttribute(
      'dbtoredirect',
      ''
    );

    // Assert that the tabletoredirect prop is passed to the navbar API component
    expect(screen.getByRole('navigation', { name: 'NavbarApi' })).toHaveAttribute(
      'tabletoredirect',
      ''
    );
  });
});
