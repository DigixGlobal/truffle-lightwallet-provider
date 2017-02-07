'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hookedWalletEthtx = require('web3-provider-engine/subproviders/hooked-wallet-ethtx');

var _hookedWalletEthtx2 = _interopRequireDefault(_hookedWalletEthtx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LightwalletSubprovider = function (_HookedWalletEthTx) {
  _inherits(LightwalletSubprovider, _HookedWalletEthTx);

  function LightwalletSubprovider(_ref) {
    var password = _ref.password,
        ks = _ref.ks,
        addresses = _ref.addresses;

    _classCallCheck(this, LightwalletSubprovider);

    return _possibleConstructorReturn(this, (LightwalletSubprovider.__proto__ || Object.getPrototypeOf(LightwalletSubprovider)).call(this, {
      getAccounts: function getAccounts(cb) {
        return cb(null, addresses);
      },
      getPrivateKey: function getPrivateKey(address, cb) {
        ks.keyFromPassword(password, function (err, pwDerivedKey) {
          if (err) {
            return cb(err);
          }
          var privateKey = ks.exportPrivateKey(address, pwDerivedKey);
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