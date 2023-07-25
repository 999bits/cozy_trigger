// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {IChainlinkTrigger} from "./IChainlinkTrigger.sol";
import {IManager} from "./IManager.sol";
import {TriggerMetadata} from "../structs/Triggers.sol";

/**
 * @notice Deploys Chainlink triggers that ensure two oracles stay within the given price
 * tolerance. It also supports creating a fixed price oracle to use as the truth oracle, useful
 * for e.g. ensuring stablecoins maintain their peg.
 */
interface IChainlinkTriggerFactory {
    /// @dev Emitted when the factory deploys a trigger.
    /// @param trigger Address at which the trigger was deployed.
    /// @param triggerConfigId Unique identifier of the trigger based on its configuration.
    /// @param truthOracle The address of the desired truthOracle for the trigger.
    /// @param trackingOracle The address of the desired trackingOracle for the trigger.
    /// @param priceTolerance The priceTolerance that the deployed trigger will have. See
    /// `ChainlinkTrigger.priceTolerance()` for more information.
    /// @param truthFrequencyTolerance The frequencyTolerance that the deployed trigger will have for the truth oracle. See
    /// `ChainlinkTrigger.truthFrequencyTolerance()` for more information.
    /// @param trackingFrequencyTolerance The frequencyTolerance that the deployed trigger will have for the tracking
    /// oracle. See `ChainlinkTrigger.trackingFrequencyTolerance()` for more information.
    /// @param name The name that should be used for markets that use the trigger.
    /// @param category The category of the trigger.
    /// @param description A human-readable description of the trigger.
    /// @param logoURI The URI of a logo image to represent the trigger.
    /// For other attributes, see the docs for the params of `deployTrigger` in
    /// this contract.
    event TriggerDeployed(
        address trigger,
        bytes32 indexed triggerConfigId,
        address indexed truthOracle,
        address indexed trackingOracle,
        uint256 priceTolerance,
        uint256 truthFrequencyTolerance,
        uint256 trackingFrequencyTolerance,
        string name,
        string category,
        string description,
        string logoURI
    );

    /// @notice The manager of the Cozy protocol.
    function manager() external view returns (IManager);

    /// @notice Maps the triggerConfigId to the number of triggers created with those configs.
    function triggerCount(bytes32) external view returns (uint256);

    /// @notice Call this function to deploy a ChainlinkTrigger.
    /// @param _truthOracle The address of the desired truthOracle for the trigger.
    /// @param _trackingOracle The address of the desired trackingOracle for the trigger.
    /// @param _priceTolerance The priceTolerance that the deployed trigger will
    /// have. See ChainlinkTrigger.priceTolerance() for more information.
    /// @param _truthFrequencyTolerance The frequency tolerance that the deployed trigger will
    /// have for the truth oracle. See ChainlinkTrigger.truthFrequencyTolerance() for more information.
    /// @param _trackingFrequencyTolerance The frequency tolerance that the deployed trigger will
    /// have for the tracking oracle. See ChainlinkTrigger.trackingFrequencyTolerance() for more information.
    function deployTrigger(
        AggregatorV3Interface _truthOracle,
        AggregatorV3Interface _trackingOracle,
        uint256 _priceTolerance,
        uint256 _truthFrequencyTolerance,
        uint256 _trackingFrequencyTolerance,
        uint256 _marketId,
        TriggerMetadata memory _metadata
    ) external returns (IChainlinkTrigger _trigger);

    /// @notice Call this function to deploy a ChainlinkTrigger with a
    /// FixedPriceAggregator as its truthOracle. This is useful if you were
    /// building a market in which you wanted to track whether or not a stablecoin
    /// asset had become depegged.
    /// @param _price The fixed price, or peg, with which to compare the trackingOracle price.
    /// @param _decimals The number of decimals of the fixed price. This should
    /// match the number of decimals used by the desired _trackingOracle.
    /// @param _trackingOracle The address of the desired trackingOracle for the trigger.
    /// @param _priceTolerance The priceTolerance that the deployed trigger will
    /// have. See ChainlinkTrigger.priceTolerance() for more information.
    /// @param _frequencyTolerance The frequency tolerance that the deployed trigger will
    /// have for the tracking oracle. See ChainlinkTrigger.trackingFrequencyTolerance() for more information.
    function deployTrigger(
        int256 _price,
        uint8 _decimals,
        AggregatorV3Interface _trackingOracle,
        uint256 _priceTolerance,
        uint256 _frequencyTolerance,
        uint256 _marketId,
        TriggerMetadata memory _metadata
    ) external returns (IChainlinkTrigger _trigger);

