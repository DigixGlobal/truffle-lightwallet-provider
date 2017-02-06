import ProviderEngine from 'web3-provider-engine';

import RpcSubprovider from './rpcSubprovider';
import LighwalletSubprovider from './lightwalletSubprovider';

export default class LightwalletProvider {
  constructor({ keystore, password, rpcUrl, debug }) {
    this.engine = new ProviderEngine();
    this.engine.addProvider(new LighwalletSubprovider({ keystore, password, debug }));
    this.engine.addProvider(new RpcSubprovider({ rpcUrl, debug }));
    this.engine._fetchLatestBlock();
  }
  sendAsync(...args) {
    return this.engine.sendAsync(...args);
  }
  send(...args) {
    return this.engine.send(...args);
  }
}
