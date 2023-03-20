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

  // Guard's
  if (
    ['/summary', '/transactions'].some((path) => location.pathname === path) &&
    !wallet.web3
  )
    return <Navigate to="/connect" replace={true} />;
  // TODO: add guard's for missing JSON data

  return (
    <>
      <StepsNavigation />
      <Outlet />
    </>
  );
}
