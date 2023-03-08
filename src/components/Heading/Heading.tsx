import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
export function Heading({ children }: Props): JSX.Element {
  return <h1>{children}</h1>;
}
