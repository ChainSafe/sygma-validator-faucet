import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import { SideMenu } from './components/SideMenu';
import { WalletContextProvider } from './context/WalletContext';
import { StorageContextProvider } from './context/StorageContext';
import { FlowContextProvider } from './context/FlowContext';
import breakpoints from './styles/breakpoints';

export function App(): JSX.Element {
  return (
    <WalletContextProvider>
      <StorageContextProvider>
        <FlowContextProvider>
          <Layout>
            <SideMenu />
            <Main>
              <Outlet />
            </Main>
            <RightColumn />
          </Layout>
        </FlowContextProvider>
      </StorageContextProvider>
    </WalletContextProvider>
  );
}

const Layout = styled.div`
  display: flex;
  flex-wrap: nowrap;
  height: 100vh;

  & > :first-child {
    flex-grow: 1;
    max-width: 212px;
    width: 100%;
  }

  & > :nth-child(2) {
    flex-basis: 0;
    flex-grow: 99999;
    min-inline-size: 50%;
  }

  & > :last-child {
    flex-grow: 1;
    max-width: 212px;
    width: 100%;
  }
`;

const Main = styled.main`
  margin: 0 20px;

  @media (min-width: ${breakpoints.screenMd}) {
    margin: 0 5%;
    color: var(--screen-md);
  }
`;

const RightColumn = styled.div`
  background: var(--blue-900);
`;
