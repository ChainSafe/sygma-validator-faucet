import { Outlet } from 'react-router-dom';
import { SideMenu } from './components/SideMenu';

export function App(): JSX.Element {
  return (
    <>
      <div className="core">
        <Outlet />
      </div>
      <SideMenu />
    </>
  );
}
