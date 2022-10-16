import { useContractKit } from "@celo-tools/use-contractkit";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import AddNfts from "./Add";
import Nft from "./Card";
import Loader from "../../ui/Loader";
import { Modal, Form } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "../../ui/Notifications";
import {
  fetchCerts,
  mintNft,
  fetchBoardMembers,
  addBoardMember,
  verifyCert,
} from "../../../utils/minter";

const NftList = ({ vContract }) => {
  const { performActions, address, kit } = useContractKit();
  const { defaultAccount } = kit;
  const [nfts, setNfts] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [boardMember, setBoardMember] = useState();
  const [show, setShow] = useState(false);

  // close the popup modal
  const handleClose = () => {
    setShow(false);
  };

  // display the popup modal
  const handleShow = () => setShow(true);

  const fetchNFTs = useCallback(async () => {
    try {
      setLoading(true);
      // fetch all nfts from the smart contract
      const allNfts = await fetchCerts(vContract);
      if (!allNfts) return;
      setNfts(allNfts);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [vContract]);

  const getBoardMembers = useCallback(async () => {
    try {
      setLoading(true);
      // fetch all nfts from the smart contract
      const members = await fetchBoardMembers(vContract);
      if (!members) return;
      setBoardMembers(members);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [vContract]);

  // Add new NFT
  const addNft = async (data) => {
    try {
      setLoading(true);

      // create an nft functionality
      await mintNft(vContract, performActions, data);
      toast(<NotificationSuccess text="Updating NFT list...." />);
      fetchNFTs();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create an NFT." />);
    } finally {
      setLoading(false);
    }
  };

  const addNew = async (member) => {
    try {
      setLoading(true);
      await addBoardMember(vContract, performActions, member);
      toast(<NotificationSuccess text="Adding new board members ...." />);
      fetchNFTs();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to add new board member" />);
    } finally {
      setLoading(false);
    }
  };

  const verify = async (certId) => {
    try {
      setLoading(true);
      await verifyCert(vContract, performActions, certId);
      toast(<NotificationSuccess text="Verifying certificate ...." />);
      fetchNFTs();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to verify certificate" />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      if (address && vContract) {
        fetchNFTs();
        getBoardMembers();
      }
    } catch (error) {
      console.log({ error });
    }
  }, [vContract, address, fetchNFTs]);

  if (address) {
    return (
      <>
        {!loading ? (
          <>
            <div className="marketplace">
              <h1
                className="fs-10 fw-bold text-center mb-5"
                style={{ color: "#531c1c" }}
              >
                My Certificates
              </h1>
              {boardMembers.includes(defaultAccount) ? (
                <>
                  <button
                    type="button"
                    onClick={handleShow}
                    className="add-btn mb-4"
                  >
                    Add board member <i class="bi bi-plus"></i>
                  </button>
                  <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header>
                      <Modal.Title
                        style={{
                          color: "#531c1c",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        Add new board member
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form>
                        <Form.Control
                          type="text"
                          placeholder="New member wallet address"
                          className={"mb-3"}
                          style={{ height: "45px", fontSize: "0.9rem" }}
                          onChange={(e) => {
                            setBoardMember(e.target.value);
                          }}
                        />
                      </Form>
                    </Modal.Body>

                    <Modal.Footer className="modal_footer">
                      <button className="close_btn" onClick={handleClose}>
                        Close
                      </button>
                      <button
                        className="create_btn"
                        onClick={() => {
                          addNew(boardMember);
                          handleClose();
                        }}
                      >
                        Add
                      </button>
                    </Modal.Footer>
                  </Modal>
                </>
              ) : (
                <AddNfts save={addNft} address={address} />
              )}
            </div>
            <div className="all_nft">
              {/* display all NFTs */}
              {boardMembers.includes(defaultAccount) ? (
                <>
                  {nfts.map((_nft) => (
                    <Nft
                      key={_nft.index}
                      nft={{
                        ..._nft,
                      }}
                      isBoardMember={true}
                      verify={verify}
                    />
                  ))}
                </>
              ) : (
                <>
                  {nfts
                    .filter((nft) => nft.owner == defaultAccount)
                    .map((_nft) => (
                      <Nft
                        key={_nft.index}
                        nft={{
                          ..._nft,
                        }}
                        isBoardMember={false}
                      />
                    ))}
                </>
              )}
            </div>
          </>
        ) : (
          <Loader />
        )}
      </>
    );
  }
  return null;
};

NftList.propTypes = {
  // props passed into this component
  vContract: PropTypes.instanceOf(Object),
  updateBalance: PropTypes.func.isRequired,
};

NftList.defaultProps = {
  vContract: null,
};

export default NftList;
