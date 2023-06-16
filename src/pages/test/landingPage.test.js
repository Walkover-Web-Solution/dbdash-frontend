import { shallow } from 'enzyme';
// import LandingPage from '../LandingPage';
// import MainNavbar from '../../component/mainNavbar/mainNavbar';
// import WorkspaceCombined from '../../component/workspaceDatabase/workspaceCombined';
// import SingleDatabase from '../../component/workspaceDatabase/singleDatabase';
import {LandingPage} from '../landingPage';
import {MainNavbar} from '../../component/mainNavbar/mainNavbar';
import {WorkspaceCombined} from '../../component/workspaceDatabase/workspaceCombined';
import {SingleDatabase} from '../../component/workspaceDatabase/singleDatabase';

describe('LandingPage', () => {
  it('renders MainNavbar component', () => {
    const wrapper = shallow(<LandingPage />);
    expect(wrapper.find(MainNavbar)).toHaveLength(1);
  });

  it('renders WorkspaceCombined component', () => {
    const wrapper = shallow(<LandingPage />);
    expect(wrapper.find(WorkspaceCombined)).toHaveLength(1);
  });

  it('renders "Deleted DataBase" heading when dbs array has elements', () => {
    const wrapper = shallow(<LandingPage />);
    wrapper.setState({ dbs: [{ _id: 1 }] }); // Set a mock value for dbs array
    expect(wrapper.find('Typography').text()).toEqual('Deleted DataBase');
  });

  it('does not render "Deleted DataBase" heading when dbs array is empty', () => {
    const wrapper = shallow(<LandingPage />);
    wrapper.setState({ dbs: [] }); // Set an empty array for dbs
    expect(wrapper.find('Typography')).toHaveLength(0);
  });

  it('renders SingleDatabase component for each item in dbs array', () => {
    const wrapper = shallow(<LandingPage />);
    wrapper.setState({ dbs: [{ _id: 1 }, { _id: 2 }, { _id: 3 }] }); // Set a mock value for dbs array
    expect(wrapper.find(SingleDatabase)).toHaveLength(3);
  });
});
