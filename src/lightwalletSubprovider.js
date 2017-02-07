import HookedWalletEthTx from 'web3-provider-engine/subproviders/hooked-wallet-ethtx';

export default class LightwalletSubprovider extends HookedWalletEthTx {
  constructor({ password, ks, addresses }) {
    super({
      getAccounts(cb) {
        return cb(null, addresses);
      },
      getPrivateKey(address, cb) {
        ks.keyFromPassword(password, (err, pwDerivedKey) => {
          if (err) { return cb(err); }
          const privateKey = ks.exportPrivateKey(address, pwDerivedKey);
          const buf = Buffer.from(privateKey, 'hex');
          return cb(null, buf);
        });
      },
    });
  }
}
