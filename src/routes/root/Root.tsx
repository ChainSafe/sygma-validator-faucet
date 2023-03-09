import { Outlet } from 'react-router-dom';
import { Steps } from '../../components/Steps';
import { Step } from '../../types';

const steps: Step[] = [
  { name: 'A', route: '/' },
  { name: 'B', route: '/b' },
  { name: 'C', route: '/c' },
];

export function Root(): JSX.Element {
  return (
    <>
      <Steps steps={steps} />
      <Outlet />
    </>
  );
}
