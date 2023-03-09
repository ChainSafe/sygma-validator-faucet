import {Heading} from "../../components/Heading";
import {Button} from "../../components/Button";
import {useNavigate} from "react-router-dom";

export function Summary(): JSX.Element {
  const value = "{value}";
  const currency = "{currency}";
  const network = "{network.name}";

  const navigate = useNavigate();
  const handleBridgeClick = () => {
    console.log("do magic on click");
    navigate("/transactions");
  };
  const handleBackClick = () => {
    console.log("do magic on click");
    navigate("/connect");
  };

  return (
    <>
      <Heading>Step 3: Summary</Heading>
      <div>You’re about to launch a validator on Goerli with {value} {currency} from {network}. Is that correct?</div>
      <Button onClick={handleBridgeClick}>Bridge Funds</Button>
      <Button onClick={handleBackClick}>Back</Button>
    </>
  )
}