import { Outlet } from 'react-router-dom';
import { SideMenu } from './components/SideMenu';
import { JSONDropzone } from './components/Dropzone';
// import WalletConnect from '@walletconnect/web3-provider';
// import Web3Modal from 'web3modal';
// import { DemoAbi as Abi } from './abi';
// import { Contract } from 'web3-eth-contract';

// const web3Modal = new Web3Modal({
//   network: 'goerli',
//   theme: 'light',
//   cacheProvider: false,
//   providerOptions: {
//     walletconnect: {
//       package: WalletConnect,
//       options: {
//         infuraId: import.meta.env.REACT_APP_INFURA_PROJECT_ID,
//       },
//     },
//   },
// });

export function App(): JSX.Element {
  // const [web3, setWeb3] = useState<Web3 | null>(null);
  // const onConnect = async (): Promise<void> => {
  //   const provider = await web3Modal.connect();
  //   const web3 = new Web3(provider);
  //   setWeb3(web3);
  // };

  // const disconnectWeb3Modal = (): void => {
  //   web3Modal.clearCachedProvider();
  //   console.log('cleared cached provider');
  // };

  // const callContractMethod = (): void => {
  //   if (web3) {
  //     const contract: Contract<typeof Abi> = new web3.eth.Contract(
  //       Abi,
  //       '0x9d15e18Aed0568FB829b857BA1acd1ac8fd68474',
  //     );
  //   }
  // };
  return (
    <>
      <Outlet />
      <SideMenu />
      <div>
        <button className="btn btn-primary">Primary Button</button>
        <button className="btn btn-secondary">Secondary Button</button>
        <button disabled className="btn btn-secondary">
          Disabled Button
        </button>
      </div>
      <JSONDropzone></JSONDropzone>
    </>
  );
}
