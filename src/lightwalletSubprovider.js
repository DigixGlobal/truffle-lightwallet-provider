import fs from 'fs';
import HookedWalletEthTx from 'web3-provider-engine/subproviders/hooked-wallet-ethtx';
import Lightwallet from 'eth-lightwallet';

export default class LightwalletSubprovider extends HookedWalletEthTx {
  constructor(opts) {
    const serialized = fs.readFileSync(opts.keystore).toString();
    const keystore = Lightwallet.keystore.deserialize(serialized);
    const addresses = keystore.getAddresses().map(a => `0x${a}`);
    super({
      getAccounts(cb) {
        return cb(null, addresses);
      },
      getPrivateKey(address, cb) {
        keystore.keyFromPassword(opts.password, (err, pwDerivedKey) => {
          if (err) { return cb(err); }
          const privateKey = keystore.exportPrivateKey(address, pwDerivedKey);
          const buf = Buffer.from(privateKey, 'hex');
          return cb(null, buf);
        });
      },
    });
  }
}
