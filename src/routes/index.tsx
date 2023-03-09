import { createBrowserRouter } from 'react-router-dom';
import { App } from '../App';
import {ConnectWallet, Root, Summary, Transactions, Upload} from './root';
import ErrorPage from './ErrorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Root />,
        children: [
          {
            path: '/',
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
