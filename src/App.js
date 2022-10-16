import React from "react";
import Cover from "./components/minter/Cover";
import { Notification } from "./components/ui/Notifications";

import { useBalance, useVerifiContract } from "./hooks";
import Nfts from "./components/minter/nfts";
import { useContractKit } from "@celo-tools/use-contractkit";
import "./App.css";
import { Container } from "react-bootstrap";
import NavBar from "./NavBar";

const App = function AppWrapper() {
  const { address, destroy, connect } = useContractKit();

  //  fetch user's celo balance using hook
  const { balance, getBalance } = useBalance();

  // initialize the NFT mint contract
  const vContract = useVerifiContract();

  return (
    <>
      <Notification />
      {address && (
        <NavBar
          address={address}
          balance={balance}
          destroy={destroy}
          connect={connect}
        />
      )}

      {address ? (
        <Container fluid="md">
          <main>
            <Nfts updateBalance={getBalance} vContract={vContract} />
          </main>
        </Container>
      ) : (
        <Cover connect={connect} />
      )}
    </>
  );
};

export default App;
