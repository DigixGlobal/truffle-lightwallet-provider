'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _hookedWalletEthtx = require('web3-provider-engine/subproviders/hooked-wallet-ethtx');

var _hookedWalletEthtx2 = _interopRequireDefault(_hookedWalletEthtx);

var _ethLightwallet = require('eth-lightwallet');

var _ethLightwallet2 = _interopRequireDefault(_ethLightwallet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LightwalletSubprovider = function (_HookedWalletEthTx) {
  _inherits(LightwalletSubprovider, _HookedWalletEthTx);

  function LightwalletSubprovider(opts) {
    _classCallCheck(this, LightwalletSubprovider);

    var serialized = _fs2.default.readFileSync(opts.keystore).toString();
    var keystore = _ethLightwallet2.default.keystore.deserialize(serialized);
    var addresses = keystore.getAddresses().map(function (a) {
      return '0x' + a;
    });
    return _possibleConstructorReturn(this, (LightwalletSubprovider.__proto__ || Object.getPrototypeOf(LightwalletSubprovider)).call(this, {
      getAccounts: function getAccounts(cb) {
        return cb(null, addresses);
      },
      getPrivateKey: function getPrivateKey(address, cb) {
        keystore.keyFromPassword(opts.password, function (err, pwDerivedKey) {
          if (err) {
            return cb(err);
          }
          var privateKey = keystore.exportPrivateKey(address, pwDerivedKey);
          var buf = Buffer.from(privateKey, 'hex');
          return cb(null, buf);
        });
      }
    }));
  }

  return LightwalletSubprovider;
}(_hookedWalletEthtx2.default);

exports.default = LightwalletSubprovider;
module.exports = exports['default'];