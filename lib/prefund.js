'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = prefund;

var _createPayload = require('web3-provider-engine/util/create-payload');

var _createPayload2 = _interopRequireDefault(_createPayload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prefund(_ref) {
  var opts = _ref.opts,
      engine = _ref.engine;

  return new Promise(function (resolve) {
    engine._handleAsync((0, _createPayload2.default)({
      method: 'eth_coinbase'
    }), function (err, res) {
      return resolve(res.result);
    });
  }).then(function (coinbase) {
    return Promise.all(opts.addresses.map(function (address) {
      // get the balance
      return new Promise(function (resolve) {
        engine._handleAsync((0, _createPayload2.default)({
          method: 'eth_getBalance',
          params: [address]
        }), function (err, res) {
          resolve(parseInt(res.result, 16));
        });
      })
      // send the tranasaction if we need to
      .then(function (balance) {
        var diff = opts.prefund - balance;
        if (diff === 0) {
          return null;
        }
        console.log('Funding ' + address + ' with ' + diff + ' wei');
        return new Promise(function (resolve) {
          engine._handleAsync((0, _createPayload2.default)({
            method: 'eth_sendTransaction',
            params: [{ from: coinbase, to: address, value: '0x' + diff.toString(16) }]
          }), function (err, res) {
            return resolve(res.result);
          });
        });
      })
      // check the transaction is complete
      .then(function (txHash) {
        if (!txHash) {
          return null;
        }
        var pollTime = 10;
        return new Promise(function (resolve) {
          function poll() {
            engine._handleAsync((0, _createPayload2.default)({
              method: 'eth_getTransactionReceipt',
              params: [txHash]
            }), function (err, res) {
              if (res.result) {
                return resolve();
              }
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
module.exports = exports['default'];