App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    voterObject: null,
    hasVoted: false,
    eTag: '',
    constants:{"token": "7652eb1ff815652bf2ef0b15b15a7b03",
    "domain": "http://kori123.herokuapp.com"},
    voterList: null,
  
    init: function() {
        App.eTag = Cookies.get("ename");
        console.log(App.eTag);
        var voterResults = $("#voterResults");
        var params = {where:["electionname," + App.eTag]};
        
        async function getData(){
            await SDK.queryData("ElectionVoters", "voters", params, function(response){
                App.voterList = response.payload.results;
                if(App.voterList != null){  
                    for(var i = 0; i <= App.voterList.length; i++){
                        var voterTemplate = "<tr><td>" + App.voterList[i].id + "</td><td>" + App.voterList[i].name + "</td><td>" + App.voterList[i].studentid + "</td></tr>";
                        voterResults.append(voterTemplate);
                    }
                }
                
            });
        }
        getData();
        
      
        

        var rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer
        const inputElement = document.getElementById("inputf");
        inputElement.addEventListener('change', function(e){
            const file = inputElement.files[0];
            console.log(file);
            const reader = new FileReader();
            reader.onload = function(){
                var data = reader.result;
                if(!rABS) data = new Uint8Array(data);
                var workbook = XLSX.read(data, {type: rABS ? 'binary' : 'array'});

                /* DO SOMETHING WITH workbook HERE */
                var first_sheet_name = workbook.SheetNames[0];

                /* Get worksheet */
                var worksheet = workbook.Sheets[first_sheet_name];
                var voterObj = XLSX.utils.sheet_to_json(worksheet);
                App.voterObject = voterObj;
                console.log(voterObj);
            }
            if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
        }, false);

        

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
        // $.getJSON("Election.json", function(voter) {
        //     // Instantiate a new truffle contract from the artifact
        //     App.contracts.Voter = TruffleContract(voter);
        //     // Connect provider to interact with contract
        //     App.contracts.Voter.setProvider(App.web3Provider);

        //     // App.listenForEvents();
            return App.render();
            
        // });
    },
    listenForEvents: function() {
        App.contracts.Voter.deployed().then(function(instance) {
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
        // Load account data
        web3.eth.getCoinbase(function(err, account) {
          if (err === null) {
            App.account = account;
            var wacc = account.slice(0,7)+"..."+ account.slice(38,42);
            $("#accountAddress").append(wacc);
          }
          var loginDetail = Cookies.getJSON(account);
            console.log(loginDetail);
    
            $("#UserName").append(loginDetail.uname);
        });
    },

      save: function(){
        if(App.voterObject != null){
            SDK = new Devless(App.constants);
            if(App.voterObject != null){
                for(var i = 0; i <= App.voterObject.length; i++){
                    App.voterObject[i].electionname = App.eTag;
                    SDK.addData("ElectionVoters", "voters", App.voterObject[i],  function(response){
                        console.log(response)
                        // window.location.reload();
                    })
                }
            }
            
        }else{
            window.location.reload();
        }
        
        
      }

 
}
  
  $(function() {
    $(window).load(function() {
      App.init();
    });
  });
  