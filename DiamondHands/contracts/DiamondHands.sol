//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

struct LockedUntil {
    uint256 until;
    uint256 value;
    bool claimed;
}

contract DiamondHands {
    mapping(address => LockedUntil[]) public lockedUntil;
    address payable owner;
    uint256 fee;
    uint256 totalFee;

    receive() external payable {
        totalFee = totalFee + (fee * msg.value) / 100;

        lockedUntil[msg.sender].push(
            LockedUntil(
                block.timestamp + 712 days,
                msg.value - (fee * msg.value) / 100,
                false
            )
        );
    }

    constructor(uint256 _fee) {
        console.log("Initializing contract...");
        owner = payable(msg.sender);
        fee = _fee;
        totalFee = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function setOwner(address payable newOwner) external onlyOwner {
        owner = newOwner;
    }

    function setFee(uint256 _fee) external onlyOwner {
        require(
            _fee > 0 && _fee <= 50,
            "Fee percent is not between 0% and 50%"
        );
        fee = _fee;
    }

    function withdrawFee()
        external
        payable
        onlyOwner
        returns (bool, bytes memory)
    {
        require(totalFee > 0, "Total fee collected is 0");
        return msg.sender.call{value: totalFee}("");
    }

    function withdraw() external returns (uint256) {
        LockedUntil[] storage currentUserData = lockedUntil[msg.sender];

        uint256 etherToWithdraw = 0;

        for (uint256 i = 0; i < currentUserData.length; i++) {
            if (
                block.timestamp >= currentUserData[i].until &&
                currentUserData[i].claimed == false
            ) {
                etherToWithdraw += currentUserData[i].value;
                currentUserData[i].claimed = true;
            }
        }

        if (etherToWithdraw != 0) {
            msg.sender.call{value: etherToWithdraw}("");
        }

        return etherToWithdraw;
    }
}
