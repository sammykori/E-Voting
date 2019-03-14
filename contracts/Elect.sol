pragma solidity >=0.4.22 <0.6.0;

contract Elect {
    // Model a Candidate
    struct Election {
        uint id;
        string name;
        string desc;
        string institution;
        address creator;
    }

    mapping(uint => Election) public elections;
    
    struct electionDetails {
        uint id;
        string startDate;
        string endDate;
        string startTime;
        string endTime;
    }

    mapping(uint => electionDetails) public details;
    
    uint public electionsCount;
    uint public detailsCount;


    constructor () public {
        
    }

    function createElection (string memory _name, string memory _desc, string memory _inst, string memory _sDate, string memory _eDate, string memory _sTime, string memory _eTime) public {
        electionsCount ++;
        detailsCount ++;
        elections[electionsCount] = Election(electionsCount, _name, _desc, _inst, msg.sender);
        details[detailsCount] = electionDetails(detailsCount, _sDate, _eDate, _sTime, _eTime);
    }

}