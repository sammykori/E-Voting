App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    hasVoted: false,
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
          console.log(wacc)
        }
        var loginDetail = Cookies.getJSON("voter");
          console.log(loginDetail[0].electionname);
  
          $("#UserName").append(loginDetail[0].name);
      });
  
      //get Election name
      var vdet = Cookies.getJSON("voter");
      App.eTag = vdet[0].electionname;
  
      // Load contract data
      App.contracts.Election.deployed().then(function(instance) {
        electionInstance = instance;
        return electionInstance.candidatesCount();
      }).then(function(candidatesCount) {
        var candidatesResults = $("#candidatesBallot");
        candidatesResults.empty();
  
      //   var candidatesSelect = $('#candidatesSelect');
      //   candidatesSelect.empty();
  
        for (var i = 1; i <= candidatesCount; i++) {
          electionInstance.candidates(i).then(function(candidate) {
            console.log(candidate[7], candidate[1])
            if(candidate[7] == App.eTag){
              
              var id = candidate[0];
              var name = candidate[1];
              var gender = candidate[3];
              var Pos = candidate[4];
  
              // Render candidate Result
              var candidateTemplate = "<tr><td class='border-top-0'><div class='media'><img src='' alt='' class='thumb-md rounded-circle'><div class='media-body ml-2'><p class='mb-0'>Roy Saunders <span class='badge badge-soft-danger>USA</span></p><span class='font-12 text-muted'>CEO of facebook</span></div></div></td><td class='border-top-0 text-right'><a href='#' class='btn btn-light btn-sm'><i class='far fa-comments mr-2 text-success'></i>Chat</a></td></tr>";
              candidatesResults.append(candidateTemplate);
              loader.hide();
              content.show();
            }
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
  
    castVote: function() {
      var candidateId = $('#candidatesSelect').val();
      App.contracts.Election.deployed().then(function(instance) {
        return instance.vote(candidateId, { from: App.account });
      }).then(function(result) {
        // Wait for votes to update
        $("#content").hide();
        $("#loader").show();
      }).catch(function(err) {
        console.error(err);
      });
    },
  
    addCandidate: function() {
      var eName = App.eTag;
      var name = $('#candidateName').val();
      var gender = $('#gender').val();
      var vPos = $('#vPos').val();
      var Pos = $('#Pos').val();
      var Manifesto = $('#Manifesto').val();
      App.contracts.Election.deployed().then(function(instance){
        return instance.addCandidate(name, gender, vPos, Pos, Manifesto, eName, { from: App.account });
      }).then(function(results){
        window.location.reload();
      }).catch(function(err){
        console.log(err);
      })
    }
    
  };
  
  
  $(function() {
    $(window).load(function() {
      App.init();
    });
  });
  