'use strict';

exports.__esModule = true;
exports.default = createSubscriptionQuery;

var _RelayMetaRoute = require('react-relay/lib/RelayMetaRoute');

var _RelayMetaRoute2 = _interopRequireDefault(_RelayMetaRoute);

var _RelayQuery = require('react-relay/lib/RelayQuery');

var _RelayQuery2 = _interopRequireDefault(_RelayQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createSubscriptionQuery(concreteNode, variables) {
  return _RelayQuery2.default.Subscription.create(concreteNode, _RelayMetaRoute2.default.get('$createSubscriptionQuery'), variables);
}
module.exports = exports['default'];