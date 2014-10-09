'use strict';

var express = require('express');
var validator = require('validator');
var TODO = require('../models/todos');
var router = express.Router();

router.get('/:user_id/todos', function (req, res) {
    var user_id = req.params.user_id;

    switch (true) {
        case ((typeof user_id) == "string"):
            TODO.find(
                {user_id: user_id},
                function (err, results) {
                    res.status(200).json(
                        results
                    );
                }
            );
            break;
        default:
            res.status(400).json(
                { error: "invalid parameters" }
            );
            break;
    }
});

router.get('/:user_id/todos/:todo_id', function (req, res) {
    var user_id = req.params.user_id;
    var todo_id = req.params.todo_id;

    switch (true) {
        case ((typeof user_id) == "string"):
            TODO.find(
                { _id: todo_id, user_id: user_id},
                function (err, results) {
                    res.status(200).json(
                        results[0]
                    );
                }
            );
            break;
        default:
            res.status(400).json(
                { error: "invalid parameters" }
            );
            break;
    }
});

router.post('/:user_id/todos', function (req, res) {
    var user_id = req.params.user_id;
    var data = req.body;

    // validate
    if ('user_id' in data && 'content' in data) {
        console.log(data);

        // insert to db
        var todo = new TODO();
        todo.user_id = user_id;
        todo.content = data.content;
        todo.created_at = Date.now();
        todo.updated_at = Date.now();

        todo.save(function (err) {
            if (err) {
                res.status(400).json(
                    { error: "insert db error" }
                );
            } else {
                res.status(201).json(
                    todo
                );
            }
        });
    } else {
        res.status(400).json(
            { error: "bad request, parameter missing"}
        );
    }
});

router.put('/:user_id/todos/:todo_id', function (req, res) {
    var user_id = req.params.user_id;
    var todo_id = req.params.todo_id;
    var data = req.body;

    // validate
    if ('user_id' in data && 'content' in data) {
        console.log(data);

        TODO.update(
            { _id: todo_id, user_id: user_id },
            { $set: { content: data.content } },
            function (err, num, raw, results) {
                if (err) {
                    res.status(400).json(
                        { error: "update data error" }
                    );
                } else {
                    TODO.find({ _id: todo_id, user_id: user_id }, function (err, results) {
                        res.status(201).json(
                            results[0]
                        );
                    });
                }
            }
        );
    } else {
        res.status(400).json(
            { error: "bad request, parameter missing"}
        );
    }
});

router.delete('/:user_id/todos/:todo_id', function (req, res) {
    var user_id = req.params.user_id;
    var todo_id = req.params.todo_id;

    if (user_id && todo_id) {
        TODO.remove(
            { _id: todo_id, user_id: user_id },
            function (err) {
                if (err) {
                    res.status(400).json(
                        { error: "delete data error"}
                    );
                } else {
                    res.status(201).json(
                        { success: "true" }
                    );
                }
            }
        );
    }
});

module.exports = router;