import styled from 'styled-components';
import React from 'react';
import checkmark from '../../assets/icons/checkmark.svg';
import Loader from '../Loader/Loader';

type ProgressStepProps = {
  value: string;
  description: string | JSX.Element;
  isCompleted?: boolean;
};

function ProgressStep({
  value,
  description,
  isCompleted = false,
}: ProgressStepProps): JSX.Element {
  return (
    <ProgressStepStyled>
      <div>
        <ProgressStepState>{value}</ProgressStepState>
        <ProgressStepText>{description}</ProgressStepText>
      </div>
      <ProgressStepIndicator>
        {isCompleted ? <img src={checkmark} alt={'progress icon'} /> : <Loader />}
      </ProgressStepIndicator>
    </ProgressStepStyled>
  );
}

const ProgressStepStyled = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.125rem;
  font-weight: 400;
  color: var(--grey-200);
  padding: 12px 0;
  margin-bottom: 18px;
  line-height: 22px;

  & > div {
    display: flex;
  }
`;
const ProgressStepState = styled.div`
  position: relative;

  &:before {
    content: '';
    position: absolute;
    width: 21px;
    left: 2px;
    top: 40px;
    border: 1px solid var(--grey-500);
    transform: rotate(90deg);
  }
`;
const ProgressStepText = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  svg {
    margin-bottom: -6px;
    path {
      fill: #646cff;
    }
  }
`;

const ProgressStepIndicator = styled.div`
  margin-left: 22px;
  img {
    width: 24px;
    height: 24px;
  }
`;

export default ProgressStep;
