// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IManager} from "./IManager.sol";
import {ISet} from "./ISet.sol";
import {ITrigger} from "./ITrigger.sol";

/**
 * @dev Additional functions that are recommended to have in a trigger, but are not required.
 */
interface IBaseTrigger is ITrigger {
    /// @notice Returns the set address at the specified index in the trigger's list of sets.
    function sets(uint256 index) external returns (ISet set);

    /// @notice Returns all sets in the trigger's list of sets.
    function getSets() external returns (ISet[] memory);

    /// @notice Returns the number of Sets that use this trigger in a market.
    function getSetsLength() external returns (uint256 setsLength);

    /// @notice Returns the address of the trigger's manager.
    function manager() external returns (IManager managerAddress);

    /// @notice The maximum amount of sets that can be added to this trigger.
    function MAX_SET_LENGTH() external returns (uint256 maxSetLength);
}
