import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";

const getAccessToken = () => {
  const token = process.env.REACT_APP_API_TOKEN;
  return token;
};
const makeStorageClient = () => {
  return new Web3Storage({ token: getAccessToken() });
};
const formattedName = (name) => {
  let file_name;
  const trim_name = name.trim();
  if (trim_name.includes(" ")) {
    file_name = trim_name.replaceAll(" ", "%20");
    return file_name;
  } else return trim_name;
};
const makeFileObjects = (file) => {
  const blob = new Blob([JSON.stringify(file)], { type: "application/json" });
  const files = [new File([blob], `${file.name}.json`)];
  return files;
};
const client = makeStorageClient();
const storeFiles = async (files) => {
  const cid = await client.put(files);
  return cid;
};

// function to upload an image to Web3.storage
export const uploadToIpfs = async (file) => {
  if (!file) return;
  try {
    const file_name = file[0].name;
    const image_name = formattedName(file_name);
    const image_cid = await storeFiles(file);
    const image_url = `https://${image_cid}.ipfs.w3s.link/${image_name}`;
    return image_url;
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
};

// mint an NFT
export const mintNft = async (
  nftContract,
  performActions,
  { name, description, ipfsImage }
) => {
  await performActions(async (kit) => {
    if (!name || !description || !ipfsImage) return;
    const { defaultAccount } = kit;

    // trim any extra whitespaces from the name and
    // replace the whitespace between the name with %20
    const file_name = formattedName(name);

    // convert NFT metadata to JSON format
    const data = {
      name,
      image: ipfsImage,
      description,
      owner: defaultAccount,
    };

    try {
      // save NFT metadata to IPFS
      const files = makeFileObjects(data);
      const file_cid = await storeFiles(files);
      const URI = `https://${file_cid}.ipfs.w3s.link/${file_name}.json`;
      console.log("URI: " + URI);

      // upload the NFT, mint the NFT and save the IPFS url to the blockchain
      let transaction = await nftContract.methods
        .mint(URI)
        .send({ from: defaultAccount });
      return transaction;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  });
};

// fetch all NFTs
export const fetchCerts = async (nftContract) => {
  try {
    const d = await nftContract.methods.getCerts().call();
    const certs = await Promise.all(
      d.map(async (_cert) => {
        const tokenURI = await nftContract.methods
          .tokenURI(_cert.certId)
          .call();
        const tokenData = await fetchNftMeta(tokenURI);
        return {
          validators: _cert.validators,
          index: _cert.certId,
          owner: _cert.owner,
          name: tokenData.name,
          image: tokenData.image,
          description: tokenData.description,
        };
      })
    );
    return certs;
  } catch (e) {
    console.log({ e });
  }
};

// Fetch all board members
export const fetchBoardMembers = async (contract) => {
  try {
    const members = contract.methods.getBoardMembers().call();
    return members;
  } catch (e) {
    console.log(e);
  }
};

// Add board members
export const addBoardMember = async (
  contract,
  performActions,
  memberAddress
) => {
  await performActions(async (kit) => {
    const { defaultAccount } = kit;
    try {
      contract.methods
        .addBoardMember(memberAddress)
        .send({ from: defaultAccount });
    } catch (error) {
      console.log("Error adding board member: ", error);
    }
  });
};

// Verify certificate
export const verifyCert = async (contract, performActions, certId) => {
  await performActions(async (kit) => {
    const { defaultAccount } = kit;
    try {
      contract.methods.verifyCertificate(certId).send({ from: defaultAccount });
    } catch (error) {
      console.log("Error verifying certificate: ", error);
    }
  });
};

// Get NFT metadata from IPFS
export const fetchNftMeta = async (ipfsUrl) => {
  try {
    if (!ipfsUrl) return null;
    const fetch_meta = await fetch(ipfsUrl);
    const meta = await fetch_meta.json();

    return meta;
  } catch (e) {
    console.log({ e });
  }
};

// get the owner address of an NFT
export const fetchNftOwner = async (minterContract, index) => {
  try {
    return await minterContract.methods.ownerOf(index).call();
  } catch (e) {
    console.log({ e });
  }
};
