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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FiltersSubprovider = require('web3-provider-engine/subproviders/filters.js');
var HookedSubprovider = require('web3-provider-engine/subproviders/hooked-wallet.js');
var Web3Subprovider = require('web3-provider-engine/subproviders/web3.js');
var Web3 = require('web3');
var Transaction = require('ethereumjs-tx');

var LightwalletProvider = function () {
  function LightwalletProvider(opts) {
    _classCallCheck(this, LightwalletProvider);

    this.opts = opts;
    this.init();
  }

  _createClass(LightwalletProvider, [{
    key: 'init',
    value: function init() {
      var _this = this;

      this.opts.serialized = _fs2.default.readFileSync(this.opts.keystore).toString();
      this.opts.ks = _ethLightwallet2.default.keystore.deserialize(this.opts.serialized);
      this.opts.ks.keyFromPassword(this.opts.password, function (err, pwDerivedKey) {
        if (err) throw err;
        _this.addresses = _this.opts.ks.getAddresses();
      });

      this.engine = new _web3ProviderEngine2.default();
      this.engine.addProvider(new HookedSubprovider({
        getAccounts: function getAccounts(cb) {
          _this.opts.ks.keyFromPassword(_this.opts.password, function (err, pwDerivedKey) {
            if (err) throw err;
            _this.addresses = _this.opts.ks.getAddresses();
            cb(null, _this.addresses);
          });
        }
      }));
      this.engine.addProvider(new FiltersSubprovider());
      this.engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(this.opts.rpcUrl)));
      this.engine.start(); // Required by the provider engine.
    }
  }, {
    key: 'send',
    value: function send() {
      return this.engine.sendAsync.apply(this.engine, arguments);
    }
  }, {
    key: 'sendAsync',
    value: function sendAsync() {
      this.engine.sendAsync.apply(this.engine, arguments);
    }
  }, {
    key: 'getAddress',
    value: function getAddress(idx) {
      console.log('test');
      if (!idx) return this.addresses[0];
      return this.addresses[idx];
    }
  }, {
    key: 'getAddresses',
    value: function getAddresses() {
      return this.addresses;
    }
  }]);

  return LightwalletProvider;
}();

exports.default = LightwalletProvider;
module.exports = exports['default'];