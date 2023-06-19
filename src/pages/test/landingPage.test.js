const { render } = require('@testing-library/react');
const LandingPage = require('../landingPage').default;

test('renders main navbar component', () => {
  const { getByTestId } = render(<LandingPage />);
  const mainNavbar = getByTestId('main-navbar');
  expect(mainNavbar).toBeInTheDocument();
});

test('renders workspace combined component', () => {
  const { getByTestId } = render(<LandingPage />);
  const workspaceCombined = getByTestId('workspace-combined');
  expect(workspaceCombined).toBeInTheDocument();
});

test('renders deleted databases section when there are deleted databases', () => {
  const mockDbs = [
    { _id: '1', deleted: true },
    { _id: '2', deleted: true },
  ];
  jest.mock('../store/database/databaseSelector', () => ({
    selectOrgandDb: jest.fn(() => mockDbs),
  }));

  const { getByTestId } = render(<LandingPage />);
  const deletedDatabases = getByTestId('deleted-databases');
  expect(deletedDatabases).toBeInTheDocument();
});

test('does not render deleted databases section when there are no deleted databases', () => {
  const mockDbs = [];
  jest.mock('../store/database/databaseSelector', () => ({
    selectOrgandDb: jest.fn(() => mockDbs),
  }));

  const { queryByTestId } = render(<LandingPage />);
  const deletedDatabases = queryByTestId('deleted-databases');
  expect(deletedDatabases).not.toBeInTheDocument();
});

test('renders single database components', () => {
  const mockDbs = [
    { _id: '1', org_id: 'org1' },
    { _id: '2', org_id: 'org2' },
  ];
  jest.mock('../store/database/databaseSelector', () => ({
    selectOrgandDb: jest.fn(() => mockDbs),
  }));

  const { getAllByTestId } = render(<LandingPage />);
  const singleDatabases = getAllByTestId('single-database');
  expect(singleDatabases.length).toBe(mockDbs.length);
});
