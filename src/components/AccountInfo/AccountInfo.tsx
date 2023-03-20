import styled from 'styled-components';
import { useEnsuredWallet } from '../../context/WalletContext';
import truncateEthAddress from '../../utils/address';

const AccountInfo = (): JSX.Element => {
  const wallet = useEnsuredWallet();

  return (
    <AccountInfoStyled>
      {wallet.account && truncateEthAddress(wallet.account)}
    </AccountInfoStyled>
  );
};

const AccountInfoStyled = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--grey-500);
  padding: 8px 20px;
  border-radius: 10px;
  align-self: center;
  position: relative;

  &::before {
    content: '';
    margin-right: 7px;
    width: 10.42px;
    height: 10.42px;
    border-radius: 50%;
    background-color: #3cd124;
  }
`;

export default AccountInfo;
