'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ethLightwallet = require('eth-lightwallet');

var _ethLightwallet2 = _interopRequireDefault(_ethLightwallet);

var _web3ProviderEngine = require('web3-provider-engine');

var _web3ProviderEngine2 = _interopRequireDefault(_web3ProviderEngine);

var _nonceTracker = require('web3-provider-engine/subproviders/nonce-tracker');

var _nonceTracker2 = _interopRequireDefault(_nonceTracker);

var _filters = require('web3-provider-engine/subproviders/filters');

var _filters2 = _interopRequireDefault(_filters);

var _rpcSubprovider = require('./rpcSubprovider');

var _rpcSubprovider2 = _interopRequireDefault(_rpcSubprovider);

var _lightwalletSubprovider = require('./lightwalletSubprovider');

var _lightwalletSubprovider2 = _interopRequireDefault(_lightwalletSubprovider);

var _prefund = require('./prefund');

var _prefund2 = _interopRequireDefault(_prefund);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LightwalletProvider = function () {
  function LightwalletProvider(opts) {
    _classCallCheck(this, LightwalletProvider);

    this.opts = opts;
  }

  _createClass(LightwalletProvider, [{
    key: 'init',
    value: function init(cb) {
      if (this.initialized) {
        return cb();
      }
      this.initialized = true;
      this.opts.serialized = _fs2.default.readFileSync(this.opts.keystore).toString();
      this.opts.ks = _ethLightwallet2.default.keystore.deserialize(this.opts.serialized);
      // this.opts.addresses = this.opts.ks.getAddresses().map(a => `0x${a}`);
      this.opts.addresses = this.opts.ks.getAddresses().map(function (a) {
        return a;
      }); // removed prefix 0x
      // pass opts
      var pollingInterval = this.opts.pollingInterval;

      this.engine = new _web3ProviderEngine2.default({ pollingInterval: pollingInterval });
      this.engine.addProvider(new _filters2.default());
      this.engine.addProvider(new _nonceTracker2.default());
      this.engine.addProvider(new _lightwalletSubprovider2.default(this.opts));
      this.engine.addProvider(new _rpcSubprovider2.default(this.opts));
      // this.engine._fetchLatestBlock();
      this.engine.start();
      if (this.opts.prefund) {
        console.log('Ensuring all lightwallet accounts have ' + this.opts.prefund / 1e18 + ' Ether');
        return (0, _prefund2.default)(this.opts).then(cb);
      }
      return cb();
    }
  }, {
    key: 'send',
    value: function send() {
      throw new Error('`send` is not supported; use `sendAsync`');
    }
  }, {
    key: 'sendAsync',
    value: function sendAsync() {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return this.init(function () {
        var _engine;

        return (_engine = _this.engine).sendAsync.apply(_engine, args);
      });
    }
  }]);

  return LightwalletProvider;
}();

exports.default = LightwalletProvider;
module.exports = exports['default'];