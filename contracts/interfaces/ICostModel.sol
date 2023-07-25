// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @dev Interface that all cost models must conform to.
 */
interface ICostModel {
    /// @notice Returns the cost of purchasing protection as a percentage of the amount being purchased, as a wad.
    /// For example, if you are purchasing $200 of protection and this method returns 1e17, then the cost of
    /// the purchase is 200 * 1e17 / 1e18 = $20.
    /// @param utilization Current utilization of the market.
    /// @param newUtilization Utilization ratio of the market after purchasing protection.
    function costFactor(
        uint256 utilization,
        uint256 newUtilization
    ) external view returns (uint256);

    /// @notice Gives the return value in assets of returning protection, as a percentage of
    /// the supplier fee pool, as a wad. For example, if the supplier fee pool currently has $100
    /// and this method returns 1e17, then you will get $100 * 1e17 / 1e18 = $10 in assets back.
    /// @param utilization Current utilization of the market.
    /// @param newUtilization Utilization ratio of the market after cancelling protection.
    function refundFactor(
        uint256 utilization,
        uint256 newUtilization
    ) external view returns (uint256);

    /// @notice Returns true if the cost model's storage variables need to be updated.
    function shouldUpdate() external view returns (bool);

    /// @notice Updates the cost model's storage variables.
    function update() external;
}
