import RPCProvider from 'web3-provider-engine/subproviders/rpc';
import createPayload from 'web3-provider-engine/util/create-payload';
const xhr = process.browser ? require('xhr') : require('request');

export default class RpcSubprovider extends RPCProvider {
  constructor(opts) {
    super(opts);
    this.debug = opts.debug;
  }
  handleRequest(payload, next, end) {
    const targetUrl = this.rpcUrl;
    const method = payload.method;
    const newPayload = createPayload(payload);
    if (this.debug) { console.log('=> request\n', payload); }
    xhr({
      uri: targetUrl,
      method: 'POST',
      // use plain text to prevent multiple reqeusts
      headers: { Accept: 'text/plain', 'Content-Type': 'text/plain' },
      body: JSON.stringify(newPayload),
      rejectUnauthorized: false,
    }, (err, res, body) => {
      if (this.debug) { console.log('<= response\n', JSON.parse(body)); }
      if (err) {
        return end(err);
      }
      if (res.statusCode !== 200) {
        const message = `HTTP Error: ${res.statusCode} on ${method}`;
        return end(message);
      }
      // parse response into raw account
      let data;
      try {
        data = JSON.parse(body);
        if (data.error) {
          return end(data.error);
        }
      } catch (err2) {
        return end(err2);
      }
      return end(null, data.result);
    });
  }
}
