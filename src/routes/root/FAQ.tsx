import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const FAQ: FC = () => {
  const [active, setActive] = useState<number[]>([]);

  const handleToggle = (index: number): void => {
    if (active.includes(index)) {
      const removed = active.filter(function (item) {
        return item !== index;
      });
      setActive(removed);
    } else {
      setActive([...active, index]);
    }
  };

  return (
    <FaqContainer>
      <FaqTitle>Frequently Asked Questions</FaqTitle>
      <FaqWrapper>
        <FaqItem key={0}>
          <FaqQuestion active={active.includes(0)} onClick={() => handleToggle(0)}>
            What is Goerli Validator Launchpad?
          </FaqQuestion>
          <FaqAnswer active={active.includes(0)}>
            This is an app that allows Ethereum stakers to quickly test their validator
            setups. Due to scarcity of testnet Ether on faucets, we will subsidize up to
            90% of your validator deposit. You only need to deposit a minimum of 3.3
            testnet Ether from an Ethereum, Polygon or Moonbeam testnet. This app will
            sponsor the rest of your deposit of 32eth, automatically bridge your deposit
            and stake it on Goerli.
          </FaqAnswer>
        </FaqItem>
        <FaqItem key={1}>
          <FaqQuestion active={active.includes(1)} onClick={() => handleToggle(1)}>
            Who are we and why did we build this?
          </FaqQuestion>
          <FaqAnswer active={active.includes(1)}>
            ChainSafe is a blockchain infrastructure R&D firm. We built this in lieu of
            recent events that created problems for people using the Goerli network for
            its intended purposes.
          </FaqAnswer>
        </FaqItem>
        <FaqItem key={2}>
          <FaqQuestion active={active.includes(2)} onClick={() => handleToggle(2)}>
            What testnets are supported?
          </FaqQuestion>
          <FaqAnswer active={active.includes(2)}>
            We currently support deposits from Polygon Mumbai, Moonbeam Moonbase Alpha,
            and Goerli.
          </FaqAnswer>
        </FaqItem>
        <FaqItem key={3}>
          <FaqQuestion active={active.includes(3)} onClick={() => handleToggle(3)}>
            How much testnet eth do I need?
          </FaqQuestion>
          <FaqAnswer active={active.includes(3)}>
            You need a minimum of 3.3 testnet Ether, we will subsidize the rest.
          </FaqAnswer>
        </FaqItem>
        <FaqItem key={4}>
          <FaqQuestion active={active.includes(4)} onClick={() => handleToggle(4)}>
            Can I withdraw my testnet eth?
          </FaqQuestion>
          <FaqAnswer active={active.includes(4)}>
            Yes, but only back to our contract.{' '}
            <Link
              target="_blank"
              to="https://blog.ethereum.org/2023/03/08/goerli-shapella-announcement"
            >
              Shapella upgrade on Goerli testnet.
            </Link>
          </FaqAnswer>
        </FaqItem>
        <FaqItem key={5}>
          <FaqQuestion active={active.includes(5)} onClick={() => handleToggle(5)}>
            What do I do after staking?
          </FaqQuestion>
          <FaqAnswer active={active.includes(5)}>
            After your deposit is received, you can go back to your client for further
            testing.
          </FaqAnswer>
        </FaqItem>
        <FaqItem key={6}>
          <FaqQuestion active={active.includes(6)} onClick={() => handleToggle(6)}>
            How does it work?
          </FaqQuestion>
          <FaqAnswer active={active.includes(6)}>
            To test your validator setup, the first thing you need to do is generate your
            keys. If you haven’t done so already,{' '}
            <Link target="_blank" to="https://launchpad.ethereum.org/en/overview">
              choose a way to generate them
            </Link>{' '}
            and come back when you’re done. Once Goerli Validator Launchpad receives your
            deposit-data.json file and some testnet Ether, it will relay this transaction
            from the origin testnet to Goerli. We use{' '}
            <Link target="_blank" to="https://buildwithsygma.com/">
              Sygma
            </Link>{' '}
            SDK for the bridging,
            <Link target="_blank" to="https://lodestar.chainsafe.io/">
              Lodestar’s
            </Link>{' '}
            <Link target="_blank" to="https://github.com/ChainSafe/bls">
              bls
            </Link>{' '}
            and{' '}
            <Link target="_blank" to="https://github.com/ChainSafe/ssz">
              ssz
            </Link>{' '}
            libraries for hashing and verification, and{' '}
            <Link target="_blank" to="https://web3js.org/#/">
              web3.js
            </Link>{' '}
            for the contract interactions.
          </FaqAnswer>
        </FaqItem>
        <FaqItem key={7}>
          <FaqQuestion active={active.includes(7)} onClick={() => handleToggle(7)}>
            Where can I get help?
          </FaqQuestion>
          <FaqAnswer active={active.includes(7)}>
            If you run into any issues, please don't hesitate to drop a question in our{' '}
            <Link target="_blank" to="https://discord.com/invite/Qdf6GyNB5J">
              Discord
            </Link>
            .
          </FaqAnswer>
        </FaqItem>
      </FaqWrapper>
    </FaqContainer>
  );
};

const FaqContainer = styled.div`
  max-height: 100vh;
  overflow: scroll;
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
`;
const FaqTitle = styled.h1`
  padding: 30px 20px 20px 20px;
  margin: 0;
  font-size: 30px;
  border-radius: 12px;
`;
const FaqWrapper = styled.div`
  border-radius: 12px;
`;
const FaqItem = styled.div`
  padding: 20px 0;
  &:first-child {
    border-radius: 12px 12px 0 0;
  }
  &:last-child {
    border-radius: 0 0 12px 12px;
  }
`;

const FaqQuestion = styled.div`
  color: var(--blue-900);
  font-size: 20px;
  padding: 20px;
  background: var(--orange);
  border-radius: ${({ active }: FaqAnswerProps) => (active ? '12px 12px 0 0' : '12px')};
  cursor: pointer;
`;

const FaqAnswer = styled.div<FaqAnswerProps>`
  padding: 20px;
  background: var(--blue-900);
  display: ${({ active }: FaqAnswerProps) => (active ? 'block' : 'none')};
  border-radius: ${({ active }: FaqAnswerProps) => (active ? '0 0 12px 12px' : 'none')};
`;

interface FaqAnswerProps {
  active: boolean;
}
