import React from "react";
import "./Cover.css";
import logo from "../../assets/logo.png";

const Cover = ({ connect }) => {
  return (
    <div className="cover_page d-flex align-items-center">
      <img className="cover_image_lg" src={logo} />
      <div className="cover_header d-flex align-items-center">
        <div className="cover_text">
          <h1> <div>Verifi</div> <br/> Mint and Verify your certificates on the blockcahin</h1>
          <p>
            Verifi is a blockchain platform you can mint your certificates as
            NFTs, get it verified by one, two, or three trusted parties and
            share it with prospective employers
          </p>
          <button onClick={() => connect().catch((e) => console.log(e))}>
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cover;
