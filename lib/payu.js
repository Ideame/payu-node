var https = require('https')
    , util = require('util');

var paymentsMethods = [ 'GET_PAYMENT_METHODS', 'SUBMIT_TRANSACTION', 'PING_PAYMENTS'];
var reportsMethods = [ 'TRANSACTION_RESPONSE_DETAIL', 'ORDER_DETAIL_BY_REFERENCE_CODE', 'ORDER_DETAIL', 'PING_REPORTS'];
var isPaymentsMethod = new RegExp('^(' + paymentsMethods.join('|') + ')$');

function merge(a, b) {
    for (var p in b) {
        try {
            if (b[p].constructor === Object) {
                a[p] = merge(a[p], b[p]);
            } else {
                a[p] = b[p];
            }
        } catch (e) {
            a[p] = b[p];
        }
    }
    return a;
}

function httpsPost(options, callback) {
    options.method = 'POST';
    options.headers = options.headers || {};

    var data = (typeof options.data !== 'string') ? JSON.stringify(options.data) : options.data;

    options.headers['Content-Length'] = data.length;
    
    var req = https.request(options);

    req.on('response', function (res) {
        var response = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            response += chunk;
        });

        res.on('end', function () {
            return callback(null, {
                statusCode: res.statusCode,
                body:       response
            });
        });
    });

    req.on('error', function (e) {
        callback(e);
    });

    if (data) {
        req.write(data);
    }

    req.end();
}

var Payu = function (config) {
    if (!config) throw new Error('Config is required');
    if (!config.apiKey) throw new Error('Config must have apiKey');
    if (!config.apiLogin) throw new Error('Config must have apiLogin');

    var defaultConfig = {
        test:               false,
        hostname:           'api.payulatam.com',
        testHostname:       'stg.api.payulatam.com',
        paymentsPath:       '/payments-api/4.0/service.cgi',
        reportsPath:        '/reports-api/4.0/service.cgi',
        headers: {
            'Accept':       'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        }
    };

    this.config = merge(defaultConfig, config);
};

Payu.prototype.callApi = function (data, callback) {
    var config = this.config;
    var authObject = {
        test:           config.test,
        merchant: {
            apiLogin:   config.apiLogin,
            apiKey:     config.apiKey
        }
    };
    data = merge(data || {}, authObject);
    
    var apiPath = isPaymentsMethod.test(data.command) ? config.paymentsPath : config.reportsPath;
    data.command = /PING/.test(data.command) ? 'PING' : data.command;

    var options = {
        hostname:   config.test ? config.testHostname : config.hostname,
        path:       apiPath,
        data:       data,
        headers:    config.headers
    };

    httpsPost(options, function (error, response) {
        if (error) { return callback(error); }

        var body = response.body;
        var statusCode = response.statusCode;
        
        try {
            body = JSON.parse(body);
        } catch (e) {
            var err = new Error('Invalid JSON Response Received');
            err.response = body;
            err.httpStatusCode = response.statusCode;
            return callback(err);
        }

        if (statusCode < 200 || statusCode >= 300) {
            error = new Error('Response Status: ' + statusCode);
            error.response = body;
            error.httpStatusCode = statusCode;
            return callback(error);
        }

        if (/^SUCCESS$/.test(body.code)) {
            callback(null, body);
        } else {
            var err = new Error('Response code is ' + body.code + '. Check the response for more info');
            return callback(err, body);
        }
    });
};

paymentsMethods.concat(reportsMethods).forEach(function (method) {
    var prototypeMethodName = method.toLowerCase().replace(/_(.)?/g, function(match, c){ return c.toUpperCase(); });
    Payu.prototype[prototypeMethodName] = function (data, callback) {
        if (!callback) {
            callback = data;
            data = { language: 'en' };
        }
        data.command = method;
        this.callApi(data, callback);
    };
});

module.exports = Payu;