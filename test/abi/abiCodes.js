const CarouselFactoryABI = [{"inputs":[{"internalType":"address","name":"_weth","type":"address"},{"internalType":"address","name":"_treasury","type":"address"},{"internalType":"address","name":"_timelock","type":"address"},{"internalType":"address","name":"_emissoinsToken","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AddressZero","type":"error"},{"inputs":[],"name":"ControllerNotSet","type":"error"},{"inputs":[],"name":"FeeCannotBe0","type":"error"},{"inputs":[],"name":"InvalidDepositFee","type":"error"},{"inputs":[],"name":"InvalidRelayerFee","type":"error"},{"inputs":[],"name":"InvalidVaultIndex","type":"error"},{"inputs":[],"name":"MarketAlreadyExists","type":"error"},{"inputs":[{"internalType":"uint256","name":"marketId","type":"uint256"}],"name":"MarketDoesNotExist","type":"error"},{"inputs":[],"name":"NotAuthorized","type":"error"},{"inputs":[],"name":"NotTimeLocker","type":"error"},{"inputs":[],"name":"QueueNotEmpty","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_wAddress","type":"address"},{"indexed":true,"internalType":"uint256","name":"_marketId","type":"uint256"}],"name":"AddressWhitelisted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"depositFee","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"marketIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"vaultIndex","type":"uint256"},{"indexed":false,"internalType":"address","name":"vault","type":"address"}],"name":"ChangedDepositFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"relayerFee","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"marketIndex","type":"uint256"}],"name":"ChangedRelayerFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"marketId","type":"uint256"},{"indexed":true,"internalType":"address","name":"controller","type":"address"},{"indexed":false,"internalType":"address","name":"premium","type":"address"},{"indexed":false,"internalType":"address","name":"collateral","type":"address"}],"name":"ControllerChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_controller","type":"address"}],"name":"ControllerWhitelisted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"epochId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"marketId","type":"uint256"},{"indexed":false,"internalType":"uint40","name":"startEpoch","type":"uint40"},{"indexed":false,"internalType":"uint40","name":"endEpoch","type":"uint40"},{"indexed":false,"internalType":"address","name":"premium","type":"address"},{"indexed":false,"internalType":"address","name":"collateral","type":"address"},{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"strike","type":"uint256"},{"indexed":false,"internalType":"uint16","name":"withdrawalFee","type":"uint16"}],"name":"EpochCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"epochId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"marketId","type":"uint256"},{"indexed":false,"internalType":"uint40","name":"epochBegin","type":"uint40"},{"indexed":false,"internalType":"uint40","name":"epochEnd","type":"uint40"},{"indexed":false,"internalType":"uint16","name":"withdrawalFee","type":"uint16"},{"indexed":false,"internalType":"uint256","name":"premiumEmissions","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"collateralEmissions","type":"uint256"}],"name":"EpochCreatedWithEmissions","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"marketId","type":"uint256"},{"indexed":false,"internalType":"address","name":"premium","type":"address"},{"indexed":false,"internalType":"address","name":"collateral","type":"address"},{"indexed":false,"internalType":"address","name":"underlyingAsset","type":"address"},{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"strike","type":"uint256"},{"indexed":false,"internalType":"address","name":"controller","type":"address"}],"name":"MarketCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"_marketId","type":"uint256"},{"indexed":false,"internalType":"address","name":"_oracle","type":"address"}],"name":"OracleChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_treasury","type":"address"}],"name":"TreasurySet","type":"event"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_marketId","type":"uint256"},{"internalType":"address","name":"_controller","type":"address"}],"name":"changeController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_depositFee","type":"uint256"},{"internalType":"uint256","name":"_marketIndex","type":"uint256"},{"internalType":"uint256","name":"vaultIndex","type":"uint256"}],"name":"changeDepositFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_marketId","type":"uint256"},{"internalType":"address","name":"_oracle","type":"address"}],"name":"changeOracle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_relayerFee","type":"uint256"},{"internalType":"uint256","name":"_marketIndex","type":"uint256"}],"name":"changeRelayerFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newTimelocker","type":"address"}],"name":"changeTimelocker","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_addresses","type":"address[]"},{"internalType":"address","name":"_vault","type":"address"}],"name":"cleanupRolloverQueue","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"controllers","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint40","name":"","type":"uint40"},{"internalType":"uint40","name":"","type":"uint40"},{"internalType":"uint16","name":"","type":"uint16"}],"name":"createEpoch","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address[2]","name":"","type":"address[2]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_marketId","type":"uint256"},{"internalType":"uint40","name":"_epochBegin","type":"uint40"},{"internalType":"uint40","name":"_epochEnd","type":"uint40"},{"internalType":"uint16","name":"_withdrawalFee","type":"uint16"},{"internalType":"uint256","name":"_premiumEmissions","type":"uint256"},{"internalType":"uint256","name":"_collatEmissions","type":"uint256"}],"name":"createEpochWithEmissions","outputs":[{"internalType":"uint256","name":"epochId","type":"uint256"},{"internalType":"address[2]","name":"vaults","type":"address[2]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"strike","type":"uint256"},{"internalType":"address","name":"oracle","type":"address"},{"internalType":"address","name":"underlyingAsset","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"tokenURI","type":"string"},{"internalType":"address","name":"controller","type":"address"},{"internalType":"uint256","name":"relayerFee","type":"uint256"},{"internalType":"uint256","name":"depositFee","type":"uint256"},{"internalType":"uint256","name":"minQueueDeposit","type":"uint256"}],"internalType":"struct CarouselFactory.CarouselMarketConfigurationCalldata","name":"_marketCalldata","type":"tuple"}],"name":"createNewCarouselMarket","outputs":[{"internalType":"address","name":"premium","type":"address"},{"internalType":"address","name":"collateral","type":"address"},{"internalType":"uint256","name":"marketId","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"strike","type":"uint256"},{"internalType":"address","name":"oracle","type":"address"},{"internalType":"address","name":"underlyingAsset","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"tokenURI","type":"string"},{"internalType":"address","name":"controller","type":"address"}],"internalType":"struct VaultFactoryV2.MarketConfigurationCalldata","name":"","type":"tuple"}],"name":"createNewMarket","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"emissionsToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"epochFee","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"epochId","type":"uint256"}],"name":"getEpochFee","outputs":[{"internalType":"uint16","name":"fee","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"marketId","type":"uint256"},{"internalType":"uint40","name":"epochBegin","type":"uint40"},{"internalType":"uint40","name":"epochEnd","type":"uint40"}],"name":"getEpochId","outputs":[{"internalType":"uint256","name":"epochId","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"marketId","type":"uint256"}],"name":"getEpochsByMarketId","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"uint256","name":"_strikePrice","type":"uint256"},{"internalType":"address","name":"_underlying","type":"address"}],"name":"getMarketId","outputs":[{"internalType":"uint256","name":"marketId","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"_marketId","type":"uint256"}],"name":"getMarketInfo","outputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"strike","type":"uint256"},{"internalType":"address","name":"underlyingAsset","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getVaults","outputs":[{"internalType":"address[2]","name":"vaults","type":"address[2]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"marketIdInfo","outputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"strike","type":"uint256"},{"internalType":"address","name":"underlyingAsset","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"marketIdToEpochs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"marketIdToVaults","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"marketToOracle","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_treasury","type":"address"}],"name":"setTreasury","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"timelocker","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"treasury","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_marketId","type":"uint256"},{"internalType":"address","name":"_wAddress","type":"address"}],"name":"whitelistAddressOnMarket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_controller","type":"address"}],"name":"whitelistController","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const ControllerABI = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_l2Sequencer","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"EpochExpired","type":"error"},{"inputs":[],"name":"EpochFinishedAlready","type":"error"},{"inputs":[],"name":"EpochNotExist","type":"error"},{"inputs":[],"name":"EpochNotExpired","type":"error"},{"inputs":[],"name":"EpochNotStarted","type":"error"},{"inputs":[],"name":"GracePeriodNotOver","type":"error"},{"inputs":[{"internalType":"uint256","name":"marketId","type":"uint256"}],"name":"MarketDoesNotExist","type":"error"},{"inputs":[],"name":"OraclePriceZero","type":"error"},{"inputs":[{"internalType":"int256","name":"price","type":"int256"}],"name":"PriceNotAtStrikePrice","type":"error"},{"inputs":[],"name":"PriceOutdated","type":"error"},{"inputs":[],"name":"RoundIDOutdated","type":"error"},{"inputs":[],"name":"SequencerDown","type":"error"},{"inputs":[],"name":"VaultNotZeroTVL","type":"error"},{"inputs":[],"name":"VaultZeroTVL","type":"error"},{"inputs":[],"name":"ZeroAddress","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"epochId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"marketId","type":"uint256"},{"components":[{"internalType":"uint256","name":"COLLAT_claimTVL","type":"uint256"},{"internalType":"uint256","name":"COLLAT_finalTVL","type":"uint256"},{"internalType":"uint256","name":"PREM_claimTVL","type":"uint256"},{"internalType":"uint256","name":"PREM_finalTVL","type":"uint256"}],"indexed":false,"internalType":"struct ControllerPeggedAssetV2.VaultTVL","name":"tvl","type":"tuple"},{"indexed":false,"internalType":"bool","name":"strikeMet","type":"bool"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"strikeData","type":"uint256"}],"name":"EpochResolved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"epochId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"marketId","type":"uint256"},{"components":[{"internalType":"uint256","name":"COLLAT_claimTVL","type":"uint256"},{"internalType":"uint256","name":"COLLAT_finalTVL","type":"uint256"},{"internalType":"uint256","name":"PREM_claimTVL","type":"uint256"},{"internalType":"uint256","name":"PREM_finalTVL","type":"uint256"}],"indexed":false,"internalType":"struct ControllerPeggedAssetV2.VaultTVL","name":"tvl","type":"tuple"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"NullEpoch","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"epochId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"marketId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"premiumFee","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"collateralFee","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"ProtocolFeeCollected","type":"event"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"fee","type":"uint256"}],"name":"calculateWithdrawalFeeValue","outputs":[{"internalType":"uint256","name":"feeValue","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"_marketId","type":"uint256"},{"internalType":"uint256","name":"_epochId","type":"uint256"}],"name":"canExecDepeg","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_marketId","type":"uint256"},{"internalType":"uint256","name":"_epochId","type":"uint256"}],"name":"canExecEnd","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_marketId","type":"uint256"},{"internalType":"uint256","name":"_epochId","type":"uint256"}],"name":"canExecNullEpoch","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_marketId","type":"uint256"}],"name":"getLatestPrice","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getVaultFactory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_marketId","type":"uint256"},{"internalType":"uint256","name":"_epochId","type":"uint256"}],"name":"triggerDepeg","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_marketId","type":"uint256"},{"internalType":"uint256","name":"_epochId","type":"uint256"}],"name":"triggerEndEpoch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_marketId","type":"uint256"},{"internalType":"uint256","name":"_epochId","type":"uint256"}],"name":"triggerNullEpoch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vaultFactory","outputs":[{"internalType":"contract IVaultFactoryV2","name":"","type":"address"}],"stateMutability":"view","type":"function"}];
// const CarouselCreatorABI = 

module.exports = {CarouselFactoryABI, ControllerABI};