'use strict';

var superagent = require('superagent');
var expect = require('expect.js');
var config = require("../config/config.js");
var mongoose = require('mongoose');
var clearDB  = require('mocha-mongoose')(config.db.test, {noClear: true});
var TODO = require('../models/todos');

describe('RESTful API - /users/:id/todos', function () {
    var user_id = "12334";

    var test_datas = [
        { user_id: user_id, content: "todo task1", created_at: Date.now(), updated_at: Date.now() },
        { user_id: user_id, content: "todo task2", created_at: Date.now(), updated_at: Date.now() },
        { user_id: user_id, content: "todo task3", created_at: Date.now(), updated_at: Date.now() }
    ];

    before(function (done) {
        if (!mongoose.connection.db) {
            mongoose.connect(config.db.test);
        }

        //add some test data
        for (var i = 0; i < test_datas.length ; i++ ) {
            var todo = new TODO(test_datas[i]);
            test_datas[i] = todo;

            todo.save(function (err) {
            });
        }

        console.log("saved test data");

        done();
    });

    after(function () {
        //delete all the customer records
        TODO.remove({}, function (err) {});
        console.log("all test data deleted");
    });

    describe('POST /users/:user_id/todos/', function () {
        it('It should be success, when GET to a right url with a set of right data.', function (done) {

            var url = config.base_url + '/users/' + user_id + '/todos/';
            var data = { user_id: user_id, content: "todo taskGG" };

            superagent
                .post(url)
                .set('API-Key', config.test_token)
                .send(data)
                .end(function (e, res) {
                    expect(res.status).to.eql(201);
                    expect(res.body.user_id).to.eql("12334");
                    expect(res.body).to.have.key(['user_id', '_id']);
                    expect(res.body).to.be.an("object");
                });

            done();
        });
    });

    describe('GET /users/:user_id/todos/:todo_id', function () {
        it('It should be success, when GET to a right url with right params', function (done) {

            // get random test_data id
            var random = Math.floor(Math.random() * (test_datas.length - 1) + 1);
            var todo_id = test_datas[random]._id;

            var url = config.base_url + '/users/' + user_id + '/todos/' + todo_id;

            superagent
                .get(url)
                .set('API-Key', config.test_token)
                .end(function (e, res) {
                    expect(res.status).to.eql(200);
                    expect(res.body).to.be.an("object");
                    expect(res.body[0]).not.to.be(null);
                    expect(res.body).to.have.key(['_id', 'user_id', 'content', 'created_at', 'updated_at']);
                    expect(res.body.user_id).to.eql(user_id);

                    done();
                })
        });
    });

    describe('GET /users/:user_id/todos/', function () {
        it('It should be success, when GET to a right url with right params', function (done) {
            var url = config.base_url + '/users/' + user_id + '/todos/';

            superagent
                .get(url)
                .set('API-Key', config.test_token)
                .end(function (e, res) {
                    expect(res.status).to.eql(200);
                    expect(res.body).to.be.an("array");

                    for (var item in res.body) {
                        expect(res.body[item]).to.be.an("object");
                        expect(res.body[item][0]).not.to.be(null);
                        expect(res.body[item]).to.have.key(['_id', 'user_id', 'content', 'created_at', 'updated_at']);
                        expect(res.body[item].user_id).to.eql(user_id);
                    }

                    done();
                })
        });
    });

    describe('PUT /users/:user_id/todos/:todo_id', function () {
        it('It should be success, when PUT to a right url with right data', function (done) {
            // get random test_data id
            var random = Math.floor(Math.random() * (test_datas.length - 1) + 1);
            var todo_id = test_datas[random]._id;
            var url = config.base_url + '/users/' + user_id + '/todos/' + todo_id;
            var new_content = "Fixed";

            var data = { user_id: user_id, _id: todo_id, content: new_content};

            superagent
                .put(url)
                .set('API-Key', config.test_token)
                .send(data)
                .end(function (e, res) {
                    expect(res.status).to.eql(201);
                    expect(res.body).to.be.an("object");
                    expect(res.body).not.to.be(null);
                    expect(res.body).to.have.key(['_id', 'user_id', 'content', 'created_at', 'updated_at']);
                    expect(res.body.user_id).to.eql(user_id);
                    expect(res.body.content).to.eql(new_content);

                    done();
                })
        });
    });

    describe('DELETE /users/:user_id/todos/:todo_id', function () {
        it('It should be success, when PUT to a right url with right data', function (done) {
            // get random test_data id
            var random = Math.floor(Math.random() * (test_datas.length - 1) + 1);
            var todo_id = test_datas[random]._id;
            var url = config.base_url + '/users/' + user_id + '/todos/' + todo_id;

            superagent
                .del(url)
                .set('API-Key', config.test_token)
                .end(function (e, res) {
                    expect(res.status).to.eql(201);
                    expect(res.body).to.be.an("object");
                    expect(res.body).not.to.be(null);
                    expect(res.body).to.have.key(['success']);
                    expect(res.body.success).to.eql("true");

                    done();
                })
        });
    });
});