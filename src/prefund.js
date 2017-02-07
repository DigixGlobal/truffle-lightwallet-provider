import createPayload from 'web3-provider-engine/util/create-payload';

export default function prefund({ opts, engine }) {
  return new Promise((resolve) => {
    engine._handleAsync(createPayload({
      method: 'eth_coinbase',
    }), (err, res) => resolve(res.result));
  }).then((coinbase) => {
    return Promise.all(opts.addresses.map((address) => {
      // get the balance
      return new Promise((resolve) => {
        engine._handleAsync(createPayload({
          method: 'eth_getBalance',
          params: [address],
        }), (err, res) => {
          resolve(parseInt(res.result, 16));
        });
      })
      // send the tranasaction if we need to
      .then((balance) => {
        const diff = opts.prefund - balance;
        if (diff === 0) { return null; }
        console.log(`Funding ${address} with ${diff} wei`);
        return new Promise((resolve) => {
          engine._handleAsync(createPayload({
            method: 'eth_sendTransaction',
            params: [{ from: coinbase, to: address, value: `0x${diff.toString(16)}` }],
          }), (err, res) => resolve(res.result));
        });
      })
      // check the transaction is complete
      .then((txHash) => {
        if (!txHash) { return null; }
        let pollTime = 10;
        return new Promise((resolve) => {
          function poll() {
            engine._handleAsync(createPayload({
              method: 'eth_getTransactionReceipt',
              params: [txHash],
            }), (err, res) => {
              if (res.result) { return resolve(); }
              // deminishing returns on poll speed
              pollTime = pollTime + 1000 * Math.ceil(Math.random() * 500);
              return setTimeout(poll, pollTime);
            });
          }
          setTimeout(poll, pollTime);
        });
      });
    }));
  });
}
