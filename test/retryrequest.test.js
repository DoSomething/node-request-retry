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

describe('RequestRetry.prototype.setRetryConditions()', function() {
  var request = new RequestRetry();

  it('should set an empty array if passed `undefined`', function() {
    request.setRetryConditions(undefined);
    var test = request.getRetryConditions();
    assert(typeof test === 'object' && test.length === 0);
  });

  it('should set an array if passed `[400,408,500]`', function() {
    request.setRetryConditions([400, 408, 500]);
    var test = request.getRetryConditions();
    assert(typeof test === 'object' && test.length === 3);
    assert(test[0] === 400 && test[1] === 408 && test[2] === 500);
  });

  after(function() {
    request = null;
  });
});

describe('RequestRetry.isRetryCondition() when retryConditions = [408]', function() {
  var request = new RequestRetry();

  before(function() {
    request.setRetryConditions([408]);
  });

  it('should return false if code is 200', function() {
    assert(RequestRetry.isRetryCondition(request, {statusCode: 200}, null) === false);
  });

  it('should return true if code is 408', function() {
    assert(RequestRetry.isRetryCondition(request, {statusCode: 408}, null) === true);
  });

  after(function() {
    request = null;
  });
});

describe('RequestRetry.isRetryCondition() with function in retryConditions', function() {
  var request = new RequestRetry();

  before(function() {
    var retry = function(response, body) {
      if (body == null)
        return true;
      else
        return false;
    };
    request.setRetryConditions([retry]);
  })

  it('should evaluate to false when body != null with body = true', function() {
    assert(RequestRetry.isRetryCondition(request, null, true) === false);
  });

  it('should evaluate to true when body != null with body = null', function() {
    assert(RequestRetry.isRetryCondition(request, null, null) === true);
  });

  after(function() {
    request = null;
  })
});
