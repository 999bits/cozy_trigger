// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @dev Contains the enums used to define valid Cozy states.
 * @dev All states except TRIGGERED are valid for sets, and all states except PAUSED are valid for markets/triggers.
 */

enum MarketState {
    ACTIVE,
    FROZEN,
    TRIGGERED
}

enum SetState {
    ACTIVE,
    PAUSED,
    FROZEN
}
