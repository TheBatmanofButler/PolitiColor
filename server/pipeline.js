/*
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

//	rollingAvgServer.loadData(function() {

		twitterStream.startStream(function(twitterResponse) { 

			sentimentEngine.processTweet(twitterResponse, function(sentimentReponse) {

				rollingAvgServer.updateSubject(sentimentReponse, function(averageResponse) {

					socket.emitData(averageResponse);
				});

			});

		});

//	});
}

pipeline();

/**
	Final response:

	obj = {
		tweet: "",
		loc: {
			state: ''
		},
		sent: 00,
		subj: ['']
	}

**/