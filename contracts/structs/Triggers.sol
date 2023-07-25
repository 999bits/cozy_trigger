// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct TriggerMetadata {
    // The name that should be used for markets that use the trigger.
    string name;
    // Category of the trigger.
    string category;
    // A human-readable description of the trigger.
    string description;
    // The URI of a logo image to represent the trigger.
    string logoURI;
}
