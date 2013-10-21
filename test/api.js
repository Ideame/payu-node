var nock = require('nock')
    , assert = require('assert')
    , Payu = require('..');

describe('callApi method', function() {
    it('should POST to test environment, payments api', function(done) {
        var mockResponse = { jjx: 'jjx' };
        
        var expectedBody = {
            command: 'PING',
            merchant: {
                apiKey: 'mockApiKey',
                apiLogin: 'mockApiLogin'
            },
            test: true
        };

        var mockHttp = nock('https://stg.api.payulatam.com')
            .matchHeader('Accept', 'application/json')
            .matchHeader('Content-Type', 'application/json; charset=utf-8')
            .post('/payments-api/4.0/service.cgi', expectedBody)
            .reply(400, mockResponse);

        var api = new Payu({
            apiKey: 'mockApiKey',
            apiLogin: 'mockApiLogin',
            test: true
        });

        api.callApi({ command: 'PING_PAYMENTS' }, function(err, res) {
            assert.equal(err.httpStatusCode, 400);
            assert.deepEqual(err.response, mockResponse);

            mockHttp.done();
            done();
        });
    });

    it('should POST to test environment, reports api', function(done) {
        var mockResponse = { jjx: 'jjx' };
        
        var expectedBody = {
            command: 'PING',
            merchant: {
                apiKey: 'mockApiKey',
                apiLogin: 'mockApiLogin'
            },
            test: true
        };

        var mockHttp = nock('https://stg.api.payulatam.com')
            .matchHeader('Accept', 'application/json')
            .matchHeader('Content-Type', 'application/json; charset=utf-8')
            .post('/reports-api/4.0/service.cgi', expectedBody)
            .reply(400, mockResponse);

        var api = new Payu({
            apiKey: 'mockApiKey',
            apiLogin: 'mockApiLogin',
            test: true
        });

        api.callApi({ command: 'PING_REPORTS' }, function(err, res) {
            assert.equal(err.httpStatusCode, 400);
            assert.deepEqual(err.response, mockResponse);

            mockHttp.done();
            done();
        });
    });

    it('should POST to production environment, payments api', function(done) {
        var mockResponse = { jjx: 'jjx' };
        
        var expectedBody = {
            command: 'PING',
            merchant: {
                apiKey: 'mockApiKey',
                apiLogin: 'mockApiLogin'
            },
            test: false
        };

        var mockHttp = nock('https://api.payulatam.com')
            .matchHeader('Accept', 'application/json')
            .matchHeader('Content-Type', 'application/json; charset=utf-8')
            .post('/payments-api/4.0/service.cgi', expectedBody)
            .reply(400, mockResponse);

        var api = new Payu({
            apiKey: 'mockApiKey',
            apiLogin: 'mockApiLogin'
        });

        api.callApi({ command: 'PING_PAYMENTS' }, function(err, res) {
            assert.equal(err.httpStatusCode, 400);
            assert.deepEqual(err.response, mockResponse);

            mockHttp.done();
            done();
        });
    });

    it('should POST to production environment, reports api', function(done) {
        var mockResponse = { jjx: 'jjx' };
        
        var expectedBody = {
            command: 'PING',
            merchant: {
                apiKey: 'mockApiKey',
                apiLogin: 'mockApiLogin'
            },
            test: false
        };

        var mockHttp = nock('https://api.payulatam.com')
            .matchHeader('Accept', 'application/json')
            .matchHeader('Content-Type', 'application/json; charset=utf-8')
            .post('/reports-api/4.0/service.cgi', expectedBody)
            .reply(400, mockResponse);

        var api = new Payu({
            apiKey: 'mockApiKey',
            apiLogin: 'mockApiLogin'
        });

        api.callApi({ command: 'PING_REPORTS' }, function(err, res) {
            assert.equal(err.httpStatusCode, 400);
            assert.deepEqual(err.response, mockResponse);

            mockHttp.done();
            done();
        });
    });

    it('should return error when Payu response code is not SUCCESS', function(done) {
        var mockResponse = { code: 'NOT_SUCCESS' };
        
        var expectedBody = {
            command: 'PING',
            merchant: {
                apiKey: 'mockApiKey',
                apiLogin: 'mockApiLogin'
            },
            test: false
        };

        var mockHttp = nock('https://api.payulatam.com')
            .matchHeader('Accept', 'application/json')
            .matchHeader('Content-Type', 'application/json; charset=utf-8')
            .post('/reports-api/4.0/service.cgi', expectedBody)
            .reply(200, mockResponse);

        var api = new Payu({
            apiKey: 'mockApiKey',
            apiLogin: 'mockApiLogin'
        });

        api.callApi({ command: 'PING_REPORTS' }, function(err, res) {
            assert(err);
            assert.deepEqual(res, mockResponse);

            mockHttp.done();
            done();
        });
    });

    it('should return OK when Payu response code is SUCCESS', function(done) {
        var mockResponse = { code: 'SUCCESS' };
        
        var expectedBody = {
            command: 'PING',
            merchant: {
                apiKey: 'mockApiKey',
                apiLogin: 'mockApiLogin'
            },
            test: false
        };

        var mockHttp = nock('https://api.payulatam.com')
            .matchHeader('Accept', 'application/json')
            .matchHeader('Content-Type', 'application/json; charset=utf-8')
            .post('/reports-api/4.0/service.cgi', expectedBody)
            .reply(200, mockResponse);

        var api = new Payu({
            apiKey: 'mockApiKey',
            apiLogin: 'mockApiLogin'
        });

        api.callApi({ command: 'PING_REPORTS' }, function(err, res) {
            assert(!err);
            assert.deepEqual(res, mockResponse);

            mockHttp.done();
            done();
        });
    });
});

