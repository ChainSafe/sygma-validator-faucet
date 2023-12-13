import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { TransferStatusResponse } from '@buildwithsygma/sygma-sdk-core';
import { ReactComponent as LinkIcon } from '../../assets/icons/link.svg';
import ProgressStep from './ProgressStep';

interface Props {
  transferStatus?: TransferStatusResponse;
  depositUrl?: string;
}

export function ProgressSteps({ transferStatus, depositUrl }: Props): JSX.Element {
  const handleSendingStep = (): JSX.Element | string => {
    if (transferStatus) {
      return (
        <Link target="_blank" to={depositUrl ?? ''}>
          Deposit URL <LinkIcon />
        </Link>
      );
    } else return 'Deposit pending...';
  };
  const handleSuccessStep = (): JSX.Element | string => {
    if (transferStatus?.status) {
      return (
        <Link target="_blank" to={transferStatus.explorerUrl}>
          Transfer status: {transferStatus?.status} <LinkIcon />
        </Link>
      );
    } else return 'Success';
  };
  return (
    <ProgressStepsWrapper>
      <ProgressStep
        value="1/3"
        description={depositUrl ? 'Transaction send' : 'Pending transaction...'}
        isCompleted={!!depositUrl}
      />
      {!!depositUrl && (
        <ProgressStep
          value="2/3"
          description={handleSendingStep()}
          isCompleted={!!transferStatus}
        />
      )}
      {!!transferStatus && (
        <ProgressStep
          value="3/3"
          description={handleSuccessStep()}
          isCompleted={!!transferStatus && transferStatus.status === 'executed'}
        />
      )}
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
