import { Outlet } from 'react-router-dom';
import { Steps } from '../../components/Steps';
import { Step } from '../../types';
import { SideMenu } from '../../components/SideMenu';

const steps: Step[] = [
  { name: 'Upload Deposit Data', route: '/' },
  { name: 'Connect Wallet', route: '/connect' },
  { name: 'Summary', route: '/summary' },
  { name: 'Transactions', route: '/transactions' },
];

export function Root(): JSX.Element {
  return (
    <>
      <Steps steps={steps} />
      <Outlet />
    </>
  );
}
