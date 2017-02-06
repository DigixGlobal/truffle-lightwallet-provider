# Truffle Lightwallet Provider

RPC Provider using Eth-Lightwallet & Web3-Provider-Engine.

Inspired by https://github.com/trufflesuite/truffle-hdwallet-provider.

## Usage

```javascript
// truffle.js
const LightWalletProvider = require('@digix/truffle-lightwallet-provider');

module.exports = {
  networks: {
    ropsten: {
      provider: new LightWalletProvider({
        keystore: '/path/to/my/serialized-eth-lightwallet.json',
        password: 'mySecretDecryptionKey',
        rpcUrl: 'http://ropsten.infura.io/',
        debug: true,
      }),
      network_id: '3',
    },
  },
};
```

## Sigmate

Check out https://github.com/DigixGlobal/sigmate for a simple eth-lightwallet keystore manager.
