'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.status(200).json(
        { todos: "return all todos" }
    );
});

router.get('/:id', function(req, res) {
    var id = req.params.id;

    res.status(200).json(
        { todos: "return a todos - " + id }
    );
});

router.post('/', function(req, res) {
    res.status(200).json(
        req.body
    );
});

module.exports = router;