// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @dev Interface that all DripDecay models must conform to.
 */
interface IDripDecayModel {
    /// @notice Returns a rate which is used as either:
    ///   - The percentage of the fee pool that should be dripped to suppliers, per second, as a wad.
    ///   - The decay rate of PToken value, as percent per second, where the percent is a wad.
    /// @dev The returned value, when interpreted as drip rate, is not equivalent to the annual yield
    /// earned by suppliers. Annual yield can be computed as
    /// `supplierFeePool * dripRate * secondsPerYear / totalAssets`.
    /// @param utilization Current utilization of the set.
    function dripDecayRate(uint256 utilization) external view returns (uint256);
}
