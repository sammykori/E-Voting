App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    hasVoted: false,
    uemail: "",
    utoken: "",
  
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
      $.getJSON("Elect.json", function(elect) {
        // Instantiate a new truffle contract from the artifact
        App.contracts.Elect = TruffleContract(elect);
        // Connect provider to interact with contract
        App.contracts.Elect.setProvider(App.web3Provider);
  
        // App.listenForEvents();
        return App.render();
        
      });
    },
  
    // Listen for events emitted from the contract
    listenForEvents: function() {
      App.contracts.Elect.deployed().then(function(instance) {
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
      var electInstance;
      var loader = $("#loader");
      var content = $("#content");
      
      // loader.show();
      // content.hide();
      // Load account data
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
          var wacc = account.slice(0,7)+"..."+ account.slice(38,42);
          $("#accountAddress").append(wacc);
        }
        //Get login details from cookie
        var loginDetail = Cookies.getJSON(account);
        console.log(loginDetail);

        $("#UserName").append(loginDetail.uname);
      });

        

      // Load contract data
      App.contracts.Elect.deployed().then(function(instance) {
        electInstance = instance;
        return electInstance.electionsCount();
      }).then(function(electionsCount) {
        var electionResults = $("#electionCard");
        electionResults.empty();
  
      //   var candidatesSelect = $('#candidatesSelect');
      //   candidatesSelect.empty();
      var electionColumns;
        for (var i = 1; i <= electionsCount; i++) {
          electInstance.elections(i).then(function(election) {
            
            if(election[4] == App.account){
              var name = election[1];
              var desc = election[2];
              
    
              // Render candidate Result
              
              var electionTemplate = "<div class='card'><img class='card-img-top img-fluid' src='./images/small/img-1.jpg' alt='Card image cap'><div class='card-body'><h4 class='card-title font-20 mt-0' id='eTag'>" + name + "</h4><p class='font-13 text-muted'>"+ desc +"</p><button class='btn btn-primary waves-effect waves-light' onclick='App.selectElection()'>Select</button></div></div>";

              electionColumns = "<div class='col-lg-6 col-xl-3' >"+ electionTemplate +"</div>";
              
              electionResults.append(electionColumns);
            }
            loader.hide();
            content.show();
            // Render candidate ballot option
          //   var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
          //   candidatesSelect.append(candidateOption);
          });
        }
        // return electionInstance.voters(App.account);
      });
      // .then(function(hasVoted) {
      //   // Do not allow a user to vote
      //   if(hasVoted) {
      //     $('form').hide();
      //   }
      //   loader.hide();
      //   content.show();
      // }).catch(function(error) {
      //   console.warn(error);
      // });
    },
  
    createElection: function() {
      var name = $('#name').val();
      var desc = $('#desc').val();
      var inst = $('#inst').val();
      var sDate = $('#sDate').val();
      var eDate = $('#eDate').val();
      var sTime = $('#sTime').val();
      var eTime = $('#eTime').val();
      App.contracts.Elect.deployed().then(function(instance){
        return instance.createElection(name, desc, inst, sDate, eDate, sTime, eTime, { from: App.account });
      }).then(function(results){
        window.location = "index.html";
      }).catch(function(err){
        console.log(err);
      })
    },

    selectElection: function(){
      var eTag = $('#eTag').html();
      console.log(eTag);
      Cookies.set("ename", eTag, {expires: 2});
      window.location = "dashboard.html"
    }
    
  };
  
  
  $(function() {
    $(window).load(function() {
      App.init();
    });
  });
  