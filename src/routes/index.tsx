import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from '../App';
import { ConnectWallet, Root, Summary, Transactions, Upload } from './root';
import ErrorPage from './ErrorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Root />,
        children: [
          {
            index: true,
            element: <Navigate to="/upload" replace={true} />,
          },
          {
            path: '/upload',
            element: <Upload />,
          },
          {
            path: '/connect',
            element: <ConnectWallet />,
          },
          {
            path: '/summary',
            element: <Summary />,
          },
          {
            path: '/transactions',
            element: <Transactions />,
          },
        ],
      },
    ],
  },
]);
