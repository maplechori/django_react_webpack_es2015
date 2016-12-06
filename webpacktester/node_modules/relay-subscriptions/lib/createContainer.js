'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createContainer;

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRelay = require('react-relay');

var _reactRelay2 = _interopRequireDefault(_reactRelay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function disposeActiveSubscription(activeSubscription) {
  if (!activeSubscription) {
    return;
  }

  activeSubscription.disposable.dispose();
}

function subscribe(Component, subscriptionsSpec) {
  var _class, _temp;

  var componentName = Component.displayName || Component.name || 'Component';

  return _temp = _class = function (_React$Component) {
    _inherits(Subscribe, _React$Component);

    function Subscribe(props, context) {
      _classCallCheck(this, Subscribe);

      var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

      _this.relayProp = _this.makeRelayProp(props);
      _this.activeSubscriptions = [];
      return _this;
    }

    Subscribe.prototype.componentDidMount = function componentDidMount() {
      var _this2 = this;

      if (subscriptionsSpec) {
        subscriptionsSpec.forEach(function (createSubscription) {
          _this2.activeSubscriptions.push(_this2.makeActiveSubscription(createSubscription(_this2.props)));
        });
      }
    };

    Subscribe.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      var _this3 = this;

      if (nextProps.relay !== this.props.relay) {
        this.relayProp = this.makeRelayProp(nextProps);
      }

      if (subscriptionsSpec) {
        subscriptionsSpec.forEach(function (createSubscription, index) {
          var activeSubscription = _this3.activeSubscriptions[index];
          var nextSubscription = createSubscription(nextProps);

          if (!_this3.areSubscriptionsEqual(activeSubscription, nextSubscription)) {
            disposeActiveSubscription(activeSubscription);
            _this3.activeSubscriptions[index] = _this3.makeActiveSubscription(nextSubscription);
          }
        });
      }
    };

    Subscribe.prototype.componentWillUnmount = function componentWillUnmount() {
      if (subscriptionsSpec) {
        this.activeSubscriptions.forEach(disposeActiveSubscription);
      }
    };

    Subscribe.prototype.makeRelayProp = function makeRelayProp(props) {
      return _extends({}, props.relay, {
        subscribe: this.context.relay.subscribe
      });
    };

    Subscribe.prototype.makeActiveSubscription = function makeActiveSubscription(subscription) {
      if (!subscription) {
        return null;
      }

      return {
        subscription: subscription,
        disposable: this.context.relay.subscribe(subscription)
      };
    };

    Subscribe.prototype.areSubscriptionsEqual = function areSubscriptionsEqual(activeSubscription, nextSubscription) {
      if (!nextSubscription && !activeSubscription) {
        // Both old and new are falsy.
        return true;
      }

      if (!nextSubscription || !activeSubscription) {
        // Only one of the pair is falsy.
        return false;
      }

      var subscription = activeSubscription.subscription;

      if (nextSubscription.constructor !== subscription.constructor) {
        // Subscriptions are of different types.
        return false;
      }

      // Need to bind subscription to Relay environment to get variables.
      nextSubscription.bindEnvironment(this.context.relay);

      // Check if variables match.
      return (0, _isEqual2.default)(nextSubscription.getVariables(), subscription.getVariables());
    };

    Subscribe.prototype.render = function render() {
      return _react2.default.createElement(Component, _extends({}, this.props, {
        relay: this.relayProp
      }));
    };

    return Subscribe;
  }(_react2.default.Component), _class.displayName = 'Subscribe(' + componentName + ')', _class.propTypes = {
    relay: _react2.default.PropTypes.object.isRequired
  }, _class.contextTypes = {
    relay: _reactRelay2.default.PropTypes.Environment
  }, _temp;
}

function createContainer(Component, spec) {
  return _reactRelay2.default.createContainer(subscribe(Component, spec.subscriptions), spec);
}
module.exports = exports['default'];