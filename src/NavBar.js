import React from "react";
import Wallet from "./components/wallet";
import logo from "./assets/logo.png";
import { Nav } from "react-bootstrap";
import "./NavBar.css";

const NavBar = ({ address, balance, destroy, connect }) => {
  return (
    <Nav className="nav justify-content-between px-5 py-3">
      <Nav.Item>
        <img className="logo_img" src={logo} alt="Logo" />
        <span className="logo_name">Verifi</span>
      </Nav.Item>
      {address ? (
        <Nav.Item>
          {/*display user wallet*/}
          <Wallet
            address={address}
            amount={balance.CELO}
            symbol="CELO"
            destroy={destroy}
          />
        </Nav.Item>
      ) : (
        <Nav.Item>
          <button onClick={() => connect().catch((e) => console.log(e))}>
            Connect
          </button>
        </Nav.Item>
      )}
    </Nav>
  );
};

export default NavBar;
