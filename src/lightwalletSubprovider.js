import HookedWalletEthTx from 'web3-provider-engine/subproviders/hooked-wallet-ethtx';
import EthTx from 'ethereumjs-tx';
import ethUtil from 'ethereumjs-util';

export default class LightwalletSubprovider extends HookedWalletEthTx {
  constructor({ password, ks, addresses }) {
    super({
      getAccounts(cb) {
        // console.log(...addresses);
        return cb(null, addresses.slice(0));
      },
    });
    this.signTransaction = function(txData, cb) {
      if (txData.gas !== undefined) txData.gasLimit = txData.gas
      txData.value = txData.value || '0x00'
      txData.data = ethUtil.addHexPrefix(txData.data)

      ks.keyFromPassword(password, (err, pwDerivedKey) => {
        if (err) { return cb(err); }
        const privateKey = ks.exportPrivateKey(txData.from, pwDerivedKey);
        // console.log('got pk', privateKey);
        const buf = Buffer.from(privateKey, 'hex');
        // return cb(null, buf);
        var tx = new EthTx(txData)
        tx.sign(buf)
        cb(null, '0x' + tx.serialize().toString('hex'))
      });
    }
  }
}
