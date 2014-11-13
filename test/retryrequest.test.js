var assert = require('assert')
  , RequestRetry = require('../')
  ;

describe('RequestRetry.setMaxRetries(5)', function() {
  var original;
  before(function() {
    original = RequestRetry.getMaxRetries();
  });

  it('should set MAX_RETRIES to 5', function() {
    RequestRetry.setMaxRetries(5);
    assert(RequestRetry.getMaxRetries() === 5);
  });

  after(function() {
    RequestRetry.setMaxRetries(original);
  });
});

describe('RequestRetry.setRetryDelay(1000)', function() {
  var original;
  before(function() {
    original = RequestRetry.getRetryDelay();
  });

  it('should set RETRY_DELAY to 1000', function() {
    RequestRetry.setRetryDelay(1000);
    assert(RequestRetry.getRetryDelay() === 1000);
  })

  after(function() {
    RequestRetry.setRetryDelay(original);
  });
});

describe('RequestRetry.prototype.setRetryCodes()', function() {
  var request = new RequestRetry();

  it('should set an empty array if passed `undefined`', function() {
    request.setRetryCodes(undefined);
    var test = request.getRetryCodes();
    assert(typeof test === 'object' && test.length === 0);
  });

  it('should set an array if passed `[400,408,500]`', function() {
    request.setRetryCodes([400, 408, 500]);
    var test = request.getRetryCodes();
    assert(typeof test === 'object' && test.length === 3);
    assert(test[0] === 400 && test[1] === 408 && test[2] === 500);
  });

  after(function() {
    request = null;
  });
});

describe('RequestRetry.isRetryCode() when retryCodes = [408]', function() {
  var request = new RequestRetry();

  before(function() {
    request.setRetryCodes([408]);
  });

  it('should return false if code is 200', function() {
    assert(RequestRetry.isRetryCode(request, 200) === false);
  });

  it('should return false if code is 408', function() {
    assert(RequestRetry.isRetryCode(request, 408) === true);
  });

  after(function() {
    request = null;
  });
});
