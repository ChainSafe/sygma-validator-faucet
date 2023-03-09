import { Outlet } from 'react-router-dom';
import { SideMenu } from './components/SideMenu';
import './App.css';
import {WalletContextProvider} from "./context/WalletContext";
import {StorageContextProvider} from "./context/StorageContext";

export function App(): JSX.Element {
  return (
    <WalletContextProvider>
      <StorageContextProvider>
      <>
        <Outlet />
        <SideMenu />
      </>
      </StorageContextProvider>
    </WalletContextProvider>
  );
}
