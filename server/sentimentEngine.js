/**
	@author: Amol Kapoor
	@version: 0.1
	@date: 1-22-16

	Description: Server that ties pathway for tweets together
**/

var jsonfile = require('jsonfile');

//Normalizes text
var norm = require('./normalization');
//Filters out unnecessary stuff
var keywords = require('./keywords');

//Sentiment calculator
var sent = require('./sentiment')

module.exports = {
	/**
		Takes in a string, converts into a subject number format
	**/
	processTweet: function(tweetObj, callback) {

		norm.process(tweetObj, function(normResponse) {

			keywords.process(normResponse, function(filterResponse) {

				sent.process(filterResponse, function(sentimentResponse) {

					if(sentimentResponse.sent !== 0)
						callback(sentimentResponse);
					//else
						//console.log("Returned zero")
				});
			});
		});
	}
}