# node-request-retry

A simple Node.js request wrapper for retrying http requests.

#### Usage
```
var RequestRetry = require('node-request-retry');

var requestRetry = new RequestRetry();

var retryConditions = [];
// Retries can be triggered by either receiving a certain status code
Array.prototype.push.apply(retryConditions, [400, 404, 408, 500]);

// ... or by evaluating a function. Returning true means the request should be retried.
var fnShouldRetry = function(response, body) {
  if (body == false)
    return true;
  else
    return false;
};
retryConditions[retryConditions.length] = fnShouldRetry;

requestRetry.setRetryCodes(retryConditions);

// POST
requestRetry.post(url, postData, function(err, response, body) {
  /* ... */
});
```

#### Modify Defaults
```
var RequestRetry = require('node-request-retry');

// A wrapper for request.defaults(obj);
RequestRetry.setDefaults({timeout: 30000});

// Default is 3
Request.setMaxRetries(5);

// Default is 10000
Request.setRetryDelay(20000);
```
