import {Navigate, Outlet, useLocation} from 'react-router-dom';
import { Steps } from '../../components/Steps';
import { Step } from '../../types';
import {useStorage} from "../../context/StorageContext";
import {Spinner} from "../../components/Spinner";
import {useWallet} from "../../context/WalletContext";

const steps: Step[] = [
  { name: 'Upload Deposit Data', route: '/' },
  { name: 'Connect Wallet', route: '/connect' },
  { name: 'Summary', route: '/summary' },
  { name: 'Transactions', route: '/transactions' },
];

export function Root(): JSX.Element {
  const storage = useStorage();
  const wallet = useWallet();
  const location = useLocation();

  if (!storage.isReady) return <Spinner />;

  // Guard's
  if (['/summary', '/transactions'].some(path => location.pathname === path) && !wallet.web3)
    return <Navigate to="/connect" replace={true} />;
  // TODO: add guard's for missing JSON data

  return (
    <>
      <Steps steps={steps} />
      <Outlet />
    </>
  );
}
