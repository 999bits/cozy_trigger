// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./utils/FixedPointMathLib.sol";

import "./abstract/BaseTrigger.sol";
import "hardhat/console.sol";

/**
 * @notice A trigger contract that takes two addresses: a truth oracle and a tracking oracle.
 * This trigger ensures the two oracles always stay within the given price tolerance; the delta
 * in prices can be equal to but not greater than the price tolerance.
 */
contract ChainlinkTrigger is BaseTrigger {
    using FixedPointMathLib for uint256;

    uint256 internal constant ZOC = 1e4;

    /// @notice The canonical oracle, assumed to be correct.
    AggregatorV3Interface public immutable truthOracle;

    /// @notice The oracle we expect to diverge.
    AggregatorV3Interface public immutable trackingOracle;

    /// @notice The maximum percent delta between oracle prices that is allowed, expressed as a zoc.
    /// For example, a 0.2e4 priceTolerance would mean the trackingOracle price is
    /// allowed to deviate from the truthOracle price by up to +/- 20%, but no more.
    /// Note that if the truthOracle returns a price of 0, we treat the priceTolerance
    /// as having been exceeded, no matter what price the trackingOracle returns.
    uint256 public immutable priceTolerance;

    /// @notice The maximum amount of time we allow to elapse before the truth oracle's price is deemed stale.
    uint256 public immutable truthFrequencyTolerance;

    /// @notice The maximum amount of time we allow to elapse before the tracking oracle's price is deemed stale.
    uint256 public immutable trackingFrequencyTolerance;

    /// @notice The scale factor to apply to the oracle with less decimals if the oracles do not have the same amount
    /// of decimals.
    uint256 public immutable scaleFactor;

    /// @notice Specifies the oracle price to scale upwards if the oracles do not have the same amount of decimals.
    OracleToScale public immutable oracleToScale;

    enum OracleToScale {
        NONE,
        TRUTH,
        TRACKING
    }

    /// @dev Thrown when the `oracle`s price is negative.
    error InvalidPrice();

    /// @dev Thrown when the `priceTolerance` is greater than or equal to `ZOC`.
    error InvalidPriceTolerance();

    /// @dev Thrown when the `oracle`s price timestamp is greater than the block's timestamp.
    error InvalidTimestamp();

    /// @dev Thrown when the `oracle`s last update is more than `frequencyTolerance` seconds ago.
    error StaleOraclePrice();

    /// @param _manager Address of the Cozy protocol manager.
    /// @param _truthOracle The canonical oracle, assumed to be correct.
    /// @param _trackingOracle The oracle we expect to diverge.
    /// @param _priceTolerance The maximum percent delta between oracle prices that is allowed, as a zoc.
    /// @param _truthFrequencyTolerance The maximum amount of time we allow to elapse before the truth oracle's price is
    /// deemed stale.
    /// @param _trackingFrequencyTolerance The maximum amount of time we allow to elapse before the tracking oracle's
    /// price is deemed stale.
    constructor(
        IManager _manager,
        AggregatorV3Interface _truthOracle,
        AggregatorV3Interface _trackingOracle,
        uint256 _priceTolerance,
        uint256 _truthFrequencyTolerance,
        uint256 _trackingFrequencyTolerance
    ) BaseTrigger(_manager) {
        if (_priceTolerance >= ZOC) revert InvalidPriceTolerance();
        truthOracle = _truthOracle;
        trackingOracle = _trackingOracle;
        priceTolerance = _priceTolerance;
        truthFrequencyTolerance = _truthFrequencyTolerance;
        trackingFrequencyTolerance = _trackingFrequencyTolerance;

        OracleToScale _oracleToScale;
        uint256 _scaleFactor;
        uint256 _truthOracleDecimals = truthOracle.decimals();
        uint256 _trackingOracleDecimals = trackingOracle.decimals();
        if (_trackingOracleDecimals < _truthOracleDecimals) {
            _oracleToScale = OracleToScale.TRACKING;
            _scaleFactor =
                10 ** (_truthOracleDecimals - _trackingOracleDecimals);
        } else if (_truthOracleDecimals < _trackingOracleDecimals) {
            _oracleToScale = OracleToScale.TRUTH;
            _scaleFactor =
                10 ** (_trackingOracleDecimals - _truthOracleDecimals);
        }
        oracleToScale = _oracleToScale;
        scaleFactor = _scaleFactor;

        runProgrammaticCheck();
    }

    /// @notice Compares the oracle's price to the reference oracle and toggles the trigger if required.
    /// @dev This method executes the `programmaticCheck()` and makes the
    /// required state changes both in the trigger and the sets.
    function runProgrammaticCheck() public returns (MarketState) {
        // Rather than revert if not active, we simply return the state and exit.
        // Both behaviors are acceptable, but returning is friendlier to the caller
        // as they don't need to handle a revert and can simply parse the
        // transaction's logs to know if the call resulted in a state change.
        if (state != MarketState.ACTIVE) return state;
        if (programmaticCheck())
            // return _updateTriggerState(MarketState.TRIGGERED);
            return MarketState.TRIGGERED;
        return state;
    }

    function updateTriggerState(
        MarketState newState
    ) public returns (MarketState) {
        require(
            newState != state,
            "New state must be different from current state"
        );
        return _updateTriggerState(newState);
    }

    /// @notice Returns true if the trigger has been acknowledged by the entity responsible for transitioning trigger
    /// state.
    /// @notice Chainlink triggers are programmatic, so this always returns true.
    function acknowledged() public pure override returns (bool) {
        return true;
    }

    /// @dev Executes logic to programmatically determine if the trigger should be toggled.
    function programmaticCheck() internal view returns (bool) {
        uint256 _truePrice = _oraclePrice(truthOracle, truthFrequencyTolerance);
        uint256 _trackingPrice = _oraclePrice(
            trackingOracle,
            trackingFrequencyTolerance
        );

        // If one of the oracles has fewer decimals than the other, we scale up the lower decimal price.
        if (oracleToScale == OracleToScale.TRUTH)
            _truePrice = _truePrice * scaleFactor;
        else if (oracleToScale == OracleToScale.TRACKING)
            _trackingPrice = _trackingPrice * scaleFactor;

        uint256 _priceDelta = _truePrice > _trackingPrice
            ? _truePrice - _trackingPrice
            : _trackingPrice - _truePrice;

        // We round up when calculating the delta percentage to accommodate for precision loss to
        // ensure that the state becomes triggered when the delta is greater than the price tolerance.
        // When the delta is less than or exactly equal to the price tolerance, the resulting rounded
        // up value will not be greater than the price tolerance, as expected.
        return
            _truePrice > 0
                ? _priceDelta.mulDivUp(ZOC, _truePrice) > priceTolerance
                : true;
    }

    /// @dev Returns the current price of the specified `_oracle`.
    function _oraclePrice(
        AggregatorV3Interface _oracle,
        uint256 _frequencyTolerance
    ) internal view returns (uint256 _price) {
        (, int256 _priceInt, , uint256 _updatedAt, ) = _oracle
            .latestRoundData();
        if (_updatedAt > block.timestamp) revert InvalidTimestamp();
        if (block.timestamp - _updatedAt > _frequencyTolerance)
            revert StaleOraclePrice();
        if (_priceInt < 0) revert InvalidPrice();
        _price = uint256(_priceInt);
    }

    function getTrackingPriceAtTriggered() public view returns (uint256) {
        if (programmaticCheck())
            return _oraclePrice(trackingOracle, trackingFrequencyTolerance);
    }
}
