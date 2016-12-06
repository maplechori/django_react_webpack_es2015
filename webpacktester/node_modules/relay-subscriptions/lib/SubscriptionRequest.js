'use strict';

exports.__esModule = true;

var _printRelayQuery = require('react-relay/lib/printRelayQuery');

var _printRelayQuery2 = _interopRequireDefault(_printRelayQuery);

var _RelayQuery = require('react-relay/lib/RelayQuery');

var _RelayQuery2 = _interopRequireDefault(_RelayQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SubscriptionRequest = function () {
  function SubscriptionRequest(subscription, observer) {
    _classCallCheck(this, SubscriptionRequest);

    this._printedQuery = null;
    this._subscription = subscription;
    this._observer = observer;
  }

  SubscriptionRequest.prototype.getDebugName = function getDebugName() {
    return this._subscription.getName();
  };

  SubscriptionRequest.prototype.getVariables = function getVariables() {
    return this._getPrintedQuery().variables;
  };

  SubscriptionRequest.prototype.getQueryString = function getQueryString() {
    return this._getPrintedQuery().text;
  };

  SubscriptionRequest.prototype._getPrintedQuery = function _getPrintedQuery() {
    if (!this._printedQuery) {
      this._printedQuery = (0, _printRelayQuery2.default)(this._subscription);
    }

    return this._printedQuery;
  };

  SubscriptionRequest.prototype.getClientSubscriptionId = function getClientSubscriptionId() {
    return this._subscription.getVariables().input.clientSubscriptionId;
  };

  SubscriptionRequest.prototype.onNext = function onNext(payload) {
    this._observer.onNext(payload);
  };

  SubscriptionRequest.prototype.onError = function onError(error) {
    this._observer.onError(error);
  };

  SubscriptionRequest.prototype.onCompleted = function onCompleted(value) {
    this._observer.onCompleted(value);
  };

  return SubscriptionRequest;
}();

exports.default = SubscriptionRequest;
module.exports = exports['default'];