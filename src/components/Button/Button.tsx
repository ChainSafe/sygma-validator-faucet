import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onClick: () => void;
  type?: 'primary' | 'secondary';

  disabled?: boolean;
}
export function Button({ children, onClick }: Props): JSX.Element {
  return <button onClick={onClick}>{children}</button>;
}
