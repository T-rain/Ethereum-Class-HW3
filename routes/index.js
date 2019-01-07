const express = require('express');
const router = express.Router();

const Web3 = require('web3');

const web3 = new Web3('http://localhost:8545');

const contract = require('../contract/Bank.json');

/* GET home page. */
// router.get('/', async function (req, res, next) {
//   res.render('index')
// });

//get accounts
router.get('/accounts', async function (req, res, next) {
  let accounts = await web3.eth.getAccounts()
  res.send(accounts)
});

//login
router.get('/balance', async function (req, res, next) {
  let ethBalance = await web3.eth.getBalance(req.query.account)
  res.send({
    ethBalance: ethBalance
  })
});

//balance
router.get('/allBalance', async function (req, res, next) {
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.query.address;
  let ethBalance = await web3.eth.getBalance(req.query.account)
  let bankBalance = await bank.methods.getBankBalance().call({ from: req.query.account })
  let coinBalance = await bank.methods.getCoinBalance().call({ from: req.query.account })
  res.send({
    ethBalance: ethBalance,
    bankBalance: bankBalance,
    coinBalance: coinBalance
  })
});

//contract
router.get('/contract', function (req, res, next) {
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.query.address;
  res.send({
    bank: bank
  })
});

//unlock account
router.post('/unlock', function (req, res, next) {
  web3.eth.personal.unlockAccount(req.body.account, req.body.password, 60)
    .then(function (result) {
      res.send('true')
    })
    .catch(function (err) {
      res.send('false')
    })
});

//deploy bank contract
router.post('/deploy', function (req, res, next) {
  let bank = new web3.eth.Contract(contract.abi);
  bank.deploy({
    data: contract.bytecode
  })
    .send({
      from: req.body.account,
      gas: 3400000
    })
    .on('receipt', function (receipt) {
      res.send(receipt);
    })
    .on('error', function (error) {
      res.send(error.toString());
    })
});

//deposit ether
router.post('/deposit', function (req, res, next) {
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.body.address;
  bank.methods.deposit().send({
    from: req.body.account,
    gas: 3400000,
    value: web3.utils.toWei(req.body.value, 'ether')
  })
    .on('receipt', function (receipt) {
      res.send(receipt);
    })
    .on('error', function (error) {
      res.send(error.toString());
    })
});

//withdraw ether
router.post('/withdraw', function (req, res, next) {
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.body.address;
  bank.methods.withdraw(req.body.value).send({
    from: req.body.account,
    gas: 3400000
  })
    .on('receipt', function (receipt) {
      res.send(receipt);
    })
    .on('error', function (error) {
      res.send(error.toString());
    })
});

//transfer ether
router.post('/transfer', function (req, res, next) {
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.body.address;
  bank.methods.transfer(req.body.to, req.body.value).send({
    from: req.body.account,
    gas: 3400000
  })
    .on('receipt', function (receipt) {
      res.send(receipt);
    })
    .on('error', function (error) {
      res.send(error.toString());
    })
});

//kill contract
router.post('/kill', function (req, res, next) {
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.body.address;
  bank.methods.kill().send({
    from: req.body.account,
    gas: 3400000
  })
    .on('receipt', function (receipt) {
      res.send(receipt);
    })
    .on('error', function (error) {
      res.send(error.toString());
    })
});

//owner
router.get('/owner', async function (req, res, next) {
  // TODO
  // ...
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.query.address;
  let coinBalance = await bank.methods.getOwner().call()
  res.send(coinBalance);
});

//mint Coin
router.post('/mintCoin',async function (req, res, next) {
  // TODO
  // ...
  try {
    const {address,account,value} = req.body;
    const bank = new web3.eth.Contract(contract.abi);
    bank.options.address = address;

    const newContractInstance = await bank.methods.mint(value).send({
      from: account,
      gas: 3400000
    })
    res.send(newContractInstance);

  } catch (error) {
    console.error(error);
    res.status(500).send("mint nccu coin error");
  }
});

//buy Coin
router.post('/buyCoin',async function (req, res, next) {
  // TODO
  // ...
  try {
    const {address,account,value} = req.body;
    const bank = new web3.eth.Contract(contract.abi);
    bank.options.address = address;
    const newContractInstance = await bank.methods.buy(value).send({
      from: account,
      gas: 3400000
    })
    res.send(newContractInstance);

  } catch (error) {
    console.error(error);
    res.status(500).send("buy nccu coin error");
  }
});

//transfer Coin
router.post('/transferCoin',async function (req, res, next) {
  // TODO
  // ...
  try {
    const {address,account,transferAccount,value} = req.body;
    console.log({address,account,transferAccount,value});
    
    const bank = new web3.eth.Contract(contract.abi);
    bank.options.address = address;
    const newContractInstance = await bank.methods.transferCoin(transferAccount,value).send({
      from: account,
      gas: 3400000
    })
    res.send(newContractInstance);

  } catch (error) {
    console.error(error);
    res.status(500).send("transfer nccu coin error");
  }
});

//transfer Owner
router.post('/transferOwner',async function (req, res, next) {
  // TODO
  // ...
  try {
    const {address,account,transferOwnerAccount} = req.body;
    const bank = new web3.eth.Contract(contract.abi);
    bank.options.address = address;

    const newContractInstance = await bank.methods.transferOwner(transferOwnerAccount).send({
      from: account,
      gas: 3400000
    })

    res.send(newContractInstance);

  } catch (error) {
    console.error(error);
    res.status(500).send("transfer owner error");
  }
});

//transfer ether to other address
router.post('/transferTo', async function (req, res, next) {
  // TODO
  // ...
  try {
    const {account,transferRealEthAccount,transferRealEthValue} = req.body;
    const receipt = await web3.eth.sendTransaction({
      from: account,
      to: transferRealEthAccount,
      value: web3.utils.toWei(transferRealEthValue, "ether")
    })
    res.send(receipt);

  } catch (error) {
    console.error(error);
    res.status(500).send("transferTo (RealEth) error");
  }
});

module.exports = router;
