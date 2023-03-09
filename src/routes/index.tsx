import { createBrowserRouter } from 'react-router-dom';
import { App } from '../App';
import { Root } from './root';
import ErrorPage from './ErrorPage';
import { JSONDropzone } from '../components/Dropzone';
import { ConnectWallet } from '../components/ConnectWallet';
import { Summary } from '../components/Summary';
import { Transactions } from '../components/Transactions';

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
            element: <JSONDropzone />,
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
