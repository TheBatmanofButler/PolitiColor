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

		sentimentEngine.processTweet(twitterResponse, function(sentimentReponse) {

			rollingAvgServer.updateSubject(sentimentReponse, function(averageResponse, tweetResponse) {
				socket.emitData(averageResponse);
			});

		});

	});
}