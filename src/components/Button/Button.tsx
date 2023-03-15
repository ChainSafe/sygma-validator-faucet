import { ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  onClick: () => void;
  variant: 'primary' | 'secondary';
  disabled?: boolean;
}
export function Button({ children, disabled, variant, onClick }: Props): JSX.Element {
  return (
    <ButtonStyled onClick={onClick} variant={variant} disabled={disabled} type={'button'}>
      {children}
    </ButtonStyled>
  );
}

const ButtonStyled = styled.button<Props>`
  cursor: pointer;
  padding: 5px 24px;
  height: 40px;
  border-radius: 12px;
  text-align: center;
  font-size: 1.125rem;
  font-weight: 500;
  font-family: var(--font-family-main);
  outline: none;
  border: none;
  color: ${({ variant }) => textColors[variant]};
  background-color: ${({ variant }) => backgroundColors[variant]};

  &:active {
    color: ${({ variant }) => textColorsActive[variant]};
    background-color: ${({ variant }) => backgroundColorsActive[variant]};
  }

  &:disabled {
    color: var(--btn-color-disabled);
    background-color: var(--grey-400);
  }
`;

const backgroundColors = {
  primary: 'var(--orange)',
  secondary: 'var(--grey-500)',
};

const backgroundColorsActive = {
  primary: 'var(--btn-bg-active)',
  secondary: 'var(--blue-500)',
};

const textColors = {
  primary: 'var(--text-blue)',
  secondary: 'var(--text-white)',
};

const textColorsActive = {
  primary: 'var(--text-blue)',
  secondary: 'var(--text-white)',
};
