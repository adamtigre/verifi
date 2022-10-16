const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Verifi", function () {
  this.timeout(50000);

  let myNFT;
  let owner;
  let acc1;
  let acc2;

  this.beforeEach(async function () {
    // This is executed before each test
    // Deploying the smart contract
    const Verifi = await ethers.getContractFactory("Verifi");
    [owner, acc1, acc2] = await ethers.getSigners();
    // console.log(owner)

    myNFT = await Verifi.deploy();
  });

  it("Should set the right owner", async function () {
    expect(await myNFT.owner()).to.equal(owner.address);
  });

  it("Should mint one NFT", async function () {
    expect(await myNFT.balanceOf(acc1.address)).to.equal(0);

    const tokenURI = "https://example.com/1";
    const tokenId = 0
    const tx = await myNFT.connect(owner).mint(tokenURI);
    await tx.wait();

    expect(await myNFT.balanceOf(acc1.address)).to.equal(0);
  });

  it("Should set the correct tokenURI", async function () {
    const tokenURI_1 = "https://example.com/1";
    const tokenURI_2 = "https://example.com/2";

    const tx1 = await myNFT.connect(owner).mint(tokenURI_1);
    await tx1.wait();
    const tx2 = await myNFT.connect(owner).mint(tokenURI_2);
    await tx2.wait();

    expect(await myNFT.tokenURI(0)).to.equal(tokenURI_1);
    expect(await myNFT.tokenURI(1)).to.equal(tokenURI_2);
  });
});