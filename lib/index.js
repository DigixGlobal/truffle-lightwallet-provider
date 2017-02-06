'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _web3ProviderEngine = require('web3-provider-engine');

var _web3ProviderEngine2 = _interopRequireDefault(_web3ProviderEngine);

var _rpcSubprovider = require('./rpcSubprovider');

var _rpcSubprovider2 = _interopRequireDefault(_rpcSubprovider);

var _lightwalletSubprovider = require('./lightwalletSubprovider');

var _lightwalletSubprovider2 = _interopRequireDefault(_lightwalletSubprovider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LightwalletProvider = function () {
  function LightwalletProvider(_ref) {
    var keystore = _ref.keystore,
        password = _ref.password,
        rpcUrl = _ref.rpcUrl,
        debug = _ref.debug;

    _classCallCheck(this, LightwalletProvider);

    this.engine = new _web3ProviderEngine2.default();
    this.engine.addProvider(new _lightwalletSubprovider2.default({ keystore: keystore, password: password, debug: debug }));
    this.engine.addProvider(new _rpcSubprovider2.default({ rpcUrl: rpcUrl, debug: debug }));
    this.engine._fetchLatestBlock();
  }

  _createClass(LightwalletProvider, [{
    key: 'sendAsync',
    value: function sendAsync() {
      var _engine;

      return (_engine = this.engine).sendAsync.apply(_engine, arguments);
    }
  }, {
    key: 'send',
    value: function send() {
      var _engine2;

      return (_engine2 = this.engine).send.apply(_engine2, arguments);
    }
  }]);

  return LightwalletProvider;
}();

exports.default = LightwalletProvider;
module.exports = exports['default'];