pragma solidity ^0.6.2;

import {BaseRelayRecipient} from "../lib/gsn/contracts/BaseRelayRecipient.sol";
import {IKnowForwarderAddress} from "../lib/gsn/contracts/interfaces/IKnowForwarderAddress.sol";

contract PollingEvents {
    event PollCreated(
        address indexed creator,
        uint256 blockCreated,
        uint256 indexed pollId,
        uint256 startDate,
        uint256 endDate,
        string multiHash,
        string url
    );

    event PollWithdrawn(
        address indexed creator,
        uint256 blockWithdrawn,
        uint256 pollId
    );

    event Voted(
        address indexed voter,
        uint256 indexed pollId,
        uint256 indexed optionId
    );
}

contract PollingEmitter is PollingEvents, BaseRelayRecipient, IKnowForwarderAddress {
    uint256 public npoll;

    function createPoll(uint256 startDate, uint256 endDate, string calldata multiHash, string calldata url)
        external
    {
        uint256 startDate_ = startDate > now ? startDate : now;
        require(endDate > startDate_, "polling-invalid-poll-window");
        emit PollCreated(
            _msgSender(),
            block.number,
            npoll,
            startDate_,
            endDate,
            multiHash,
            url
        );
        require(npoll < uint(-1), "polling-too-many-polls");
        npoll++;
    }

    constructor(address _trustedForwarder) public {
        trustedForwarder = _trustedForwarder;
    }

    function versionRecipient() external override view returns (string memory) {
        return "Version 1";
    }

    function getTrustedForwarder() external view override returns(address) {
        return trustedForwarder;
    }

    function withdrawPoll(uint256 pollId) external {
        emit PollWithdrawn(_msgSender(), block.number, pollId);
    }

    function vote(uint256 pollId, uint256 optionId) external {
        emit Voted(_msgSender(), pollId, optionId);
    }
}
