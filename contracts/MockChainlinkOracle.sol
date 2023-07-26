// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.17;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract MockChainlinkOracle is AggregatorV3Interface {
  uint8 public immutable decimals;
  string public constant description = "MockChainlinkOracle";
  uint256 public constant version = 42;

  uint256 price;
  uint256 updatedAt;

  constructor(uint256 _price, uint8 _decimals) {
    price = _price;
    decimals = _decimals;
  }

  function latestRoundData() external view returns (uint80, int256, uint256, uint256, uint80) {
    return (
      uint80(block.number), // Round.
      int256(price), // Answer.
      block.timestamp, // StartedAt.
      updatedAt, // UpdatedAt.
      uint80(block.number) // AnsweredInRound.
    );
  }

  // Just to make the compiler happy.
  function getRoundData(uint80 /*_roundId */ ) external view returns (uint80, int256, uint256, uint256, uint80) {
    return this.latestRoundData();
  }

  function TEST_HOOK_setPrice(uint256 _newPrice) public {
    price = _newPrice;
  }

  function TEST_HOOK_setUpdatedAt(uint256 _timestamp) public {
    updatedAt = _timestamp;
  }
}
