import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ReactComponent as LinkIcon } from '../../assets/icons/link.svg';
import ProgressStep from './ProgressStep';

interface Props {
  step: number;
  depositUrl?: string;
  proposalExecutionUrl?: string;
}

export function ProgressSteps({
  step,
  depositUrl,
  proposalExecutionUrl,
}: Props): JSX.Element {
  const handleSendingStep = (isCompleted: boolean): JSX.Element | string => {
    if (isCompleted && depositUrl) {
      return (
        <Link target="_blank" to={depositUrl}>
          Sending funds... <LinkIcon />
        </Link>
      );
    } else {
      return 'Sending funds...';
    }
  };
  const handleSuccessStep = (): JSX.Element | string => {
    if (proposalExecutionUrl) {
      return (
        <Link target="_blank" to={proposalExecutionUrl}>
          Success <LinkIcon />
        </Link>
      );
    } else return 'Success';
  };

  return (
    <ProgressStepsWrapper>
      <ProgressStep value="1/4" description="Initializing" isCompleted={step >= 0} />
      <ProgressStep
        value="2/4"
        description={handleSendingStep(step >= 1)}
        isCompleted={step >= 1}
      />
      <ProgressStep
        value="3/4"
        description="You are in the deposit queue"
        isCompleted={step >= 2}
      />
      <ProgressStep
        value="4/4"
        description={handleSuccessStep()}
        isCompleted={step == 2}
      />
    </ProgressStepsWrapper>
  );
}

const ProgressStepsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 61px auto 20px auto;
  max-width: 251px;

  & > :last-child {
    div:before {
      display: none;
    }
  }
  svg {
  }
`;

export default ProgressSteps;
