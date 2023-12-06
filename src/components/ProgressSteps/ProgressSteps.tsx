import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { TransferStatus } from '@buildwithsygma/sygma-sdk-core';
import { ReactComponent as LinkIcon } from '../../assets/icons/link.svg';
import ProgressStep from './ProgressStep';

interface Props {
  step: TransferStatus;
  depositUrl: string;
  explorerUrl?: string;
}

export function ProgressSteps({ step, depositUrl, explorerUrl }: Props): JSX.Element {
  const handlePendingStep = (): JSX.Element | string => {
    return (
      <Link target="_blank" to={depositUrl}>
        Sending funds... <LinkIcon />
      </Link>
    );
  };
  const handleSuccessStep = (): JSX.Element | string => {
    if (explorerUrl) {
      return (
        <Link target="_blank" to={explorerUrl}>
          Success <LinkIcon />
        </Link>
      );
    } else return 'Success';
  };

  return (
    <ProgressStepsWrapper>
      <ProgressStep
        value="1/2"
        description={handlePendingStep()}
        isCompleted={step === 'pending'}
      />
      <ProgressStep
        value="2/2"
        description={handleSuccessStep()}
        isCompleted={step === 'executed'}
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
