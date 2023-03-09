import { Outlet } from 'react-router-dom';
import { SideMenu } from './components/SideMenu';
import './App.css';

export function App(): JSX.Element {

  return (
    <>
      <Outlet />
      <SideMenu />
    </>
  );
}
