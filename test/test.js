/* eslint-disable no-extraneous-dependencies, func-names, prefer-arrow-callback */
require('babel-core/register');
require('babel-polyfill');

const assert = require('assert');
const path = require('path');
const a = require('awaiting');
const Web3 = require('web3');

const LightWalletProvider = require('../src');

const web3Default = new Web3();
web3Default.setProvider(new web3Default.providers.HttpProvider('http://localhost:6545/'));

const web3 = new Web3(new LightWalletProvider({
  keystore: path.join(__dirname, 'sigmate-v3-test.json'),
  password: 'test',
  rpcUrl: 'http://localhost:6545/',
  pollingInterval: 5000,
}));

describe('truffle-lightwallet-provider', function () {
  it('lists accounts', async function () {
    const expected = (await a.callback(web3Default.eth.getAccounts)).slice(0, 5);
    assert.deepEqual(await a.callback(web3.eth.getAccounts), expected);
  });
  it('signs messages', async function () {
    // sha3('xyz')
    const address = '0xef64eb65ab7e265fdfcf1ab93a1292fdc15d9761';
    const hash = '0x9dd2c369a187b4e6b9c402f030e50743e619301ea62aa4c0737d4ef7e10a3d49';
    const expected = await a.callback(web3Default.eth.sign, address, hash);
    // const expected = '0x860d6f654853184e1e6d2715902930a5fbc3942d2291c7673fed587ac49f7c733704b6a25df05627b6a5487133b25ad821c2536c1dc77ae7b65550dcea977daa01';
    const actual = await a.callback(web3.eth.sign, address, hash);
    assert.equal(actual, expected);
  });
});
