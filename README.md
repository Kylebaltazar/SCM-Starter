# Assessment Smart Contract

## Overview

The Assessment smart contract is a simple Ethereum smart contract written in Solidity. It provides basic functionality for managing an account balance, depositing, withdrawing, and buying items. The contract also includes events for key transactions.

## Contract Details

- **Contract Name:** Assessment
- **Solidity Version:** ^0.8.9
- **SPDX-License-Identifier:** UNLICENSED

## Features

1. **Deposit:** Allows the owner to deposit funds into the contract.
2. **Withdraw:** Allows the owner to withdraw funds from the contract, subject to a check for sufficient balance.
3. **Buy Item:** Allows the owner to buy items with predefined prices, deducting the corresponding amount from the balance.

## Events

- **Deposit:** Emitted when a deposit is made.
- **Withdraw:** Emitted when a withdrawal is made.
- **ItemBought:** Emitted when an item is successfully purchased.
