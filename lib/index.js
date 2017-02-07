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
      var _this = this;

      if (this.initialized) {
        return cb();
      }
      this.initialized = true;
      this.opts.serialized = _fs2.default.readFileSync(this.opts.keystore).toString();
      this.opts.ks = _ethLightwallet2.default.keystore.deserialize(this.opts.serialized);
      this.opts.addresses = this.opts.ks.getAddresses().map(function (a) {
        return '0x' + a;
      });
      this.engine = new _web3ProviderEngine2.default();
      this.engine.addProvider(new _rpcSubprovider2.default(this.opts));
      this.engine._fetchLatestBlock();
      var next = function next() {
        // don't attach the lightwallet until we have prefunded
        _this.engine.addProvider(new _lightwalletSubprovider2.default(_this.opts));
        cb();
      };
      if (this.opts.prefund) {
        console.log('Ensuring all lightwallet accounts have ' + this.opts.prefund / 1e18 + ' Ether');
        return (0, _prefund2.default)(this).then(next);
      }
      return next();
    }
  }, {
    key: 'sendAsync',
    value: function sendAsync() {
      var _this2 = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return this.init(function () {
        var _engine;

        return (_engine = _this2.engine).sendAsync.apply(_engine, args);
      });
    }
  }]);

  return LightwalletProvider;
}();

exports.default = LightwalletProvider;
module.exports = exports['default'];