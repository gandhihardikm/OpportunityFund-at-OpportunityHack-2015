var express = require('express');
var api = express.Router();

var compare = require('./compare');
var calculate = require('./calculate');


/**Handlers**/
api.use('/compare',compare);
api.use('/calculate',calculate);

module.exports = (function() {
	return api;
})();