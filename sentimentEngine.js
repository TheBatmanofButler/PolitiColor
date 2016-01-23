/**
	@author: Amol Kapoor
	@version: 0.1
	@date: 1-22-16

	Description: Server that ties pathway for tweets together
**/

//Normalizes text
var normalization = require('./normalization');
//Filters out unnecessary stuff
var filter = require('./filter');
//Part of Speech Tagger
var brill = require('./brill');
//Sentiment calculator
var sent = require('./sentiment')

/**
	Takes in a string, converts into a subject number format
**/
function(tweet, callback) {
	normalization.process(tweet, function(normResponse) {
		filter.process(normResponse, function(filterResponse) {
			brill.process(filterResponse, function(brillResponse) {
				sent.process(brillResponse, function(sentimentResponse) {
					callback(sentimentResponse);
				});
			});
		});
	});
};