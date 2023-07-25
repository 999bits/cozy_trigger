// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ISet} from "./ISet.sol";
import {MarketState} from "../structs/StateEnums.sol";

/**
 * @dev The minimal functions a trigger must implement to work with the Cozy protocol.
 */
interface ITrigger {
    /// @dev Emitted when a new set is added to the trigger's list of sets.
    event SetAdded(ISet set);

    /// @dev Emitted when a trigger's state is updated.
    event TriggerStateUpdated(MarketState indexed state);

    /// @notice The current trigger state. This should never return PAUSED.
    function state() external returns (MarketState);

    /// @notice Called by the Manager to add a newly created set to the trigger's list of sets.
    function addSet(ISet set) external returns (bool);

    /// @notice Returns true if the trigger has been acknowledged by the entity responsible for transitioning trigger
    /// state.
    function acknowledged() external returns (bool);
}
