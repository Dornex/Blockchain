const { expect } = require("chai");
const { ethers } = require("hardhat");

const twoYears = 60 * 60 * 24 * 365 * 2;

describe("DiamondHands", function () {
  let DiamondHands, diamondHands, provider;

  beforeEach(async () => {
    DiamondHands = await ethers.getContractFactory("DiamondHands");
    diamondHands = await DiamondHands.deploy();
    provider = ethers.getDefaultProvider();
    await diamondHands.deployed();
  });

  it("should deposit ", async function () {
    [owner] = await ethers.getSigners();

    await owner.sendTransaction({
      to: diamondHands.address,
      value: ethers.utils.parseEther("1.0"),
    });
  });

  it("should withdraw 0 ether", async function () {
    [owner] = await ethers.getSigners();
    const ownerBalance = (await provider.getBalance(owner.address)).toString();
    await diamondHands.connect(owner).withdraw();
    expect(ownerBalance).to.equal(
      (await provider.getBalance(owner.address)).toString()
    );
  });

  it("should deposit 1 ether, skip 2 years, and withdraw 1 ether", async function () {
    [owner] = await ethers.getSigners();

    await owner.sendTransaction({
      to: diamondHands.address,
      value: ethers.utils.parseEther("1.0"),
    });

    await owner.sendTransaction({
      to: diamondHands.address,
      value: ethers.utils.parseEther("1.0"),
    });

    await ethers.provider.send("evm_increaseTime", [twoYears]);
    await ethers.provider.send("evm_mine");

    await owner.sendTransaction({
      to: diamondHands.address,
      value: ethers.utils.parseEther("1.0"),
    });

    await diamondHands.connect(owner).withdraw();
    await diamondHands.connect(owner).withdraw();
  });
});
