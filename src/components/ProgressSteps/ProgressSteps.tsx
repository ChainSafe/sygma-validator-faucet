import styled from 'styled-components';
import React from 'react';
import ProgressStep from './ProgressStep';

interface Props {
  step: number;
}

export function ProgressSteps({ step }: Props): JSX.Element {
  return (
    <ProgressStepsWrapper>
      <ProgressStep value="1/4" description="Initializing" isCompleted={step >= 0} />
      <ProgressStep value="2/4" description="Sending funds..." isCompleted={step >= 1} />
      <ProgressStep
        value="3/4"
        description="You are in the deposit queue"
        isCompleted={step >= 2}
      />
      <ProgressStep value="4/4" description="Success" isCompleted={step == 2} />
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
`;

export default ProgressSteps;
