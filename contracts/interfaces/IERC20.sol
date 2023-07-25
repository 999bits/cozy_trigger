// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @dev Interface for ERC20 tokens.
 */
interface IERC20 {
    /// @dev Emitted when the allowance of a `spender` for an `owner` is updated, where `amount` is the new allowance.
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
    /// @dev Emitted when `amount` tokens are moved from `from` to `to`.
    event Transfer(address indexed from, address indexed to, uint256 value);

    /// @notice Returns the remaining number of tokens that `spender` will be allowed to spend on behalf of `holder`.
    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    /// @notice Sets `_amount` as the allowance of `_spender` over the caller's tokens.
    function approve(address spender, uint256 amount) external returns (bool);

    /// @notice Returns the amount of tokens owned by `account`.
    function balanceOf(address account) external view returns (uint256);

    /// @notice Returns the decimal places of the token.
    function decimals() external view returns (uint8);

    /// @notice Sets `_value` as the allowance of `_spender` over `_owner`s tokens, given a signed approval from the
    /// owner.
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    /// @notice Returns the name of the token.
    function name() external view returns (string memory);

    /// @notice Returns the symbol of the token.
    function symbol() external view returns (string memory);

    /// @notice Returns the amount of tokens in existence.
    function totalSupply() external view returns (uint256);

    /// @notice Moves `_amount` tokens from the caller's account to `_to`.
    function transfer(address to, uint256 amount) external returns (bool);

    /// @notice Moves `_amount` tokens from `_from` to `_to` using the allowance mechanism. `_amount` is then deducted
    /// from the caller's allowance.
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}
