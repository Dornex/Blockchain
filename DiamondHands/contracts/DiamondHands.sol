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

    constructor() {
        console.log("Initializing contract...");
    }

    receive() external payable {
        lockedUntil[msg.sender].push(
            LockedUntil(block.timestamp + 712 days, msg.value, false)
        );
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
