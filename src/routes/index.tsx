import { createBrowserRouter } from 'react-router-dom';
import { App } from '../App';
import { Root } from './root';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
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
