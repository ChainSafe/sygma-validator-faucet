import {Heading} from "../../components/Heading";
import {JSONDropzone} from "../../components/JSONDropzone";
import {Button} from "../../components/Button";
import { useNavigate } from "react-router-dom";
export function Upload(): JSX.Element {
  const navigate = useNavigate();
  const handleContinueClick = () => {
    console.log("do magic on click");
    navigate("/connect");
  };

  return (
    <>
      <Heading>Step 1: Upload Deposit Data</Heading>
      <div>Have you generated your mnemonic and validator public keys? If not, you can do so here.</div>
      <JSONDropzone />
      <Button onClick={handleContinueClick}>Continue</Button>
    </>
  )
}