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

var _ethSigUtil = require('eth-sig-util');

var _ethSigUtil2 = _interopRequireDefault(_ethSigUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function concatSig(rawV, rawR, rawS) {
  var r = _ethereumjsUtil2.default.fromSigned(rawR);
  var s = _ethereumjsUtil2.default.fromSigned(rawS);
  var v = _ethereumjsUtil2.default.bufferToInt(rawV);
  r = _ethereumjsUtil2.default.toUnsigned(r).toString('hex');
  s = _ethereumjsUtil2.default.toUnsigned(s).toString('hex');
  v = _ethereumjsUtil2.default.stripHexPrefix(_ethereumjsUtil2.default.intToHex(v));
  return _ethereumjsUtil2.default.addHexPrefix(r.concat(s, v).toString('hex'));
}

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
      ks.keyFromPassword(password, function (err, privateKey) {
        if (err) return cb(err);
        var msgHash = _ethereumjsUtil2.default.sha3(msgParams.data);
        var sig = _ethereumjsUtil2.default.ecsign(msgHash, privateKey);
        var serialized = _ethereumjsUtil2.default.bufferToHex(concatSig(sig.v, sig.r, sig.s));
        cb(null, serialized);
      });
    };

    _this.signPersonalMessage = function (msgParams, cb) {
      ks.keyFromPassword(password, function (err, privateKey) {
        if (err) return cb(err);
        var serialized = _ethSigUtil2.default.personalSign(privateKey, msgParams);
        cb(null, serialized);
        return null;
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