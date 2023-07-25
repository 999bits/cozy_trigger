const { expect } = require("chai");
const { ethers } = require("hardhat");
// const BigNumber = require("bignumber.js");
const { BigNumber } = ethers;
const { impersonates, depositVault, setupCoreProtocol, advanceNBlock } = require("./utils/utils.js");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const {CarouselFactoryABI, ControllerABI} = require("./abi/abiCodes.js");


async function increaseTime(n) {
    await network.provider.send("evm_increaseTime", [24 * 60 * 60 * n]); // Increase time by one day
    await network.provider.send("evm_mine"); // Mine the next block

}

describe( "Y2K Earthquake V2" , function () {

    let controller;
    let vaultCreator;
    let vaultFactoryV2;
    let timeLock;
    let CarouselFactoryAddress = "0xC3179AC01b7D68aeD4f27a19510ffe2bfb78Ab3e";
    let CarouselCreatorAddress = "0x773018D4D5eb0EaEF8aF903C30038ca15545068F";
    let ControllerAddress = "0xC0655f3dace795cc48ea1E2e7BC012c1eec912dC";

    let ownerAddress = "0x45aA9d8B9D567489be9DeFcd085C6bA72BBf344F"
    
    let oracle = "0x50834f3163758fcc1df9973b6e91f0f0f0434ad3";  // USDC/USD Price Oracle
    let l2sequence = "0xFdB631F5EE196F0ed6FAa767959853A9F217697D";  //l2sequencer feeds address in artitrum
    let premium;
    let collateral;
    let depegPremium;
    let depegCollateral;   

    let premiumContract;
    let collateralContract;
    let depegPremiumContract;
    let depegCollateralContract;

    let marketId;
    let strike;
    let epochId;
    let depegMarketId;
    let depegStrike;
    let depegEpochId;
    let premiumShareValue;
    let collateralShareValue;
    let arbForkId;

    let DEPOSIT_AMOUNT = ethers.utils.parseEther("10");
    let PREMIUM_DEPOSIT_AMOUNT = ethers.utils.parseEther("2");
    let COLLAT_DEPOSIT_AMOUNT = ethers.utils.parseEther("10");
    let AMOUNT_AFTER_FEE = ethers.utils.parseEther("19.95");

    let begin;
    let end;
    let fee;

    let ADMIN;
    let USER;
    let USER2;
    let MIM = "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A";        // USDC address in arbitrum
    let USDC = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";        // USDC address in arbitrum
    let WETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";        // WETH address in arbitrum
    let TREASURY = "0x1bf05Be2C1f069A323aF9157388822F0411583d8";    // my wallet address
    let UNDERLYING;
    let WethContract;

    let aToken;
    let bToken;


    beforeEach(async function() {
        [ADMIN, USER, USER2] = await ethers.getSigners();
        await impersonates([ownerAddress]);
        const signer = await ethers.getSigner(ownerAddress);

        WethContract = await ethers.getContractAt('WETH', WETH);
        
        const TimeLock = await ethers.getContractFactory("TimeLock");
        timeLock = await TimeLock.deploy(ADMIN.address);
        await timeLock.deployed();

        //////////////////////////////////////////////////////////  Mainnet Address   ///////////////////////////////////////////////////////////////////////////
        
        // controller = await ethers.getContractAt(ControllerABI, ControllerAddress); 
        // console.log("controller", controller.address)
        
        // vaultFactoryV2 = await ethers.getContractAt(CarouselFactoryABI, CarouselFactoryAddress);
        // console.log("vaultFactoryV2", vaultFactoryV2.address)

        // const treasury = await vaultFactoryV2.treasury();
        // console.log("treasury", treasury);
        
        /////////////////////////////////////////////////////////////   Creation Address   //////////////////////////////////////////////////////////////////////
        
        const VaultV2Creator = await ethers.getContractFactory("VaultV2Creator");
        vaultCreator = await VaultV2Creator.deploy();
        await vaultCreator.deployed();
        
        const FactoryV2 = await ethers.getContractFactory("VaultFactoryV2",{
            libraries:{
                VaultV2Creator : vaultCreator.address
            }
        });
        vaultFactoryV2 = await FactoryV2.deploy(WETH, TREASURY, timeLock.address);
        await vaultFactoryV2.deployed();
        
        const ControllerPeggedAssetV2 = await ethers.getContractFactory("ControllerPeggedAssetV2");
        controller = await ControllerPeggedAssetV2.deploy(vaultFactoryV2.address, l2sequence);
        await controller.deployed();

        await vaultFactoryV2.whitelistController(controller.address, {gasLimit : 150000});

        const AToken = await ethers.getContractFactory("AToken");
        aToken = await AToken.deploy();
        await aToken.deployed();
        
        const BToken = await ethers.getContractFactory("BToken");
        bToken = await BToken.deploy();
        await bToken.deployed();
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const marketConfigurationCalldata_nodepeg= {
            token : MIM,
            strike : "99100000" ,
            oracle : oracle,
            underlyingAsset : WETH ,
            name : "MIM Token" ,
            tokenURI : "MIM" ,
            controller : controller.address ,
        }

        const depegStrike = ethers.utils.parseEther("2");

        const marketConfigurationCalldata_depeg= {
            token : USDC,
            strike : depegStrike,
            oracle : oracle,
            underlyingAsset : WETH,
            name : "USD Coin",
            tokenURI : "USDC",
            controller : controller.address,
        }

        const tx = await vaultFactoryV2.createNewMarket(marketConfigurationCalldata_nodepeg);
        const receipt = await tx.wait();

        const event = receipt.events.find((e) => e.event === "MarketCreated");
        marketId = event.args[0];
        premium = event.args[1];
        collateral = event.args[2];

        const marketIdInfo = await vaultFactoryV2.getMarketInfo(marketId);

        const tx_depeg = await vaultFactoryV2.createNewMarket(marketConfigurationCalldata_depeg);
        const receipt_depeg = await tx_depeg.wait();

        const event_depeg = receipt_depeg.events.find((e) => e.event === "MarketCreated");
        depegMarketId = event_depeg.args[0];
        depegPremium = event_depeg.args[1];
        depegCollateral = event_depeg.args[2];

        premiumContract = await ethers.getContractAt('VaultV2', premium);
        collateralContract = await ethers.getContractAt('VaultV2', collateral);

        depegPremiumContract = await ethers.getContractAt('VaultV2', depegPremium);
        depegCollateralContract = await ethers.getContractAt('VaultV2', depegCollateral);

        begin = await time.latest() + (10 * 24 * 60 * 60);
        end = await time.latest() + (15 * 24 * 60 * 60);
        fee = 50;

        const tx_epoch = await vaultFactoryV2.createEpoch(marketId, begin, end, fee);
        const receipt_epoch = await tx_epoch.wait();

        const event_epoch = receipt_epoch.events.find((e) => e.event === "EpochCreated");
        epochId = event_epoch.args[0];

        const tx_epoch_depeg = await vaultFactoryV2.createEpoch(depegMarketId, begin, end, fee);
        const receipt_epoch_depeg = await tx_epoch_depeg.wait();
        const event_epoch_epoch = receipt_epoch_depeg.events.find((e) => e.event === "EpochCreated");
        depegEpochId = event_epoch_epoch.args[0];

        const mintWeth = ethers.utils.parseEther("100");
        await WethContract.connect(USER).deposit({value: mintWeth});
        console.log("before user balance", await WethContract.balanceOf(USER.address));

    })

    it("test end epoch with no depeg event", async function() {
        await increaseTime(9);
        await WethContract.connect(USER).approve(premium, DEPOSIT_AMOUNT);
        await WethContract.connect(USER).approve(collateral, DEPOSIT_AMOUNT);
        
        await premiumContract.connect(USER).deposit(epochId, DEPOSIT_AMOUNT, USER.address);
        await collateralContract.connect(USER).deposit(epochId, DEPOSIT_AMOUNT, USER.address);

        console.log("premium user balance", await premiumContract.balanceOf(USER.address, epochId));
        console.log("collateral user balance", await collateralContract.balanceOf(USER.address, epochId));
        expect(await premiumContract.balanceOf(USER.address, epochId)).to.be.equal(DEPOSIT_AMOUNT);
        expect(await collateralContract.balanceOf(USER.address, epochId)).to.be.equal(DEPOSIT_AMOUNT);
        
        await increaseTime(16);
        
        await controller.triggerEndEpoch(marketId, epochId);
        
        const premiumBalance = await premiumContract.connect(USER).previewWithdraw(epochId, DEPOSIT_AMOUNT);
        expect(premiumBalance).to.be.equal(0);
        console.log("premiumBalance", premiumBalance);
        
        const collateralBalance = await collateralContract.connect(USER).previewWithdraw(epochId, DEPOSIT_AMOUNT);
        expect(collateralBalance).to.be.equal(AMOUNT_AFTER_FEE);
        console.log("collateralBalance", collateralBalance);
        await premiumContract.connect(USER).withdraw(epochId, DEPOSIT_AMOUNT, USER.address, USER.address);
        await collateralContract.connect(USER).withdraw(epochId, DEPOSIT_AMOUNT, USER.address, USER.address);

        expect(await premiumContract.balanceOf(USER.address, DEPOSIT_AMOUNT)).to.be.equal(0);
        expect(await collateralContract.balanceOf(USER.address, DEPOSIT_AMOUNT)).to.be.equal(0);
        console.log("after premium balance", await premiumContract.balanceOf(USER.address, DEPOSIT_AMOUNT));
        console.log("after premium balance", await collateralContract.balanceOf(USER.address, DEPOSIT_AMOUNT));
        
    })

    it("test epoch with depeg event", async function(){
        await WethContract.connect(USER).approve(depegPremium, PREMIUM_DEPOSIT_AMOUNT);
        await WethContract.connect(USER).approve(depegCollateral, COLLAT_DEPOSIT_AMOUNT);

        await depegPremiumContract.connect(USER).deposit(depegEpochId, PREMIUM_DEPOSIT_AMOUNT, USER.address);
        await depegCollateralContract.connect(USER).deposit(depegEpochId, COLLAT_DEPOSIT_AMOUNT, USER.address);

        console.log("depeg premium balance", await depegPremiumContract.balanceOf(USER.address, depegEpochId));
        console.log("depeg collateral balance", await depegCollateralContract.balanceOf(USER.address, depegEpochId));

        const latestPrice = await controller.getLatestPrice(depegMarketId);
        console.log("latestPrice ->>>", latestPrice)

        await increaseTime(10.1);

        await controller.triggerDepeg(depegMarketId, depegEpochId, {gasLimit : 3000000});
        
        const premiumfinalTVL = await depegCollateralContract.finalTVL(depegEpochId);
        const collateralfinalTVL = await depegPremiumContract.finalTVL(depegEpochId);
        console.log("premiumfinalTVL", premiumfinalTVL);
        console.log("collateralfinalTVL", collateralfinalTVL);


        const premiumShare = await depegPremiumContract.connect(USER).previewWithdraw(depegEpochId, PREMIUM_DEPOSIT_AMOUNT);
        console.log("premiumShare", premiumShare);
        expect(premiumShare).to.be.equal(BigNumber.from("9950000000000000000"));

        
        const collateralShare = await depegCollateralContract.connect(USER).previewWithdraw(depegEpochId, COLLAT_DEPOSIT_AMOUNT);
        console.log("collateralShare", collateralShare);
        expect(collateralShare).to.be.equal(BigNumber.from("1990000000000000000"));

        await depegPremiumContract.connect(USER).withdraw(depegEpochId, PREMIUM_DEPOSIT_AMOUNT, USER.address, USER.address);
        await depegCollateralContract.connect(USER).withdraw(depegEpochId, COLLAT_DEPOSIT_AMOUNT, USER.address, USER.address)

        expect(await depegPremiumContract.balanceOf(USER.address, depegEpochId)).to.be.equal(0);
        expect(await depegCollateralContract.balanceOf(USER.address, depegEpochId)).to.be.equal(0);
        console.log(await depegPremiumContract.balanceOf(USER.address, depegEpochId));
        console.log(await depegCollateralContract.balanceOf(USER.address, depegEpochId));
        
    })

    it("test epoch with null epoch", async function() {
        await WethContract.connect(USER).approve(premium, DEPOSIT_AMOUNT);
        await WethContract.connect(USER).approve(collateral, DEPOSIT_AMOUNT);

        await collateralContract.connect(USER).deposit(epochId, COLLAT_DEPOSIT_AMOUNT, USER.address);
        console.log(await premiumContract.balanceOf(USER.address, epochId));
        console.log(await collateralContract.balanceOf(USER.address, epochId));

        await increaseTime(16);
        
        await controller.triggerNullEpoch(marketId, epochId);

        const premiumStatus = await premiumContract.connect(USER).epochResolved(epochId);
        const collateralStatus = await collateralContract.connect(USER).epochResolved(epochId);
        console.log("premiumStatus", premiumStatus)
        console.log("collateralStatus", collateralStatus)

        const premiumNullStatus = await premiumContract.connect(USER).epochNull(epochId);
        const collateralNullStatus = await collateralContract.connect(USER).epochNull(epochId);
        console.log("premiumNullStatus", premiumNullStatus)
        console.log("collateralNullStatus", collateralNullStatus)


        
    })

});