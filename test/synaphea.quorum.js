/* eslint-disable no-extraneous-dependencies, func-names, prefer-arrow-callback */
require('babel-core/register');
require('babel-polyfill');

const assert = require('assert');
const path = require('path');
const a = require('awaiting');
const Web3 = require('web3');

const LightWalletProvider = require('../lib');

const web3 = new Web3(new LightWalletProvider({
  keystore: path.join(__dirname, 'synaphea.json'),
  password: 'test',
  rpcUrl: 'http://54.246.245.242:22000',
  pollingInterval: 5000
}));

describe('truffle-lightwallet-provider', function () {
  it('lists accounts', function () {
    console.log(web3.eth.getAccounts());
    // assert.deepEqual(await a.callback(web3.eth.getAccounts), expected);
  });
  // it('signs messages', async function () {
  //   // sha3('xyz')
  //   const address = '0xef64eb65ab7e265fdfcf1ab93a1292fdc15d9761';
  //   const hash = '0x9dd2c369a187b4e6b9c402f030e50743e619301ea62aa4c0737d4ef7e10a3d49';
  //   const expected = '0x07c84d617380fa6bcebf93f8b144b0fbc452efef893a2a1cd45abe5f56ae31e94c42cd9f597aecd128aff1e48ca834b92ad8df7e44ffba5f00f75bd7bac19f4601';
  //   const fromTestRpc = await a.callback(web3Default.eth.sign, address, hash);
  //   const actual = await a.callback(web3.eth.sign, address, hash);
  //   console.log({ fromTestRpc, actual, expected });
  //   assert.equal(fromTestRpc, expected, 'testrpc is behaving correctly');
  //   assert.equal(actual, expected);
  // });
});
