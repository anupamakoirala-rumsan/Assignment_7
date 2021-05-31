App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    //  //Is there an injected web3 instance?
    // if (typeof web3 !== "undefined") {
    //   App.web3Provider = web3.currentProvider;
    //   // App.networkId = ethereum.networkVersion;
    //   // console.log(typeof(App.networkId));
    //   console.log(App.web3Provider);
    //   // console.log(App.networkId);
    // } else {
    //   // If no injected web3 instance is detected, fall back to Ganache
    //   // Only useful in a development environment
    //   App.networkId = 5777;
    //   App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
      
    // }
    // web3 = new Web3(App.web3Provider);
    if (window.etherum){
      App.web3Provider = window.etherum;
      try{
        await window.etherum.enable();

      }catch(error){
        console.error("User denied account access");
      }
    }
    else if (window.web3){
      App.web3Provider = window.web3.currentProvider;
    }
    else {
      App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
    }
    web3 = new Web3(App.web3Provider);

    

  
   console.log(typeof(web3));
   console.log(web3)
    return App.initContract();
  },

  initContract: function() {
    
  $.getJSON('Adoption.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with @truffle/contract
    var AdoptionArtifact = data;
    App.contracts.Adoption = TruffleContract(AdoptionArtifact);
  
    // Set the provider for our contract
    App.contracts.Adoption.setProvider(App.web3Provider);
  
    // Use our contract to retrieve and mark the adopted pets
    return App.markAdopted();
  });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  // getAccount: async function(){
  //   var accounts = await web3.eth.getAccounts();
  //   console.log(typeof(accounts));
  //   return accounts[0];
    
    

  // },

  markAdopted:  function() {
    
    var adoptionInstance;

App.contracts.Adoption.deployed().then(function(instance) {
  adoptionInstance = instance;
 console.log(typeof(adoptionInstance));
  return adoptionInstance.getadpoters.call();
}).then(function(adopters) {
  for (i = 0; i < adopters.length; i++) {
    if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
      $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
    }
  }
}).catch(function(err) {
  console.log(err.message);
});
  },


  handleAdopt:  async function(event) {
    event.preventDefault();
    // let instance = App.contracts.Adoption.deployed();
    var petId = parseInt($(event.target).data('id'));
    // let accounts = await web3.eth.getAccounts();
    // let account = accounts[0];
    //  let account = await App.getAccount();
   

 
  var adoptionInstance;

web3.eth.getAccounts(function(error, accounts) {
  if (error) {
    console.log(error);
  }
 console.log(accounts);
  var account = accounts[0];

  App.contracts.Adoption.deployed().then(function(instance) {
    adoptionInstance = instance;

    // Execute adopt as a transaction by sending account
    return adoptionInstance.adpot(petId, {from: account});
  }).then(function(result) {
    return App.markAdopted();
  }).catch(function(err) {
    console.log(err.message);
  });
});

},};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
