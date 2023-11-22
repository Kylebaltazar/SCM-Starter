// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event ItemBought(string itemName, uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint256 _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint256 _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert
                InsufficientBalance({
                    balance: balance,
                    withdrawAmount: _withdrawAmount
                });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }

    function buyItem(string memory _itemName) public {

        uint256 itemPrice;

        // Determine the price based on the selected item
        if (compareStrings(_itemName, "Sisig")) {
            itemPrice = 200;
        } else if (compareStrings(_itemName, "Calamares")) {
            itemPrice = 150;
        } else if (compareStrings(_itemName, "Bulalo")) {
            itemPrice = 400;
        } else if (compareStrings(_itemName, "Lechon")) {
            itemPrice = 600;
        } else {
            revert("Invalid item selected");
        }

        // Check if the user has enough balance to buy the item
        require(balance >= itemPrice, "Insufficient funds to buy the item");

        // Deduct the item price from the user's balance
        balance -= itemPrice;

        // Emit the event
        emit ItemBought(_itemName, itemPrice);
    }

    function compareStrings(string memory a, string memory b)
        internal
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b)));
    }
}
