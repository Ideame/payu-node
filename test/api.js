var nock = require('nock')
    , assert = require('assert')
    , sinon = require('sinon')
    , Payu = require('..');

describe('callApi', function() {
    it('should POST to test environment to /api-path', function(done) {
        var mockResponse = { jjx: 'jjx' };
        
        var expectedBody = {
            command: 'MOCK_COMMAND',
            merchant: {
                apiKey: 'mockApiKey',
                apiLogin: 'mockApiLogin'
            },
            test: true,
            language: 'es'
        };

        var mockHttp = nock('https://stg.api.payulatam.com')
            .matchHeader('Accept', 'application/json')
            .matchHeader('Content-Type', 'application/json; charset=utf-8')
            .post('/api-path', expectedBody)
            .reply(400, mockResponse);

        var api = new Payu({
            apiKey: 'mockApiKey',
            apiLogin: 'mockApiLogin',
            test: true
        });

        api.callApi('/api-path', { command: 'MOCK_COMMAND' }, function(err, res) {
            assert.equal(err.httpStatusCode, 400);
            assert.deepEqual(err.response, mockResponse);

            mockHttp.done();
            done();
        });
    });

    it('should POST to production environment to /api-path', function(done) {
        var mockResponse = { jjx: 'jjx' };
        
        var expectedBody = {
            command: 'MOCK_COMMAND',
            merchant: {
                apiKey: 'mockApiKey',
                apiLogin: 'mockApiLogin'
            },
            test: false,
            language: 'es'
        };

        var mockHttp = nock('https://api.payulatam.com')
            .matchHeader('Accept', 'application/json')
            .matchHeader('Content-Type', 'application/json; charset=utf-8')
            .post('/api-path', expectedBody)
            .reply(400, mockResponse);

        var api = new Payu({
            apiKey: 'mockApiKey',
            apiLogin: 'mockApiLogin'
        });

        api.callApi('/api-path', { command: 'MOCK_COMMAND' }, function(err, res) {
            assert.equal(err.httpStatusCode, 400);
            assert.deepEqual(err.response, mockResponse);

            mockHttp.done();
            done();
        });
    });

    it('should return error when Payu response code is not SUCCESS', function(done) {
        var mockResponse = { code: 'NOT_SUCCESS' };
        
        var expectedBody = {
            command: 'MOCK_COMMAND',
            merchant: {
                apiKey: 'mockApiKey',
                apiLogin: 'mockApiLogin'
            },
            test: false,
            language: 'es'
        };

        var mockHttp = nock('https://api.payulatam.com')
            .matchHeader('Accept', 'application/json')
            .matchHeader('Content-Type', 'application/json; charset=utf-8')
            .post('/api-path', expectedBody)
            .reply(200, mockResponse);

        var api = new Payu({
            apiKey: 'mockApiKey',
            apiLogin: 'mockApiLogin'
        });

        api.callApi('/api-path', { command: 'MOCK_COMMAND' }, function(err, res) {
            assert(err);
            assert.deepEqual(res, mockResponse);

            mockHttp.done();
            done();
        });
    });

    it('should return OK when Payu response code is SUCCESS', function(done) {
        var mockResponse = { code: 'SUCCESS' };
        
        var expectedBody = {
            command: 'MOCK_COMMAND',
            merchant: {
                apiKey: 'mockApiKey',
                apiLogin: 'mockApiLogin'
            },
            test: false,
            language: 'es'
        };

        var mockHttp = nock('https://api.payulatam.com')
            .matchHeader('Accept', 'application/json')
            .matchHeader('Content-Type', 'application/json; charset=utf-8')
            .post('/api-path', expectedBody)
            .reply(200, mockResponse);

        var api = new Payu({
            apiKey: 'mockApiKey',
            apiLogin: 'mockApiLogin'
        });

        api.callApi('/api-path', { command: 'MOCK_COMMAND' }, function(err, res) {
            assert(!err);
            assert.deepEqual(res, mockResponse);

            mockHttp.done();
            done();
        });
    });

});

describe('callPaymentsApi', function() {
    it('should call "callApi" with Payments API path', function(done) {
        var mockData = { jjx: 'jjx' };
        var mockResponse = { status: 200 };

        var mockApi = sinon.mock(Payu.prototype);
        mockApi.expects('callApi').withArgs('/payments-api/4.0/service.cgi', mockData).yields(null, mockResponse);

        var api = new Payu({
            apiKey: 'mockApiKey',
            apiLogin: 'mockApiLogin'
        });

        api.callPaymentsApi(mockData, function (err, res) {
            assert(!err);
            assert.deepEqual(res, mockResponse);

            mockApi.verify();
            done();
        });
    });
});

