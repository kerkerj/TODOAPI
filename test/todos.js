'use strict';

var superagent = require('superagent');
var expect = require('expect.js');
var config = require("../config/config.js");
//var assert = require('assert');


describe('RESTful API - /todos', function() {

    describe('GET /todos/12', function() {
        var subUrl = '/todos/12';

        it('should be success', function (done) {
            superagent
                .get(config.base_url + subUrl)
                .set('API-Key', config.test_token)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.body.todos).to.eql("return a todos - 12");
                    done();
                });
        });
    });

    describe('POST /todos', function() {
        var subUrl = '/todos/';

        it('should be success, when post to a right url and right data', function (done) {
            superagent
                .post(config.base_url + subUrl)
                .set('Accept', 'application/json')
                .set('API-Key', config.test_token)
                .send( { name: 'John', email: 'john@rpjs.co'} )
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.body.name).to.eql("John");
                    expect(res.body.email).to.eql("john@rpjs.co");
                    // console.log(res.body);
                    done();
                });
        });

        it('should be error, when post to an error url and right data', function (done) {
            superagent
                .post(config.base_url + subUrl + '22222')
                .set('Accept', 'application/json')
                .set('API-Key', config.test_token)
                .send( { name: 'John', email: 'john@rpjs.co'} )
                .end(function (e, res) {
                    expect(res.status).to.eql(404);
                    expect(res.body.error).to.eql("Not Found");
                    // console.log(res.body);

                    done();
                });
        });
    });
});
