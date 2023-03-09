import {Heading} from "../../components/Heading";
import {Navigate, useNavigate} from "react-router-dom";
import {Button} from "../../components/Button";
import {useWallet} from "../../context/WalletContext";

export function ConnectWallet(): JSX.Element {
  const wallet = useWallet();

  const handleConnectClick = () => {
    console.log("click on connect");
    void wallet.connect();
  };

  if (!wallet.web3)
    return (
      <>
        <Heading>Step 2: Connect Wallet</Heading>
        <Button onClick={handleConnectClick}>Connect</Button>
      </>
    )

  return <Navigate to="/summary" />;
}
