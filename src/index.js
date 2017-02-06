import ProviderEngine from 'web3-provider-engine';
import FiltersSubprovider from 'web3-provider-engine/subproviders/filters';
import NonceTrackerSubprovider from 'web3-provider-engine/subproviders/nonce-tracker';

import RpcSubprovider from './rpcSubprovider';
import LighwalletSubprovider from './lightwalletSubprovider';

export default class LightwalletProvider {
  constructor({ keystore, password, rpcUrl, debug }) {
    this.engine = new ProviderEngine();
    this.engine.addProvider(new LighwalletSubprovider({ keystore, password, debug }));
    this.engine.addProvider(new RpcSubprovider({ rpcUrl, debug }));
    this.engine.addProvider(new FiltersSubprovider());
    this.engine.addProvider(new NonceTrackerSubprovider());
    this.engine.start();
  }
  sendAsync(...args) {
    return this.engine.sendAsync(...args);
  }
  send(...args) {
    return this.engine.send(...args);
  }
}
