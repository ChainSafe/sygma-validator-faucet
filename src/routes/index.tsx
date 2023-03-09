import { createBrowserRouter } from 'react-router-dom';
import { App } from '../App';
import { Root } from './root';
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
            element: <div>A</div>,
          },
          {
            path: '/b',
            element: <div>B</div>,
          },
          {
            path: '/c',
            element: <div>C</div>,
          },
        ],
      },
    ],
  },
]);
