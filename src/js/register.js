App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    hasVoted: false,
  
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
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(App.web3Provider);
      }
      return App.initContract();
    },
  
    initContract: function() {
      $.getJSON("Register.json", function(register) {
        // Instantiate a new truffle contract from the artifact
        App.contracts.Register = TruffleContract(register);
        // Connect provider to interact with contract
        App.contracts.Register.setProvider(App.web3Provider);
  
        // App.listenForEvents();
        return App.render();
        
      });
    },
  
    // Listen for events emitted from the contract
    listenForEvents: function() {
      App.contracts.Register.deployed().then(function(instance) {
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
      var loader = $("#loader");
      var content = $("#content");
  
      loader.show();
      content.hide();
      // Load account data
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
          var wacc = account;
          $("#accountAddress").append(wacc);
        }
      });

      loader.hide();
      content.show();
  
    },  

    registerAdmin: function() {
      var email = $('#email').val();
      var username = $('#username').val();
      var secretToken = $('#secretToken').val();
      
      App.contracts.Register.deployed().then(function(instance){
        return instance.registerAdmin(email, username, secretToken, {from: App.account} );
      }).then(function(results){

        window.location = "login.html";
      }).catch(function(err){
        console.log(err);
      })
      console.log("registered");
      
    },

    loginAdmin: function() {
      var username = $('#username').val();
      var secretToken = $('#secretToken').val();
      
      App.contracts.Register.deployed().then(function(instance){
        return instance.loginAdmin(username, secretToken, {from: App.account} );
      }).then(function(results){
        console.log(results)
        if(results == "true"){
          window.location = "index.html";
          Cookies.set(App.account,{ uname : username , utoken : secretToken}, {expires: 2, path : 'login.html'});
          console.log(Cookies.getJSON(App.account));
        }
      }).catch(function(err){
        console.log(err);
      })
      console.log("logged in");
      
    }
    
  };
  
  
  $(function() {
    $(window).load(function() {
      App.init();
    });
  });
  