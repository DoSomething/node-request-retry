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

  // Array of response codes to attempt a retry with
  this.retryCodes = [];
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
  if ((err || (response && isRetryCode(this, response.statusCode))) &&
      this.numRetries < MAX_RETRIES) {
    this.numRetries++;
    setTimeout(this.exec, RETRY_DELAY);
  }
  else {
    this.exec = null;
  }
}

/**
 * Check if the response code is one that warrants a retry.
 */
function isRetryCode(obj, code) {
  if (obj.retryCodes && obj.retryCodes.indexOf(code) >= 0) {
    return true;
  }
  else {
    return false;
  }
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
 * Set the array of response codes that warrant a retry.
 */
RequestRetry.prototype.setRetryCodes = function(codes) {
  if (typeof codes !== 'object' || !codes || codes.length == 0) {
    return;
  }

  this.retryCodes = codes;
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

  RequestRetry.isRetryCode = isRetryCode;

  RequestRetry.prototype.getRetryCodes = function() {
    return this.retryCodes;
  }
}
