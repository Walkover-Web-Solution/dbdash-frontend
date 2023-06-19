import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Notfoundpage from '../../component/notFoundPage';

describe('Notfoundpage Component', () => {
  it('renders the heading correctly', () => {
    const { getByText } = render(<Notfoundpage />);
    const headingElement = getByText('404 not found');
    expect(headingElement).toBeInTheDocument();
  });

  it('renders the component without errors', () => {
    render(<Notfoundpage />);
    // If no error is thrown during rendering, the test passes
  });
});
