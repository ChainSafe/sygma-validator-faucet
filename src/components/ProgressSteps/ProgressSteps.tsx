import styled from 'styled-components';
import React from 'react';
import ProgressStep from './ProgressStep';

// TODO: Replace with real data
const num = '${num}';
export function ProgressSteps(): JSX.Element {
  return (
    <ProgressStepsWrapper>
      <ProgressStep value="1/4" description="Initializing" isCompleted={true} />
      <ProgressStep value="2/4" description="Sending funds..." />
      <ProgressStep value="3/4" description={`You are ${num} in the deposit queue`} />
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
