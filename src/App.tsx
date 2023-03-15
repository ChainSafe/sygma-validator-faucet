import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import { SideMenu } from './components/SideMenu';
import { WalletContextProvider } from './context/WalletContext';
import { StorageContextProvider } from './context/StorageContext';
import { FlowContextProvider } from './context/FlowContext';

export function App(): JSX.Element {
  return (
    <WalletContextProvider>
      <StorageContextProvider>
        <FlowContextProvider>
          <Layout>
            <SideMenu />
            <div>
              <Outlet />
            </div>
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

  & > :last-child {
    flex-basis: 0;
    flex-grow: 99999;
    min-inline-size: 50%;
  }
`;
