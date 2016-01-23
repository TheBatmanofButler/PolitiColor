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

/**
	Takes in a string, converts into a subject number format
**/
function processTweet(tweetObj, callback) {

	console.log(tweetObj);

	norm.process(tweetObj, function(normResponse) {

		console.log(normResponse);

		brill.process(normResponse, function(brillResponse) {

			console.log(brillResponse);

			sent.process(brillResponse, function(sentimentResponse) {
				callback(sentimentResponse);
			});
		});
	});
};

processTweet({tweet:"Because of trump politics is entertaining"}, function(response) { return; });