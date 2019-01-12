App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    hasVoted: false,
    constants:{"token": "7652eb1ff815652bf2ef0b15b15a7b03",
    "domain": "http://kori123.herokuapp.com"},
    eTag: '',
  
    init: function() {
      return App.initWeb3();
    },
  
    initWeb3: function() {
      // TODO: refactor conditional
      if (typeof web3 !== 'undefined') {
        // If a web3 instance is already provided by Meta Mask.
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      } else {
        // Specify default instance if no web3 instance provided
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:9545');
        web3 = new Web3(App.web3Provider);
      }
      return App.initContract();
    },
  
    initContract: function() {
      $.getJSON("Election.json", function(election) {
        // Instantiate a new truffle contract from the artifact
        App.contracts.Election = TruffleContract(election);
        // Connect provider to interact with contract
        App.contracts.Election.setProvider(App.web3Provider);
  
        // App.listenForEvents();
        return App.render();
        
      });
    },
  
    // Listen for events emitted from the contract
    listenForEvents: function() {
      App.contracts.Election.deployed().then(function(instance) {
        // Restart Chrome if you are unable to receive this event
        // This is a known issue with Metamask
        // https://github.com/MetaMask/metamask-extension/issues/2393
        instance.votedEvent({}, {
          fromBlock: 0,
          toBlock: 'latest'
        }).watch(function(error, event) {
          console.log("event triggered", event)
          // Reload when a new vote is recorded
          App.render();
        });
      });
    },
  
    render: function() {
      var electionInstance;
      var loader = $("#loader");
      var content = $("#content");
  
      loader.show();
      content.hide();
      // Load account data
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
          var wacc = account.slice(0,7)+"..."+ account.slice(38,42);
          $("#accountAddress").append(wacc);
        }
        var loginDetail = Cookies.getJSON(account);
          console.log(loginDetail.uname);
  
          $("#test").append(loginDetail.uname);
      });
  
      //get Election name
      App.eTag = Cookies.get("ename");
      console.log(App.eTag);
  
      // Load contract data
      App.contracts.Election.deployed().then(function(instance) {
        electionInstance = instance;
        return electionInstance.candidatesCount();
      }).then(function(candidatesCount) {
            $("#candy").append(candidatesCount.c[0])
          });

    App.contracts.Election.deployed().then(function(instance) {
    electionInstance = instance;
    return electionInstance.voteCount();
    }).then(function(voteCount) {
        $("#voted").append(voteCount.c[0])
        });

    const params = {};
    SDK = new Devless(App.constants);
    SDK.queryData("ElectionVoters", "voters", params, function(response){
        console.log(response.payload.results.length)
        $("#voters").append(response.payload.results.length)
        });
    },
    
  };
  
  
  $(function() {
    $(window).load(function() {
      App.init();
    });
  });
  