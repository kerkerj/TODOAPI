'use strict';

var superagent = require('superagent');
var expect = require('expect.js');
var config = require("../config/config.js");

describe('RESTful API - /', function() {
    describe('GET /', function() {
        it('should return greetings - hello world!', function (done) {
            superagent
                .get(config.base_url)
                .set('API-Key', config.test_token)
                .end(function (e, res) {
                    // console.log(res.body)
                    expect(e).to.eql(null);
                    expect(typeof res.body).to.eql('object');
                    expect(res.body).to.eql({ greetings: "hello world!"});
                    done();
                });
        });
    });
});
