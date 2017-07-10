import HookedWalletEthTx from 'web3-provider-engine/subproviders/hooked-wallet-ethtx';
import EthTx from 'ethereumjs-tx';
import ethUtil from 'ethereumjs-util';
import sigUtil from 'eth-sig-util';


function concatSig(rawV, rawR, rawS) {
  let r = ethUtil.fromSigned(rawR);
  let s = ethUtil.fromSigned(rawS);
  let v = ethUtil.bufferToInt(rawV);
  r = ethUtil.toUnsigned(r).toString('hex');
  s = ethUtil.toUnsigned(s).toString('hex');
  v = ethUtil.stripHexPrefix(ethUtil.intToHex(v));
  return ethUtil.addHexPrefix(r.concat(s, v).toString('hex'));
}


export default class LightwalletSubprovider extends HookedWalletEthTx {
  constructor({ password, ks, addresses }) {
    super({
      getAccounts(cb) {
        return cb(null, addresses.slice(0));
      },
    });

    this.signMessage = function (msgParams, cb) {
      ks.keyFromPassword(password, (err, privateKey) => {
        if (err) return cb(err);
        const msgHash = ethUtil.sha3(msgParams.data);
        const sig = ethUtil.ecsign(msgHash, privateKey);
        const serialized = ethUtil.bufferToHex(concatSig(sig.v, sig.r, sig.s));
        cb(null, serialized);
      });
    };

    this.signPersonalMessage = function (msgParams, cb) {
      ks.keyFromPassword(password, (err, privateKey) => {
        if (err) return cb(err);
        const serialized = sigUtil.personalSign(privateKey, msgParams);
        cb(null, serialized);
        return null;
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
