import React from "react";
import PropTypes from "prop-types";
import { Col } from "react-bootstrap";
import goldImg from "../../../assets/gold_star.png";
import silverImg from "../../../assets/silver_star.png";
import bronzeImg from "../../../assets/bronze_star.png";
import { toast } from "react-toastify";
import { NotificationSuccess } from "../../ui/Notifications";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const Expand = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <img src={props.image} />
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

// NFT Cards Functionality
const Nft = ({ nft, isBoardMember, verify }) => {
  const [modalShow, setModalShow] = React.useState(false);

  const { image, description, name, index, validators, owner } = nft;

  return (
    <>
      <Col key={index} className="mb-5">
        <div className="cert_container d-flex flex-wrap">
          <img
            className="cert_reps_img"
            src={
              validators?.length >= 2
                ? goldImg
                : validators?.length == 1
                ? silverImg
                : validators?.length == 0
                ? bronzeImg
                : ""
            }
          />
          <img className="cert_image" src={image} alt={name} />
          <div className="cert_details">
            <h2 className="cert_name d-flex justify-content-around">{name}</h2>
            <p className="cert_desc">{description}</p>
            <div className="cert_reps">
              {validators?.length >= 2
                ? "Gold"
                : validators?.length == 1
                ? "Silver"
                : validators?.length == 0
                ? "Bronze"
                : ""}
            </div>
            <Expand
              show={modalShow}
              onHide={() => setModalShow(false)}
              image={image}
            />
            <div className="cert_act">
              <button className="" onClick={() => setModalShow(true)}>
                Expand
              </button>
              {isBoardMember ? (
                <button onClick={() => verify(index)}>Verify</button>
              ) : (
                <button
                  className=""
                  onClick={() => {
                    navigator.clipboard.writeText(image);
                    toast(
                      <NotificationSuccess text="Successfully copied link to clipboard" />
                    );
                  }}
                >
                  Copy Link
                </button>
              )}
            </div>
          </div>
        </div>
      </Col>
    </>
  );
};

Nft.propTypes = {
  // props passed into this component
  image: PropTypes.instanceOf(Object).isRequired,
};

export default Nft;
