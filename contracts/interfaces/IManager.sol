// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {MarketConfig, SetConfig} from "../structs/Configs.sol";
import {IERC20} from "./IERC20.sol";
import {ISet} from "./ISet.sol";

/**
 * @notice The Manager is in charge of the full Cozy protocol. Configuration parameters are defined here, it serves
 * as the entry point for all privileged operations, and exposes the `createSet` method used to create new sets.
 */
interface IManager {
    /// @notice For the specified set, returns whether it's a valid Cozy set.
    function isSet(address) external view returns (bool);

    /// @notice The Cozy protocol owner.
    function owner() external view returns (address);

    /// @notice The Cozy protocol pauser.
    function pauser() external view returns (address);
}
