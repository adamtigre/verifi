const hre = require("hardhat");

async function main() {
  const Verifi = await hre.ethers.getContractFactory("Verifi");
  const verifiContract = await Verifi.deploy();
  await verifiContract.deployed();
  console.log("Verifi Contract deployed to:", verifiContract.address);
  storeContractData(verifiContract);
}

function storeContractData(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/Verifi-address.json",
    JSON.stringify({ Verifi: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync("Verifi");

  fs.writeFileSync(
    contractsDir + "/Verifi-data.json",
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });