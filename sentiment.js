/**
	@author: Ganesh Ravichandran
	@version: 0.1
	@date: 1-22-16

	Description: Sentiment
**/

var sentiment = require('sentiment');

module.exports = {
	process: function(response, callback) {
		return sentiment(response).score;
	}
}