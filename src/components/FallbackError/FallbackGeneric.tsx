import styled from 'styled-components';
import { Button } from '../Button';

function FallbackGeneric({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}): JSX.Element {
  return (
    <Wrapper role="alert">
      <p>
        Oops...unexpected error occurred. Please try again or report the bug by the link
      </p>
      <a
        target="_blank"
        href="https://github.com/ChainSafe/sygma-validator-faucet/issues/new"
      >
        Report the bug
      </a>
      <ErrorMessage>{error.message}</ErrorMessage>
      <Button variant={'primary'} onClick={resetErrorBoundary}>
        Try again
      </Button>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 1px solid var(--red);
  border-radius: 12px;
  margin: 16px 0;
  padding: 16px;
`;

const ErrorMessage = styled.pre`
  color: var(--red);
`;

export default FallbackGeneric;
