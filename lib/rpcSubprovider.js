'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rpc = require('web3-provider-engine/subproviders/rpc');

var _rpc2 = _interopRequireDefault(_rpc);

var _createPayload = require('web3-provider-engine/util/create-payload');

var _createPayload2 = _interopRequireDefault(_createPayload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var xhr = process.browser ? require('xhr') : require('request');

var RpcSubprovider = function (_RPCProvider) {
  _inherits(RpcSubprovider, _RPCProvider);

  function RpcSubprovider(opts) {
    _classCallCheck(this, RpcSubprovider);

    var _this = _possibleConstructorReturn(this, (RpcSubprovider.__proto__ || Object.getPrototypeOf(RpcSubprovider)).call(this, opts));

    _this.debug = opts.debug;
    return _this;
  }

  _createClass(RpcSubprovider, [{
    key: 'handleRequest',
    value: function handleRequest(payload, next, end) {
      var _this2 = this;

      var targetUrl = this.rpcUrl;
      var method = payload.method;
      var newPayload = (0, _createPayload2.default)(payload);
      if (this.debug) {
        console.log('=> request\n', _extends({}, payload, { targetUrl: targetUrl }));
      }
      xhr({
        uri: targetUrl,
        method: 'POST',
        // use plain text to prevent multiple reqeusts
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayload),
        rejectUnauthorized: false
      }, function (err, res, body) {
        if (_this2.debug) {
          console.log('<= response\n', JSON.parse(body));
        }
        _this2.firstRequest = false;
        if (err) {
          console.log(err);
          return end(err);
        }
        if (res.statusCode !== 200) {
          var message = 'HTTP Error: ' + res.statusCode + ' on ' + method;
          console.log(message);
          return end(message);
        }
        // parse response into raw account
        var data = void 0;
        try {
          data = JSON.parse(body);
          if (data.error) {
            console.log(data);
            return end(data.error);
          }
        } catch (err2) {
          console.log(err2);
          return end(err2);
        }
        return end(null, data.result);
      });
    }
  }]);

  return RpcSubprovider;
}(_rpc2.default);

exports.default = RpcSubprovider;
module.exports = exports['default'];