pragma solidity >=0.4.22 <0.6.0;

contract Register {
  struct Admin{
    uint id;
    address AdminAdd;
    string email;
    string username;
    string secretToken;
  }

  mapping(address => Admin) public admins;
  mapping(address => bool) public logins;
  
  address[] public adminAccounts;

  uint public adminCount;

  constructor() public {

  }

  function registerAdmin(string memory _email, string memory _username, string memory _secretToken) public {
    adminCount ++;
    admins[msg.sender] = Admin(adminCount,msg.sender, _email, _username, _secretToken);
  }
  
  function loginAdmin(string memory _username, string memory _secretToken) view public returns(string memory){
    if(uint(keccak256(abi.encodePacked(_secretToken))) == uint(keccak256(abi.encodePacked(admins[msg.sender].secretToken))) && uint(keccak256(abi.encodePacked(_username))) == uint(keccak256(abi.encodePacked(admins[msg.sender].username)))) {
        return "true";
    }else{
        return "false";
    }
  }
}
