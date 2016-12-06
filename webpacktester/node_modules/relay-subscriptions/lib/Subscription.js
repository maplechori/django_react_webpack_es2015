'use strict';

exports.__esModule = true;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _reactRelay = require('react-relay');

var _reactRelay2 = _interopRequireDefault(_reactRelay);

var _RelayMetaRoute = require('react-relay/lib/RelayMetaRoute');

var _RelayMetaRoute2 = _interopRequireDefault(_RelayMetaRoute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Subscription = function () {
  function Subscription(props) {
    _classCallCheck(this, Subscription);

    this._didShowFakeDataWarning = false;
    this._didValidateConfig = false;
    this._unresolvedProps = props;
  }

  Subscription.getFragment = function getFragment(fragmentName, variableMapping) {
    return _reactRelay2.default.Mutation.getFragment.call(this, fragmentName, variableMapping);
  };

  Subscription.prototype.bindEnvironment = function bindEnvironment(environment) {
    _reactRelay2.default.Mutation.prototype.bindEnvironment.call(this, environment);
  };

  Subscription.prototype.getSubscription = function getSubscription() {
    !false ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '%s: Expected abstract method `getSubscription` to be implemented', this.constructor.name) : (0, _invariant2.default)(false) : void 0;
  };

  Subscription.prototype.getConfigs = function getConfigs() {
    !false ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '%s: Expected abstract method `getConfigs` to be implemented', this.constructor.name) : (0, _invariant2.default)(false) : void 0;
  };

  Subscription.prototype.getVariables = function getVariables() {
    !false ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '%s: Expected abstract method `getVariables` to be implemented', this.constructor.name) : (0, _invariant2.default)(false) : void 0;
  };

  Subscription.prototype._resolveProps = function _resolveProps() {
    _reactRelay2.default.Mutation.prototype._resolveProps.call(this);
  };

  return Subscription;
}();

exports.default = Subscription;
module.exports = exports['default'];