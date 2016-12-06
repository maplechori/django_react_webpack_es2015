'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _reactRelay = require('react-relay');

var _reactRelay2 = _interopRequireDefault(_reactRelay);

var _RelayNetworkLayer2 = require('react-relay/lib/RelayNetworkLayer');

var _RelayNetworkLayer3 = _interopRequireDefault(_RelayNetworkLayer2);

var _RelayStoreData2 = require('react-relay/lib/RelayStoreData');

var _RelayStoreData3 = _interopRequireDefault(_RelayStoreData2);

var _createSubscriptionQuery = require('./createSubscriptionQuery');

var _createSubscriptionQuery2 = _interopRequireDefault(_createSubscriptionQuery);

var _SubscriptionRequest = require('./SubscriptionRequest');

var _SubscriptionRequest2 = _interopRequireDefault(_SubscriptionRequest);

var _updateStoreData = require('./updateStoreData');

var _updateStoreData2 = _interopRequireDefault(_updateStoreData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Override a few Relay classes to use our own network layer proxy that
// supports sendSubscription.

var NetworkLayer = function (_RelayNetworkLayer) {
  _inherits(NetworkLayer, _RelayNetworkLayer);

  function NetworkLayer() {
    _classCallCheck(this, NetworkLayer);

    return _possibleConstructorReturn(this, _RelayNetworkLayer.apply(this, arguments));
  }

  NetworkLayer.prototype.sendSubscription = function sendSubscription(subscriptionRequest) {
    var implementation = this._getImplementation();
    !implementation.sendSubscription ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'NetworkLayer: Network layer implementation does not support ' + 'subscriptions.') : (0, _invariant2.default)(false) : void 0;

    return implementation.sendSubscription(subscriptionRequest);
  };

  return NetworkLayer;
}(_RelayNetworkLayer3.default);

var StoreData = function (_RelayStoreData) {
  _inherits(StoreData, _RelayStoreData);

  function StoreData() {
    _classCallCheck(this, StoreData);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this2 = _possibleConstructorReturn(this, _RelayStoreData.call.apply(_RelayStoreData, [this].concat(args)));

    _this2._networkLayer = new NetworkLayer();
    return _this2;
  }

  return StoreData;
}(_RelayStoreData3.default);

var Environment = function (_Relay$Environment) {
  _inherits(Environment, _Relay$Environment);

  function Environment(storeData) {
    _classCallCheck(this, Environment);

    var _this3 = _possibleConstructorReturn(this, _Relay$Environment.call(this, storeData || new StoreData()));

    _this3.subscribe = _this3.subscribe.bind(_this3);

    _this3._nextClientSubscriptionId = 0;
    return _this3;
  }

  Environment.prototype.subscribe = function subscribe(subscription, observer) {
    var _this4 = this;

    var clientSubscriptionId = this._nextClientSubscriptionId.toString(36);
    ++this._nextClientSubscriptionId;

    subscription.bindEnvironment(this);

    var query = (0, _createSubscriptionQuery2.default)(subscription.getSubscription(), {
      input: _extends({}, subscription.getVariables(), {
        clientSubscriptionId: clientSubscriptionId
      })
    });

    var onPayload = function onPayload(payload) {
      (0, _updateStoreData2.default)(_this4, subscription.getConfigs(), query, payload);
    };

    var requestObserver = void 0;
    if (observer) {
      (function () {
        var definedObserver = observer; // Placate Flow.
        requestObserver = {
          onNext: function onNext(payload) {
            onPayload(payload);
            if (definedObserver.onNext) {
              definedObserver.onNext(payload);
            }
          },
          onError: function onError(error) {
            if (definedObserver.onError) {
              definedObserver.onError(error);
            }
          },
          onCompleted: function onCompleted(value) {
            if (definedObserver.onCompleted) {
              definedObserver.onCompleted(value);
            }
          }
        };
      })();
    } else {
      requestObserver = {
        onNext: onPayload,
        onError: function onError() {},
        onCompleted: function onCompleted() {}
      };
    }

    return this._storeData.getNetworkLayer().sendSubscription(new _SubscriptionRequest2.default(query, requestObserver));
  };

  return Environment;
}(_reactRelay2.default.Environment);

exports.default = Environment;
module.exports = exports['default'];