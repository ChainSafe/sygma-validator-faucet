import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onClick: () => void;
  type?: 'primary' | 'secondary';

  disabled?: boolean;
}
export function Button({ children, onClick, type = 'primary' }: Props): JSX.Element {
  console.log(type);
  return <button onClick={onClick}>{children}</button>;
}
