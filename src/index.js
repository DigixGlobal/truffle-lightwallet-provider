import fs from 'fs';
import Lightwallet from 'eth-lightwallet';
import ProviderEngine from 'web3-provider-engine';

import RpcSubprovider from './rpcSubprovider';
import LighwalletSubprovider from './lightwalletSubprovider';
import prefund from './prefund';

export default class LightwalletProvider {
  constructor(opts) {
    this.opts = opts;
  }
  init(cb) {
    if (this.initialized) { return cb(); }
    this.initialized = true;
    this.opts.serialized = fs.readFileSync(this.opts.keystore).toString();
    this.opts.ks = Lightwallet.keystore.deserialize(this.opts.serialized);
    this.opts.addresses = this.opts.ks.getAddresses().map(a => `0x${a}`);
    this.engine = new ProviderEngine();
    this.engine.addProvider(new RpcSubprovider(this.opts));
    this.engine._fetchLatestBlock();
    const next = () => {
      // don't attach the lightwallet until we have prefunded
      this.engine.addProvider(new LighwalletSubprovider(this.opts));
      cb();
    };
    if (this.opts.prefund) {
      console.log(`Ensuring all lightwallet accounts have ${this.opts.prefund / 1e18} Ether`);
      return prefund(this).then(next);
    }
    return next();
  }
  sendAsync(...args) {
    return this.init(() => {
      return this.engine.sendAsync(...args);
    });
  }
}