describe('callReportsApi', function() {
    it('should call "callApi" with Payments API path', function(done) {
        var mockData = { jjx: 'jjx' };
        var mockResponse = { status: 200 };

        var mockApi = sinon.mock(Payu.prototype);
        mockApi.expects('callApi').withArgs('/reports-api/4.0/service.cgi', mockData).yields(null, mockResponse);

        var api = new Payu({
            apiKey: 'mockApiKey',
            apiLogin: 'mockApiLogin'
        });

        api.callReportsApi(mockData, function (err, res) {
            assert(!err);
            assert.deepEqual(res, mockResponse);

            mockApi.verify();
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

    it('getPaymentMethods should callPaymentsApi with GET_PAYMENT_METHODS', function(done) {
        var expectedData = { command: 'GET_PAYMENT_METHODS' };
        var mockResponse = { status: 200 };

        var mockApi = sinon.mock(Payu.prototype);
        mockApi.expects('callPaymentsApi').withArgs(expectedData).yields(null, mockResponse);

        api.getPaymentMethods(function (err, res) {
            assert(!err);
            assert.deepEqual(res, mockResponse);

            mockApi.verify();
            done();
        });
    });

    it('submitTransaction should callPaymentsApi with SUBMIT_TRANSACTION', function(done) {        
        var expectedData = { mock: 'data', command: 'SUBMIT_TRANSACTION' };
        var mockResponse = { status: 200 };

        var mockApi = sinon.mock(Payu.prototype);
        mockApi.expects('callPaymentsApi').withArgs(expectedData).yields(null, mockResponse);

        api.submitTransaction({ mock: 'data' }, function (err, res) {
            assert(!err);
            assert.deepEqual(res, mockResponse);

            mockApi.verify();
            done();
        });
    });

    it('pingPayments should callPaymentsApi with PING', function(done) {        
        var expectedData = { command: 'PING' };
        var mockResponse = { status: 200 };

        var mockApi = sinon.mock(Payu.prototype);
        mockApi.expects('callPaymentsApi').withArgs(expectedData).yields(null, mockResponse);

        api.pingPayments(function (err, res) {
            assert(!err);
            assert.deepEqual(res, mockResponse);

            mockApi.verify();
            done();
        });
    });
});

describe('Reports methods:', function() {
    var api = new Payu({
        apiKey: 'mockApiKey',
        apiLogin: 'mockApiLogin',
        test: true
    });

    it('transactionResponseDetail should call TRANSACTION_RESPONSE_DETAIL', function(done) {        
        var expectedData = {
            command: 'TRANSACTION_RESPONSE_DETAIL',
            details: { transactionId: 'mock-transaction-id' }
        };
        var mockResponse = { status: 200 };

        var mockApi = sinon.mock(Payu.prototype);
        mockApi.expects('callReportsApi').withArgs(expectedData).yields(null, mockResponse);

        api.transactionResponseDetail('mock-transaction-id', function (err, res) {
            assert(!err);
            assert.deepEqual(res, mockResponse);

            mockApi.verify();
            done();
        });
    });

    it('orderDetailByReferenceCode should call ORDER_DETAIL_BY_REFERENCE_CODE', function(done) {        
        var expectedData = {
            command: 'ORDER_DETAIL_BY_REFERENCE_CODE',
            details: { referenceCode: 'mock-reference-code' }
        };
        var mockResponse = { status: 200 };

        var mockApi = sinon.mock(Payu.prototype);
        mockApi.expects('callReportsApi').withArgs(expectedData).yields(null, mockResponse);

        api.orderDetailByReferenceCode('mock-reference-code', function (err, res) {
            assert(!err);
            assert.deepEqual(res, mockResponse);

            mockApi.verify();
            done();
        });
    });

    it('orderDetail should call ORDER_DETAIL', function(done) {        
        var expectedData = {
            command: 'ORDER_DETAIL',
            details: { orderId: 'mock-order-id' }
        };
        var mockResponse = { status: 200 };

        var mockApi = sinon.mock(Payu.prototype);
        mockApi.expects('callReportsApi').withArgs(expectedData).yields(null, mockResponse);

        api.orderDetail('mock-order-id', function (err, res) {
            assert(!err);
            assert.deepEqual(res, mockResponse);

            mockApi.verify();
            done();
        });
    });

    it('pingReports should call PING', function(done) {        
        var expectedData = { command: 'PING' };
        var mockResponse = { status: 200 };

        var mockApi = sinon.mock(Payu.prototype);
        mockApi.expects('callReportsApi').withArgs(expectedData).yields(null, mockResponse);

        api.pingReports(function (err, res) {
            assert(!err);
            assert.deepEqual(res, mockResponse);

            mockApi.verify();
            done();
        });
    });
});