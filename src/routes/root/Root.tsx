import { Navigate, Outlet, useLocation } from 'react-router-dom';
import React from 'react';
import { useStorage } from '../../context/StorageContext';
import { Spinner } from '../../components/Spinner';
import { useWallet } from '../../context/WalletContext';
import { StepsNavigation } from '../../components/StepsNavigation/StepsNavigation';

export function Root(): JSX.Element {
  const storage = useStorage();
  const wallet = useWallet();
  const location = useLocation();

  if (!storage.isReady) return <Spinner />;

  if (
    ['/connect', '/summary', '/transactions'].some(
      (path) => location.pathname === path,
    ) &&
    !storage.data.json
  )
    return <Navigate to="/upload" replace={true} />;

  // Guard's
  if (
    ['/summary', '/transactions'].some((path) => location.pathname === path) &&
    !wallet.web3
  )
    return <Navigate to="/connect" replace={true} />;

  return (
    <>
      <StepsNavigation />
      <Outlet />
    </>
  );
}
