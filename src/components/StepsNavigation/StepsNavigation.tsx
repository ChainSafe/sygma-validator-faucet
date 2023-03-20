import { Fragment } from 'react';
import { useMatch } from 'react-router-dom';
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import ChevronRightIcon from '../../assets/icons/chevron-right.svg';
import { Step as StepInterface } from '../../types';

const steps: StepInterface[] = [
  { name: 'Upload Deposit Data', route: '/upload' },
  { name: 'Connect Wallet', route: '/connect' },
  { name: 'Summary', route: '/summary' },
  { name: 'Transactions', route: '/transactions' },
];

export function StepsNavigation(): JSX.Element {
  return (
    <StepsNavigationWrapper>
      {steps.map((step) => (
        <Fragment key={step.route}>
          <Step {...step} />
        </Fragment>
      ))}
    </StepsNavigationWrapper>
  );
}

function Step({ name, route }: StepInterface): JSX.Element {
  const match = useMatch(route);
  return <NavStep className={isEmpty(match) ? '' : 'step-active'}>{name}</NavStep>;
}

const StepsNavigationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 83px auto 72px auto;
`;

const NavStep = styled.div`
  margin-right: 44px;
  color: var(--grey-400);
  font-size: 1.125rem;
  position: relative;

  &:before {
    content: '';
    background-image: url(${ChevronRightIcon});
    background-size: 22px 22px;
    position: absolute;
    width: 22px;
    height: 22px;
    right: -30px;
  }

  &:last-child {
    &:before {
      display: none;
    }
  }

  &.step-active {
    color: var(--text-white);
  }
`;