    /// @notice Call this function to determine the address at which a trigger
    /// with the supplied configuration would be deployed.
    /// @param _truthOracle The address of the desired truthOracle for the trigger.
    /// @param _trackingOracle The address of the desired trackingOracle for the trigger.
    /// @param _priceTolerance The priceTolerance that the deployed trigger would
    /// have. See ChainlinkTrigger.priceTolerance() for more information.
    /// @param _truthFrequencyTolerance The frequency tolerance that the deployed trigger would
    /// have for the truth oracle. See ChainlinkTrigger.truthFrequencyTolerance() for more information.
    /// @param _trackingFrequencyTolerance The frequency tolerance that the deployed trigger would
    /// have for the tracking oracle. See ChainlinkTrigger.trackingFrequencyTolerance() for more information.
    /// @param _triggerCount The zero-indexed ordinal of the trigger with respect to its
    /// configuration, e.g. if this were to be the fifth trigger deployed with
    /// these configs, then _triggerCount should be 4.
    function computeTriggerAddress(
        AggregatorV3Interface _truthOracle,
        AggregatorV3Interface _trackingOracle,
        uint256 _priceTolerance,
        uint256 _truthFrequencyTolerance,
        uint256 _trackingFrequencyTolerance,
        uint256 _triggerCount
    ) external view returns (address _address);

    /// @notice Call this function to find triggers with the specified
    /// configurations that can be used for new markets in Sets.
    /// @dev If this function returns the zero address, that means that an
    /// available trigger was not found with the supplied configuration. Use
    /// `deployTrigger` to deploy a new one.
    /// @param _truthOracle The address of the desired truthOracle for the trigger.
    /// @param _trackingOracle The address of the desired trackingOracle for the trigger.
    /// @param _priceTolerance The priceTolerance that the deployed trigger will
    /// have. See ChainlinkTrigger.priceTolerance() for more information.
    /// @param _truthFrequencyTolerance The frequency tolerance that the deployed trigger will
    /// have for the truth oracle. See ChainlinkTrigger.truthFrequencyTolerance() for more information.
    /// @param _trackingFrequencyTolerance The frequency tolerance that the deployed trigger will
    /// have for the tracking oracle. See ChainlinkTrigger.trackingFrequencyTolerance() for more information.
    function findAvailableTrigger(
        AggregatorV3Interface _truthOracle,
        AggregatorV3Interface _trackingOracle,
        uint256 _priceTolerance,
        uint256 _truthFrequencyTolerance,
        uint256 _trackingFrequencyTolerance
    ) external view returns (address);

    /// @notice Call this function to determine the identifier of the supplied trigger
    /// configuration. This identifier is used both to track the number of
    /// triggers deployed with this configuration (see `triggerCount`) and is
    /// emitted at the time triggers with that configuration are deployed.
    /// @param _truthOracle The address of the desired truthOracle for the trigger.
    /// @param _trackingOracle The address of the desired trackingOracle for the trigger.
    /// @param _priceTolerance The priceTolerance that the deployed trigger will
    /// have. See ChainlinkTrigger.priceTolerance() for more information.
    /// @param _truthFrequencyTolerance The frequency tolerance that the deployed trigger will
    /// have for the truth oracle. See ChainlinkTrigger.truthFrequencyTolerance() for more information.
    /// @param _trackingFrequencyTolerance The frequency tolerance that the deployed trigger will
    /// have for the tracking oracle. See ChainlinkTrigger.trackingFrequencyTolerance() for more information.
    function triggerConfigId(
        AggregatorV3Interface _truthOracle,
        AggregatorV3Interface _trackingOracle,
        uint256 _priceTolerance,
        uint256 _truthFrequencyTolerance,
        uint256 _trackingFrequencyTolerance
    ) external view returns (bytes32);

    /// @notice Call this function to deploy a FixedPriceAggregator contract,
    /// which behaves like a Chainlink oracle except that it always returns the
    /// same price.
    /// @dev If the specified contract is already deployed, we return it's address
    /// instead of reverting to avoid duplicate aggregators
    /// @param _price The fixed price, in the decimals indicated, returned by the deployed oracle.
    /// @param _decimals The number of decimals of the fixed price.
    function deployFixedPriceAggregator(
        int256 _price,
        uint8 _decimals
    ) external returns (AggregatorV3Interface);

    /// @notice Call this function to compute the address that a
    /// FixedPriceAggregator contract would be deployed to with the provided args.
    /// @param _price The fixed price, in the decimals indicated, returned by the deployed oracle.
    /// @param _decimals The number of decimals of the fixed price.
    function computeFixedPriceAggregatorAddress(
        int256 _price,
        uint8 _decimals
    ) external view returns (address);

    function getTriggerByMarketId(
        uint256 _marketId
    ) external view returns (address);
}
