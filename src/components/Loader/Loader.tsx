import styled from 'styled-components';

const Loader = (): JSX.Element => {
  return (
    <LoaderWrapper>
      <svg height="24" width="24" viewBox="0 0 100 100">
        <LoaderCircle cx="50" cy="50" r="45"></LoaderCircle>
        <LoaderCircleAnimated cx="50" cy="50" r="45"></LoaderCircleAnimated>
      </svg>
    </LoaderWrapper>
  );
};

const LoaderWrapper = styled.div`
  display: flex;
  position: relative;
  align-content: space-around;
  justify-content: center;
`;

const LoaderCircle = styled.circle`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  fill: none;
  stroke-width: 8px;
  stroke: var(--grey-500);
  stroke-linecap: round;
`;

const LoaderCircleAnimated = styled(LoaderCircle)`
  stroke-width: 5px;
  stroke: var(--orange);
  stroke-dasharray: 242.6;
  animation: fill-animation 1s cubic-bezier(1, 1, 1, 1) 0s infinite;

  @keyframes fill-animation {
    0% {
      stroke-dasharray: 40 242.6;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 141.3;
      stroke-dashoffset: 141.3;
    }
    100% {
      stroke-dasharray: 40 242.6;
      stroke-dashoffset: 282.6;
    }
  }
`;

export default Loader;
