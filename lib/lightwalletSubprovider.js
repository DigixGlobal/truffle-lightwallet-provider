'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _hookedWalletEthtx = require('web3-provider-engine/subproviders/hooked-wallet-ethtx');

var _hookedWalletEthtx2 = _interopRequireDefault(_hookedWalletEthtx);

var _ethereumjsTx = require('ethereumjs-tx');

var _ethereumjsTx2 = _interopRequireDefault(_ethereumjsTx);

var _ethereumjsUtil = require('ethereumjs-util');

var _ethereumjsUtil2 = _interopRequireDefault(_ethereumjsUtil);

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

    var _this = _possibleConstructorReturn(this, (LightwalletSubprovider.__proto__ || Object.getPrototypeOf(LightwalletSubprovider)).call(this, {
      getAccounts: function getAccounts(cb) {
        return cb(null, addresses.slice(0));
      }
    }));

    _this.signMessage = function (msgParams, cb) {
      ks.keyFromPassword(password, function (err, pwDerivedKey) {
        if (err) return cb(err);
        var secretKey = new Buffer(ks.exportPrivateKey(msgParams.from, pwDerivedKey), 'hex');
        var dataToSign = msgParams.data;
        var msg = new Buffer(dataToSign.replace('0x', ''), 'hex');
        var msgHash = _ethereumjsUtil2.default.hashPersonalMessage(msg);
        var sgn = _ethereumjsUtil2.default.ecsign(msgHash, new Buffer(secretKey));
        var serialized = _ethereumjsUtil2.default.toRpcSig(sgn.v, sgn.r, sgn.s);
        cb(null, serialized);
      });
    };

    _this.signTransaction = function (rawTxData, cb) {
      var txData = _extends({}, rawTxData);
      if (txData.gas !== undefined) txData.gasLimit = txData.gas;
      txData.value = txData.value || '0x00';
      txData.data = _ethereumjsUtil2.default.addHexPrefix(txData.data);

      ks.keyFromPassword(password, function (err, pwDerivedKey) {
        if (err) {
          return cb(err);
        }
        var privateKey = ks.exportPrivateKey(txData.from, pwDerivedKey);
        // console.log('got pk', privateKey);
        var buf = Buffer.from(privateKey, 'hex');
        // return cb(null, buf);
        var tx = new _ethereumjsTx2.default(txData);
        tx.sign(buf);
        cb(null, '0x' + tx.serialize().toString('hex'));
        return null;
      });
    };
    return _this;
  }

  return LightwalletSubprovider;
}(_hookedWalletEthtx2.default);

exports.default = LightwalletSubprovider;
module.exports = exports['default'];