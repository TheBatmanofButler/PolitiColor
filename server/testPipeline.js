/**
	@author: Amol Kapoor
	@date: 1-23-16
	@version: 0.1

	Description: main pipeline
*/

var twitterStream = require('./twitterStream')

var sentimentEngine = require('./sentimentEngine');

var rollingAvgServer = require('./rollingAvgServer');

var socket = require('./socket');


function pipeline() {
	twitterStream.startStream(function(twitterResponse) {
		console.log('startStream');

		sentimentEngine.processTweet(twitterResponse, function(sentimentReponse) {
			console.log('processTweet');

			rollingAvgServer.updateSubject(sentimentReponse, function(averageResponse, tweetResponse) {
				console.log('updateSubject');
			});

		});

	});
}