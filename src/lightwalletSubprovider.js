import HookedWalletEthTx from 'web3-provider-engine/subproviders/hooked-wallet-ethtx';
import EthTx from 'ethereumjs-tx';
import ethUtil from 'ethereumjs-util';

export default class LightwalletSubprovider extends HookedWalletEthTx {
  constructor({ password, ks, addresses }) {
    super({
      getAccounts(cb) {
        return cb(null, addresses.slice(0));
      },
    });

    this.signMessage = function (msgParams, cb) {
      ks.keyFromPassword(password, (err, pwDerivedKey) => {
        if (err) return cb(err);
        const secretKey = new Buffer(ks.exportPrivateKey(msgParams.from, pwDerivedKey), 'hex');
        const dataToSign = msgParams.data;
        const msg = new Buffer(dataToSign.replace('0x', ''), 'hex');
        const msgHash = ethUtil.hashPersonalMessage(msg);
        const sgn = ethUtil.ecsign(msgHash, new Buffer(secretKey));
        const serialized = ethUtil.toRpcSig(sgn.v, sgn.r, sgn.s);
        cb(null, serialized);
      });
    };

    this.signTransaction = function (rawTxData, cb) {
      const txData = { ...rawTxData };
      if (txData.gas !== undefined) txData.gasLimit = txData.gas;
      txData.value = txData.value || '0x00';
      txData.data = ethUtil.addHexPrefix(txData.data);

      ks.keyFromPassword(password, (err, pwDerivedKey) => {
        if (err) { return cb(err); }
        const privateKey = ks.exportPrivateKey(txData.from, pwDerivedKey);
        // console.log('got pk', privateKey);
        const buf = Buffer.from(privateKey, 'hex');
        // return cb(null, buf);
        const tx = new EthTx(txData);
        tx.sign(buf);
        cb(null, `0x${tx.serialize().toString('hex')}`);
        return null;
      });
    };
  }
}
