import { expect } from "chai";
import { ethers } from "hardhat";

describe("FractionalEstate", function () {
  let investorRegistry: any, fractionalEstate: any, propertyGovernance: any;
  let owner: any, investor1: any, investor2: any, treasury: any;
  const METADATA_URI = "ipfs://QmTest123/metadata.json";
  const TOTAL_SHARES = 1000n;
  const PRICE_PER_SHARE = ethers.parseEther("0.1");

  beforeEach(async function () {
    [owner, investor1, investor2, treasury] = await ethers.getSigners();
    const InvestorRegistry = await ethers.getContractFactory("InvestorRegistry");
    investorRegistry = await InvestorRegistry.deploy();
    const FractionalEstate = await ethers.getContractFactory("FractionalEstate");
    fractionalEstate = await FractionalEstate.deploy(treasury.address, await investorRegistry.getAddress());
    const PropertyGovernance = await ethers.getContractFactory("PropertyGovernance");
    propertyGovernance = await PropertyGovernance.deploy(await fractionalEstate.getAddress());
    await investorRegistry.verifyInvestor(investor1.address, false, "US");
  });

  describe("Property Listing", function () {
    it("Should list a new property", async function () {
      const tx = await fractionalEstate.listProperty(METADATA_URI, TOTAL_SHARES, PRICE_PER_SHARE);
      await expect(tx).to.emit(fractionalEstate, "PropertyListed");
      const property = await fractionalEstate.getProperty(1);
      expect(property.metadataURI).to.equal(METADATA_URI);
      expect(property.totalShares).to.equal(TOTAL_SHARES);
    });

    it("Should reject listing from non-manager", async function () {
      await expect(fractionalEstate.connect(investor1).listProperty(METADATA_URI, TOTAL_SHARES, PRICE_PER_SHARE)).to.be.reverted;
    });
  });

  describe("Share Purchase", function () {
    beforeEach(async function () { await fractionalEstate.listProperty(METADATA_URI, TOTAL_SHARES, PRICE_PER_SHARE); });

    it("Should allow verified investor to purchase shares", async function () {
      const sharesToBuy = 10n;
      await expect(fractionalEstate.connect(investor1).purchaseShares(1, sharesToBuy, { value: sharesToBuy * PRICE_PER_SHARE })).to.emit(fractionalEstate, "SharesPurchased");
      expect(await fractionalEstate.balanceOf(investor1.address, 1)).to.equal(sharesToBuy);
    });

    it("Should reject unverified investor", async function () {
      await expect(fractionalEstate.connect(investor2).purchaseShares(1, 10, { value: ethers.parseEther("1") })).to.be.revertedWith("Not verified");
    });
  });

  describe("Dividends", function () {
    beforeEach(async function () {
      await fractionalEstate.listProperty(METADATA_URI, TOTAL_SHARES, PRICE_PER_SHARE);
      await fractionalEstate.connect(investor1).purchaseShares(1, 100, { value: ethers.parseEther("10") });
    });

    it("Should declare and claim dividend", async function () {
      await expect(fractionalEstate.declareDividend(1, { value: ethers.parseEther("1") })).to.emit(fractionalEstate, "DividendDeclared");
      const claimable = await fractionalEstate.getClaimableDividends(1, investor1.address);
      expect(claimable).to.be.gt(0);
      await expect(fractionalEstate.connect(investor1).claimDividends(1)).to.emit(fractionalEstate, "DividendsClaimed");
    });
  });

  describe("Governance", function () {
    beforeEach(async function () {
      await fractionalEstate.listProperty(METADATA_URI, TOTAL_SHARES, PRICE_PER_SHARE);
      await fractionalEstate.connect(investor1).purchaseShares(1, 100, { value: ethers.parseEther("10") });
    });

    it("Should create proposal and vote", async function () {
      await expect(propertyGovernance.connect(investor1).createProposal(1, "Test proposal", 0)).to.emit(propertyGovernance, "ProposalCreated");
      await expect(propertyGovernance.connect(investor1).castVote(1, true)).to.emit(propertyGovernance, "VoteCast");
    });
  });
});
