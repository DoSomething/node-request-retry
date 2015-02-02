var request = require('request')
  ;

// Number of retries to attempt before giving up
var MAX_RETRIES = 3;

// Time delay between retry attempts
var RETRY_DELAY = 10000;

var RequestRetry = function() {
  // Function to execute the request
  this.exec = undefined;

  // Number request retries attempted
  this.numRetries = 0;

  // Array of response codes and functions to evaluate and attempt a retry with
  this.retryConditions = [];
}

/**
 * Request callback.
 */
function _callback(err, response, body) {
  // Call the client-provided callback
  if (typeof this.callback === 'function') {
    this.callback(err, response, body);
  }

  // If error is encountered or response is received with a code we can retry with,
  // and there are retries remaining, schedule a retry.
  if ((err || (response && isRetryCondition(this, response, body))) &&
      this.numRetries < MAX_RETRIES) {
    this.numRetries++;
    setTimeout(this.exec, RETRY_DELAY);
  }
  else {
    this.exec = null;
  }
}

/**
 * Check if response meets a condition where we should attempt a retry.
 */
function isRetryCondition(obj, response, body) {
  if (obj.retryConditions.length == 0) {
    return false;
  }

  for (var i = 0; i < obj.retryConditions.length; i++) {
    if (typeof obj.retryConditions[i] === 'number') {
      if (response != null && obj.retryConditions[i] == response.statusCode) {
        return true;
      }
    }
    else if (typeof obj.retryConditions[i] === 'function') {
      if (obj.retryConditions[i](response, body)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Set request defaults.
 */
RequestRetry.setDefaults = function(obj) {
  request.defaults(obj);
}

/**
 * Set the maximum number of retries.
 */
RequestRetry.setMaxRetries = function(num) {
  MAX_RETRIES = num;
}

/**
 * Set the time delay in milliseconds before each retry.
 */
RequestRetry.setRetryDelay = function(delay) {
  RETRY_DELAY = delay;
}

/**
 * Set the array of response codes and functions that warrant a retry.
 */
RequestRetry.prototype.setRetryConditions = function(conditions) {
  if (typeof conditions !== 'object' || !conditions || conditions.length == 0) {
    return;
  }

  this.retryConditions = conditions;
}

/**
 * Wrapper for request.post. Sets the this.exec closure with reference to url,
 * data, and callback variables to be used in case the request needs to be retried.
 */
RequestRetry.prototype.post = function(url, data, callback) {
  this.numRetries = 0;
  
  var _this = this;
  _this.callback = callback;

  this.exec = function() {
    request.post(url, data, _callback.bind(_this));
  };

  this.exec();
};

module.exports = RequestRetry;


/**
 *
 * Helper functions for running tests.
 *
 */
if (process.env.NODE_ENV === 'test') {
  RequestRetry.getMaxRetries = function() {
    return MAX_RETRIES;
  }

  RequestRetry.getRetryDelay = function() {
    return RETRY_DELAY;
  }

  RequestRetry.isRetryCondition = isRetryCondition;

  RequestRetry.prototype.getRetryConditions = function() {
    return this.retryConditions;
  }
}
