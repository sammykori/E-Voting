pragma solidity ^0.4.22;
import "./Election.sol";

contract Voter {
    // Store accounts that have voted
    mapping(address => bool) public voters;

    // voted event
    event votedEvent (
        uint indexed _candidateId
    );
    
    Election elect;
    
    function setAddress (address _address) public{
        elect = Election(_address);
    }


    function vote (uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= elect.candidatesCount());

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        elect.incrementVoteCount(_candidateId);

        // trigger voted event
        emit votedEvent(_candidateId);
    }
}