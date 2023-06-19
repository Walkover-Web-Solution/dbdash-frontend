import 'identity-obj-proxy';
import React from 'react';
import { render } from '@testing-library/react';
import {MainNavbar} from '../../component/mainNavbar/mainNavbar';
// import sty from "../../assets/styling.scss"
// import MainNavbar from './MainNavbar';
// ../assets/styling.scss'
jest.mock('../../assets/styling.scss', () => require('./styleMock.js'));  //location problem


describe('MainNavbar Component', () => {
  it('renders without error', () => {
    render(<MainNavbar />);
  });
});
