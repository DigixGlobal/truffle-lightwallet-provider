import ProviderEngine from 'web3-provider-engine';

import RpcSubprovider from './rpcSubprovider';
import LighwalletSubprovider from './lightwalletSubprovider';

export default class LightwalletProvider {
  constructor(opts) {
    this.opts = opts;
  }
  init() {
    if (this.initialized) { return; }
    this.initialized = true;
    this.engine = new ProviderEngine();
    this.engine.addProvider(new LighwalletSubprovider(this.opts));
    this.engine.addProvider(new RpcSubprovider(this.opts));
    this.engine._fetchLatestBlock();
  }
  sendAsync(...args) {
    this.init();
    return this.engine.sendAsync(...args);
  }
}
