//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

struct LockedUntil {
    uint256 until;
    uint256 value;
}

contract DiamondHands {
    mapping(address => LockedUntil[]) public lockedUntil;

    constructor() {
        console.log("Initializing contract...");
    }

    receive() external payable {
        console.log(
            "Received %s, locking until %s",
            msg.value,
            block.timestamp
        );

        lockedUntil[msg.sender].push(
            LockedUntil(block.timestamp + 712 days, msg.value)
        );
    }

    function withdraw() external returns (uint256) {
        LockedUntil[] memory currentUserData = lockedUntil[msg.sender];

        uint256 etherToWithdraw = 0;

        for (uint256 i = 0; i < currentUserData.length; i++) {
            if (block.timestamp > currentUserData[i].until) {
                etherToWithdraw += currentUserData[i].value;
            } else {
                console.log(
                    "You can withdraw %s ether in %s",
                    currentUserData[i].value,
                    block.timestamp - currentUserData[i].until
                );
            }
        }

        if (etherToWithdraw == 0) {
            console.log("No ether to withdraw!");
        } else {
            console.log(
                "Transfering %s ether to %s",
                etherToWithdraw,
                msg.sender
            );
            msg.sender.call{value: etherToWithdraw}("");
        }

        return etherToWithdraw;
    }
}
