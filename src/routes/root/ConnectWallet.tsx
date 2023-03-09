import {Heading} from "../../components/Heading";
import {useNavigate} from "react-router-dom";
import {Button} from "../../components/Button";
import {useWallet} from "../../context/WalletContext";

export function ConnectWallet(): JSX.Element {
  const wallet = useWallet();
  console.log(wallet);

  const navigate = useNavigate();
  const handleConnectClick = () => {
    console.log("click on connect");
    wallet.connect().then((pass) => {
      console.log(pass);
      if (pass) navigate("/summary");
    });
  };

  return (
    <>
      <Heading>Step 2: Connect Wallet</Heading>
      <Button onClick={handleConnectClick}>Connect</Button>
    </>
  )
}