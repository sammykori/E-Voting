pragma solidity ^0.4.22;

contract Election {
    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        string vPos;
        string gender;
        string PoS;
        string manifesto;
        uint voteCount;
        string eName;
    }

    // Store Candidates
    // Fetch Candidate
    mapping(uint => Candidate) public candidates;
    // Store Candidates Count
    uint public candidatesCount;


    constructor () public {
        addCandidate("Samuel Kori", "President", "Male", "Computer Science", "I am A good boy and I need your vote", "Lee Election");
        addCandidate("Cole Baidoe", "President", "Male", "Law", "I am A bad boy and I need your vote", "Lee Election");    
    }

    function addCandidate (string memory _name, string memory _vPos, string memory _gender, string memory _PoS, string memory _manifesto, string memory _eName) public {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _vPos, _gender, _PoS, _manifesto, 0, _eName);
    }
    
    function incrementVoteCount(uint _candidateId) public{
        // update candidate vote Count
        candidates[_candidateId].voteCount ++;
    }

}