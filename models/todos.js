'use strict';

var mongoose = require('mongoose');

// Define our todo schema
var TODOschema   = new mongoose.Schema({
    user_id: String,
    content: String,
    created_at: Date,
    updated_at: Date
});

// Export the Mongoose model
module.exports = mongoose.model('TODO', TODOschema);