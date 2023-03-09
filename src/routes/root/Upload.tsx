import {Heading} from "../../components/Heading";
import {JSONDropzone} from "../../components/JSONDropzone";
export function Upload(): JSX.Element {

  return (
    <>
      <Heading>Step 1: Upload Deposit Data</Heading>
      <div>Have you generated your mnemonic and validator public keys? If not, you can do so here.</div>
      <JSONDropzone />
    </>
  )
}