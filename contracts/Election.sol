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
    mapping(address => string) public voters;
    // Store Candidates Count
    uint public candidatesCount;
    uint public voteCount;

    event votedEvent (
        uint indexed _candidateId
    );


    constructor () public {
        addCandidate("Samuel Kori", "President", "Male", "CS", "I am A good boy and I need your vote", "Lee Election");
        addCandidate("Cole Baidoe", "President", "Male", "LAW", "I am A bad boy and I need your vote", "Lee Election");    
    }

    function addCandidate (string memory _name, string memory _vPos, string memory _gender, string memory _PoS, string memory _manifesto, string memory _eName) public {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _vPos, _gender, _PoS, _manifesto, 0, _eName);
    }
    
    function incrementVoteCount(uint _candidateId) public{
        // update candidate vote Count
        candidates[_candidateId].voteCount ++;
    }
    
    function vote (uint _candidateId, string memory _pos) public {
        // require that they haven't voted before
        // require(!voters[msg.sender]);
        voteCount ++;

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // record that voter has voted
        voters[msg.sender] = _pos;

        // update candidate vote Count
        incrementVoteCount(_candidateId);

        // trigger voted event
        emit votedEvent(_candidateId);
    }

}