/**
	@author: Amol Kapoor
	@version: 0.1
	@date: 1-22-16

	Description: Server that ties pathway for tweets together
**/

//Normalizes text
var norm = require('./normalization');
//Filters out unnecessary stuff
var filter = require('./filter');
//Part of Speech Tagger
var brill = require('./brill');
//Sentiment calculator
var sent = require('./sentiment')

module.exports = {
	/**
		Takes in a string, converts into a subject number format
	**/
	processTweet: function(tweetObj, callback) {

		console.log(tweetObj);

		norm.process(tweetObj, function(normResponse) {

			console.log(normResponse);

			filter.process(normResponse, function(filterResponse) {

				console.log(filterResponse);

				sent.process(filterResponse, function(sentimentResponse) {
					callback(sentimentResponse);
				});
			});
		});
	}
}