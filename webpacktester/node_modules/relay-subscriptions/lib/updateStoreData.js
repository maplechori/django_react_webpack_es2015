'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = updateStoreData;
function updateStoreData(environment, configs, query, payload) {
  var storeData = environment.getStoreData();
  var payloadName = query.getCall().name;

  // FIXME: Applying a RANGE_ADD update requires a clientMutationId. This is a
  // nonce that won't collide with any actual mutation IDs.
  var clientMutationId = Math.random().toString(36);

  storeData.handleUpdatePayload(query, _extends({}, payload[payloadName], { clientMutationId: clientMutationId }), { configs: configs });
}

module.exports = exports['default'];