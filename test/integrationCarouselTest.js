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
    let carouselCreator;
    let carouselFactory;
    let timeLock;
    let CarouselFactoryAddress = "0xC3179AC01b7D68aeD4f27a19510ffe2bfb78Ab3e";
    let CarouselCreatorAddress = "0x773018D4D5eb0EaEF8aF903C30038ca15545068F";
    let ControllerAddress = "0xC0655f3dace795cc48ea1E2e7BC012c1eec912dC";
    let emissionTokenAddress = "0x65c936f008BC34fE819bce9Fa5afD9dc2d49977f";

    let ownerAddress = "0x45aA9d8B9D567489be9DeFcd085C6bA72BBf344F"
    let owner;
    
    let oracle = "0x50834f3163758fcc1df9973b6e91f0f0f0434ad3";  // USDC/USD Price Oracle
    let l2sequence = "0xFdB631F5EE196F0ed6FAa767959853A9F217697D";  //l2sequencer feeds address in artitrum
    let premium;
    let collateral;

    let premiumContract;
    let collateralContract;

    let marketId;
    let strike;
    let depositFee;
    let relayerFee;
    let premiumEmissions;
    let collatEmissions;
    let epochId;
    let nextEpochId;
    let collateralQueueLength;
    let premiumQueueLength;

    let DEPOSIT_AMOUNT = ethers.utils.parseEther("10");
    let PREMIUM_DEPOSIT_AMOUNT = ethers.utils.parseEther("2");
    let COLLAT_DEPOSIT_AMOUNT = ethers.utils.parseEther("10");
    let AFTER_PREMIUM_DEPOSIT_AMOUNT = ethers.utils.parseEther("6");

    let begin;
    let end;
    let nextEpochBegin;
    let nextEpochEnd;
    let fee;

    let ADMIN;
    let USER;
    let USER2;
    let MIM = "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A";        // USDC address in arbitrum
    let USDC = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";        // USDC address in arbitrum
    let WETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";        // WETH address in arbitrum
    let TREASURY = "0x5c84CF4d91Dc0acDe638363ec804792bB2108258";    // Real Tresury address in CarouselFactory
    // let TREASURY = "0x1bf05Be2C1f069A323aF9157388822F0411583d8";    // my wallet address
    let UNDERLYING;
    let WethContract;

    let aToken;
    let bToken;


    beforeEach(async function() {
        [ADMIN, USER, USER2] = await ethers.getSigners();
        await impersonates([ownerAddress]);
        owner = await ethers.getSigner(ownerAddress);

        WethContract = await ethers.getContractAt('WETH', WETH);

        const TimeLock = await ethers.getContractFactory("TimeLock");
        timeLock = await TimeLock.deploy(ADMIN.address);
        await timeLock.deployed();

        //////////////////////////////////////////////////////////  Mainnet Address   ///////////////////////////////////////////////////////////////////////////
        
        // controller = await ethers.getContractAt(ControllerABI, ControllerAddress); 
        // console.log("controller", controller.address)
        
        // carouselFactory = await ethers.getContractAt(CarouselFactoryABI, CarouselFactoryAddress);
        // console.log("carouselFactory", carouselFactory.address)

        // const treasury = await carouselFactory.treasury();
        // console.log("treasury", treasury);
        
        /////////////////////////////////////////////////////////////   Creation Address   //////////////////////////////////////////////////////////////////////
        const AToken = await ethers.getContractFactory("AToken");
        aToken = await AToken.deploy();
        await aToken.deployed();

        const CarouselCreator = await ethers.getContractFactory("CarouselCreator", {gasLimit : 1500000});
        carouselCreator = await CarouselCreator.deploy();
        await carouselCreator.deployed();
        console.log("carouselCreator", carouselCreator);
        
        const CarouselFactory = await ethers.getContractFactory("CarouselFactory",{
            libraries:{
                CarouselCreator : carouselCreator.address
            }
        });
        carouselFactory = await CarouselFactory.deploy(WETH, TREASURY, timeLock.address, aToken.address);
        await carouselFactory.deployed();
        console.log("carouselFactory", carouselFactory);
        
        const ControllerPeggedAssetV2 = await ethers.getContractFactory("ControllerPeggedAssetV2");
        controller = await ControllerPeggedAssetV2.deploy(carouselFactory.address, l2sequence);
        await controller.deployed();

        await carouselFactory.whitelistController(controller.address, {gasLimit : 150000});

        
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        depositFee = 50;
        relayerFee = ethers.utils.parseUnits("2", 'gwei');

        const carouselMarketConfigurationCalldata= {
            token : USDC,
            strike : ethers.utils.parseEther("1"),
            oracle : oracle,
            underlyingAsset : WETH,
            name : "USD Coin",
            tokenURI : "USDC",
            controller : controller.address,
            relayerFee : relayerFee,
            depositFee : depositFee,
            minQueueDeposit : ethers.utils.parseEther("1")
        }

        console.log("carouselMarketConfigurationCalldata", carouselMarketConfigurationCalldata);

        console.log("controller", await carouselFactory.controllers(controller.address));

        const marketId = await carouselFactory.getMarketId(
            carouselMarketConfigurationCalldata.token,
            carouselMarketConfigurationCalldata.strike,
            carouselMarketConfigurationCalldata.underlyingAsset
        );
        console.log("marketId", marketId);
        
        const marketIdVaults = await carouselFactory.marketIdToVaults(marketId, 0);
        console.log("marketIdVaults", marketIdVaults);

        const tx = await carouselFactory.connect(owner).createNewCarouselMarket(carouselMarketConfigurationCalldata, {gasLimit : 150000});
        const receipt = await tx.wait();
        
        const event = receipt.events.find((e) => e.event === "MarketCreated");
        marketId = event.args[0];
        premium = event.args[1];
        collateral = event.args[2];
        console.log("marketId", marketId)
        console.log("premium", premium)
        console.log("collateral", collateral)

        const marketIdInfo = await carouselFactory.getMarketInfo(marketId);

        premiumContract = await ethers.getContractAt('Carousel', premium);
        collateralContract = await ethers.getContractAt('Carousel', collateral);

        begin = await time.latest() + (5 * 24 * 60 * 60);
        end = await time.latest() + (8 * 24 * 60 * 60);
        fee = 50;
        premiumEmissions = ethers.utils.parseEther("1000");
        collatEmissions = ethers.utils.parseEther("100");

        await aToken.mint(TREASURY, 5000);
        await aToken.approve(carouselFactory.address, ethers.utils.parseEther("5000"));

        const tx_epoch = await carouselFactory.createEpochWithEmissions(marketId, begin, end, fee, premiumEmissions, collatEmissions);
        const receipt_epoch = await tx_epoch.wait();
        const event_epoch = receipt_epoch.events.find((e) => e.event === "EpochCreatedWithEmissions");
        epochId = event_epoch.args[0];

        nextEpochBegin = await time.latest() + (10 * 24 * 60 * 60);
        nextEpochEnd = await time.latest() + (11 * 24 * 60 * 60);

        const tx_epoch_next = await carouselFactory.createEpochWithEmissions(marketId, begin, end, fee, premiumEmissions, collatEmissions);
        const receipt_epoch_next = await tx_epoch_next.wait();
        const event_epoch_next = receipt_epoch_next.events.find((e) => e.event === "EpochCreatedWithEmissions");
        nextEpochId = event_epoch_next.args[0];


        const mintWeth = ethers.utils.parseEther("100");
        await WethContract.connect(USER).deposit({value: mintWeth});
        await WethContract.connect(USER2).deposit({value: mintWeth});
        console.log("before user balance", await WethContract.balanceOf(USER.address));
        console.log("before user balance2", await WethContract.balanceOf(USER2.address));

    })

    it("test epoch with carousel", async function() {
        await increaseTime(4);
        await WethContract.connect(USER).approve(premium, PREMIUM_DEPOSIT_AMOUNT);
        await WethContract.connect(USER).approve(collateral, COLLAT_DEPOSIT_AMOUNT);
        
        await premiumContract.connect(USER).deposit(epochId, PREMIUM_DEPOSIT_AMOUNT, USER.address);
        await collateralContract.connect(USER).deposit(epochId, COLLAT_DEPOSIT_AMOUNT, USER.address);

        console.log("premium user balance", await premiumContract.balanceOf(USER.address, epochId));
        console.log("collateral user balance", await collateralContract.balanceOf(USER.address, epochId));
        expect(await premiumContract.balanceOf(USER.address, epochId)).to.be.equal(PREMIUM_DEPOSIT_AMOUNT);
        expect(await collateralContract.balanceOf(USER.address, epochId)).to.be.equal(COLLAT_DEPOSIT_AMOUNT);
        
        await WethContract.connect(USER2).approve(collateral, COLLAT_DEPOSIT_AMOUNT);
        await collateralContract.connect(USER2).deposit(epochId, COLLAT_DEPOSIT_AMOUNT, USER2.address);
        console.log("collateral user balance", await collateralContract.balanceOf(USER2.address, epochId));

        collateralQueueLength = 2;
        premiumQueueLength = 1;

        expect(await collateralContract.getDepositQueueLength()).to.be.equal(collateralQueueLength);
        expect(await premiumContract.getDepositQueueLength()).to.be.equal(premiumQueueLength);

        await collateralContract.mintDepositInQueue(epochId, collateralQueueLength);
        await premiumContract.mintDepositInQueue(epochId, premiumQueueLength);

        const collateralBalanceAfterFee = await collateralContract.getEpochDepositFee(epochId, COLLAT_DEPOSIT_AMOUNT);
        console.log(collateralBalanceAfterFee.assetsAfterFee)
        const premiumBalanceAfterFee = await premiumContract.getEpochDepositFee(epochId, PREMIUM_DEPOSIT_AMOUNT);
        console.log(premiumBalanceAfterFee.assetsAfterFee)

        console.log(await collateralContract.balanceOf(USER.address, epochId));
        console.log(await collateralContract.balanceOf(USER2.address, epochId));
        console.log(await premiumContract.balanceOf(USER.address, epochId));
        console.log(await premiumContract.balanceOf(USER2.address, epochId));
        // expect(await collateralContract.balanceOf(USER.address, epochId)).to.be.equal(collateralBalanceAfterFee.assetsAfterFee - relayerFee)

        collateralContract.connect(USER).enlistInRollover(epochId, ethers.utils.parseEther("8"), USER.address);
        const isEnlisted = collateralContract.isEnlistedInRolloverQueue(USER.address);
        expect(isEnlisted).to.be.equal(true);

        collateralContract.connect(USER2).enlistInRollover(epochId, ethers.utils.parseEther("8"), USER2.address);
        const isEnlisted2 = collateralContract.isEnlistedInRolloverQueue(USER2.address);
        expect(isEnlisted2).to.be.equal(true);
        
        await increaseTime(9);

        await controller.triggerEndEpoch(marketId, epochId);
        
        const premiumTotalBalance = await premiumContract.previewWithdraw(epochId, PREMIUM_DEPOSIT_AMOUNT);
        console.log("premiumTotalBalance", premiumTotalBalance);
        
        const collateralTotalBalance = await collateralContract.previewWithdraw(epochId, COLLAT_DEPOSIT_AMOUNT);
        console.log("collateralTotalBalance", collateralTotalBalance);

        await collateralContract.mintRollovers(nextEpochId, 2);
        expect(await collateralContract.rolloverAccounting(nextEpochId)).to.be.equal(2);

        const collateralMinusFee = await collateralContract.connect(USER).previewWithdraw(epochId, ethers.utils.parseEther("2"));
        console.log("collateralMinusFee", collateralMinusFee);

        await collateralContract.connect(USER).withdraw(epochId, ethers.utils.parseEther("2") - depositFee - relayerFee, USER.address, USER.address);
        await collateralContract.connect(USER2).withdraw(epochId, ethers.utils.parseEther("2") - depositFee - relayerFee, USER2.address, USER2.address);

        await WethContract.connect(USER).approve(premium, AFTER_PREMIUM_DEPOSIT_AMOUNT);
        await premiumContract.connect(USER).deposit(nextEpochId, AFTER_PREMIUM_DEPOSIT_AMOUNT, USER.address);

        await increaseTime(12);
        await controller.triggerEndEpoch(marketId, nextEpochId);

        const premiumNextTotalBalance = await premiumContract.previewWithdraw(epochId, AFTER_PREMIUM_DEPOSIT_AMOUNT);
        console.log("premiumNextTotalBalance", premiumNextTotalBalance);
        
        const collateralNextTotalBalance = await collateralContract.previewWithdraw(epochId, ethers.utils.parseEther("16"));
        console.log("collateralNextTotalBalance", collateralNextTotalBalance);

        const beforeQueueLength = await collateralContract.connect(USER).getRolloverQueueLength();
        await collateralContract.connect(USER).delistInRollover(USER.address);

        const isEnlistedAfter = collateralContract.isEnlistedInRolloverQueue(USER.address);
        expect(isEnlistedAfter).to.be.equal(false);

        const collateralBalanceInNextEpoch = await collateralContract.balanceOf(USER.address, nextEpochId);
        const expectValue = ethers.utils.parseEther("8") - relayerFee;
        expect(collateralBalanceInNextEpoch).to.be.equal(expectValue);
        const premiumBalanceInNextEpoch = await collateralContract.balanceOf(USER.address, nextEpochId);

        await collateralContract.connect(USER).withdraw(nextEpochId, collateralBalanceInNextEpoch, USER.address, USER.address);
        await premiumContract.connect(USER).withdraw(nextEpochId, premiumBalanceInNextEpoch, USER.address, USER.address);

        expect(await collateralContract.connect(ADMIN).getRolloverQueueLength()).to.be.equal(2);

        const beforeQueueLength2 = await collateralContract.connect(USER2).getRolloverQueueLength();
        await collateralContract.connect(USER2).delistInRollover(USER2.address);

        const collateralBalanceInNextEpoch2 = await collateralContract.balanceOf(USER2.address, nextEpochId);
        expect(collateralBalanceInNextEpoch2).to.be.equal(expectValue);

        await collateralContract.connect(USER2).withdraw(nextEpochId, collateralBalanceInNextEpoch2, USER2.address, USER2.address);

        expect(await premiumContract.balanceOf(USER.address, nextEpochId)).to.be.equal(0);
        expect(await premiumContract.balanceOf(USER2.address, nextEpochId)).to.be.equal(0);
        expect(await collateralContract.balanceOf(USER.address, nextEpochId)).to.be.equal(0);
        expect(await collateralContract.balanceOf(USER2.address, nextEpochId)).to.be.equal(0);

        console.log("collateralNextTotalBalance", collateralNextTotalBalance);
        
    })

});