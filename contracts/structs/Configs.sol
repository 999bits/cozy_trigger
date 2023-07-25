// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IDripDecayModel} from "../interfaces/IDripDecayModel.sol";
import {ICostModel} from "../interfaces/ICostModel.sol";
import {ITrigger} from "../interfaces/ITrigger.sol";

/// @notice Set-level configuration.
struct SetConfig {
    uint32 leverageFactor; // The set's leverage factor.
    uint16 depositFee; // Fee applied on each deposit and mint.
    // If true, the weight of a market when triggered is automatically distributed pro rata among non-triggered markets.
    // If false, the set admin must manually rebalance weights through a configuration update.
    bool rebalanceWeightsOnTrigger;
}

/// @notice Market-level configuration.
struct MarketConfig {
    ITrigger trigger; // Address of the trigger contract for this market.
    ICostModel costModel; // Contract defining the cost model for this market.
    IDripDecayModel dripDecayModel; // The model used for decay rate of PTokens and the rate at which funds are dripped to
    // suppliers for their yield.
    uint16 weight; // Weight of this market. Sum of weights across all markets must sum to 100% (1e4, 1 zoc).
    uint16 purchaseFee; // Fee applied on each purchase.
    uint16 saleFee; // Penalty applied on ptoken sales.
}

/// @notice Metadata for a configuration update.
struct ConfigUpdateMetadata {
    // A hash representing queued `SetConfig` and `MarketConfig[]` updates. This hash is used to prove that the
    // `SetConfig` and `MarketConfig[]` params used when applying config updates are identical to the queued updates.
    // This strategy is used instead of storing non-hashed `SetConfig` and `MarketConfig[]` for gas optimization
    // and to avoid dynamic array manipulation. This hash is set to bytes32(0) when there is no config update queued.
    bytes32 queuedConfigUpdateHash;
    // Earliest timestamp at which ISet.finalizeUpdateConfigs can be called to apply config updates queued by
    // updateConfigs.
    uint64 configUpdateTime;
    // The latest timestamp after configUpdateTime at which ISet.finalizeUpdateConfigs can be called to apply config
    // updates queued by ISet.updateConfigs. After this timestamp, the queued config updates expire and can no longer be
    // applied.
    uint64 configUpdateDeadline;
}
