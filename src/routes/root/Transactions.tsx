import { Heading } from '../../components/Heading';
import ProgressSteps from '../../components/ProgressSteps/ProgressSteps';

import { useSygmaSDK } from '../../hooks/useSygma';

export function Transactions(): JSX.Element {
  const { transferStatus, depositUrl } = useSygmaSDK();

  if (!transferStatus || !depositUrl)
    return <p>Failed to get transfer status from Sygma</p>;
  return (
    <>
      <Heading>Step 4: Transactions</Heading>
      {transferStatus.status === 'failed' ? (
        <ProgressSteps
          step={transferStatus.status}
          depositUrl={depositUrl}
          explorerUrl={transferStatus.explorerUrl}
        />
      ) : (
        <p>Could not launch a validator on Holesky</p>
      )}
    </>
  );
}
