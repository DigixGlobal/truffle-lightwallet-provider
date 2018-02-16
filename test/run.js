const path = require('path');
const Web3 = require('web3');

const LightWalletProvider = require('../lib');
const __dirname = ''
const prov = new LightWalletProvider({
  keystore: path.join(__dirname, 'synaphea.json'),
  password: 'test',
  rpcUrl: 'http://54.246.245.242:22000',
  pollingInterval: 5000
});

const web3 = new Web3(prov);

// prov.getAddresses();
web3.eth.getAccounts()

var address = "0xa46ac863228b79887adb90eb16f2743a997fb8c3"
