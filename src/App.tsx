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
          <>
            <Outlet />
            <SideMenu />
          </>
        </FlowContextProvider>
      </StorageContextProvider>
    </WalletContextProvider>
  );
}