describe('Payments methods:', function() {
    var api = new Payu({
        apiKey: 'mockApiKey',
        apiLogin: 'mockApiLogin',
        test: true
    });

    it('getPaymentMethods should call GET_PAYMENT_METHODS', function(done) {        
        var expectedBody = {
            command: 'GET_PAYMENT_METHODS',
            merchant: {
                apiKey: 'mockApiKey',
                apiLogin: 'mockApiLogin'
            },
            test: true
        };

        var mockHttp = nock('https://stg.api.payulatam.com')
            .post('/payments-api/4.0/service.cgi', expectedBody)
            .reply(200, { code: 'SUCCESS' });


        api.getPaymentMethods({ }, function(err, res) {
            mockHttp.done();
            done(err);
        });
    });

    it('submitTransaction should call SUBMIT_TRANSACTION', function(done) {        
        var expectedBody = {
            command: 'SUBMIT_TRANSACTION',
            merchant: {
                apiKey: 'mockApiKey',
                apiLogin: 'mockApiLogin'
            },
            test: true
        };

        var mockHttp = nock('https://stg.api.payulatam.com')
            .post('/payments-api/4.0/service.cgi', expectedBody)
            .reply(200, { code: 'SUCCESS' });

        api.submitTransaction({ }, function(err, res) {
            mockHttp.done();
            done(err);
        });
    });

    it('pingPayments should call PING', function(done) {        
        var expectedBody = {
            command: 'PING',
            merchant: {
                apiKey: 'mockApiKey',
                apiLogin: 'mockApiLogin'
            },
            test: true
        };

        var mockHttp = nock('https://stg.api.payulatam.com')
            .post('/payments-api/4.0/service.cgi', expectedBody)
            .reply(200, { code: 'SUCCESS' });

        api.pingPayments({ }, function(err, res) {
            mockHttp.done();
            done(err);
        });
    });
});

describe('Reports methods', function() {
    var api = new Payu({
        apiKey: 'mockApiKey',
        apiLogin: 'mockApiLogin',
        test: true
    });

    it('transactionResponseDetail should call TRANSACTION_RESPONSE_DETAIL', function(done) {        
        var expectedBody = {
            command: 'TRANSACTION_RESPONSE_DETAIL',
            merchant: {
                apiKey: 'mockApiKey',
                apiLogin: 'mockApiLogin'
            },
            test: true
        };

        var mockHttp = nock('https://stg.api.payulatam.com')
            .post('/reports-api/4.0/service.cgi', expectedBody)
            .reply(200, { code: 'SUCCESS' });


        api.transactionResponseDetail({ }, function(err, res) {
            mockHttp.done();
            done(err);
        });
    });

    it('orderDetailByReferenceCode should call ORDER_DETAIL_BY_REFERENCE_CODE', function(done) {        
        var expectedBody = {
            command: 'ORDER_DETAIL_BY_REFERENCE_CODE',
            merchant: {
                apiKey: 'mockApiKey',
                apiLogin: 'mockApiLogin'
            },
            test: true
        };

        var mockHttp = nock('https://stg.api.payulatam.com')
            .post('/reports-api/4.0/service.cgi', expectedBody)
            .reply(200, { code: 'SUCCESS' });

        api.orderDetailByReferenceCode({ }, function(err, res) {
            mockHttp.done();
            done(err);
        });
    });

    it('orderDetail should call ORDER_DETAIL', function(done) {        
        var expectedBody = {
            command: 'ORDER_DETAIL',
            merchant: {
                apiKey: 'mockApiKey',
                apiLogin: 'mockApiLogin'
            },
            test: true
        };

        var mockHttp = nock('https://stg.api.payulatam.com')
            .post('/reports-api/4.0/service.cgi', expectedBody)
            .reply(200, { code: 'SUCCESS' });

        api.orderDetail({ }, function(err, res) {
            mockHttp.done();
            done(err);
        });
    });

    it('pingReports should call PING', function(done) {        
        var expectedBody = {
            command: 'PING',
            merchant: {
                apiKey: 'mockApiKey',
                apiLogin: 'mockApiLogin'
            },
            test: true
        };

        var mockHttp = nock('https://stg.api.payulatam.com')
            .post('/reports-api/4.0/service.cgi', expectedBody)
            .reply(200, { code: 'SUCCESS' });

        api.pingReports({ }, function(err, res) {
            mockHttp.done();
            done(err);
        });
    });
});