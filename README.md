# node-request-retry

A simple Node.js request wrapper for retrying http requests.

#### Usage
```
var RequestRetry = require('node-request-retry');

var requestRetry = new RequestRetry();

// Retry if the response received is one of the following codes
requestRetry.setRetryCodes([400, 404, 408, 500]);

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
