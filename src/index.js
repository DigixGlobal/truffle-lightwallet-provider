import fs from 'fs';
import Lightwallet from 'eth-lightwallet';
import ProviderEngine from 'web3-provider-engine';

import NonceSubprovider from 'web3-provider-engine/subproviders/nonce-tracker';
import FilterProvider from 'web3-provider-engine/subproviders/filters';
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
    // this.opts.addresses = this.opts.ks.getAddresses().map(a => `0x${a}`);
    this.opts.addresses = this.opts.ks.getAddresses().map(a => a); // removed prefix 0x
    // pass opts
    const { pollingInterval } = this.opts;
    this.engine = new ProviderEngine({ pollingInterval });
    this.engine.addProvider(new FilterProvider());
    this.engine.addProvider(new NonceSubprovider());
    this.engine.addProvider(new LighwalletSubprovider(this.opts));
    this.engine.addProvider(new RpcSubprovider(this.opts));
    // this.engine._fetchLatestBlock();
    this.engine.start();
    if (this.opts.prefund) {
      console.log(`Ensuring all lightwallet accounts have ${this.opts.prefund / 1e18} Ether`);
      return prefund(this.opts).then(cb);
    }
    return cb();
  }
  send() {
    throw new Error('`send` is not supported; use `sendAsync`');
  }
  sendAsync(...args) {
    return this.init(() => {
      return this.engine.sendAsync(...args);
    });
  }
}
