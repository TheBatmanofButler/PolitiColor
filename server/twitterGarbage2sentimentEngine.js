var fs = require('fs');
var jsonfile = require('jsonfile');

var sentimentEngine = require('./sentimentEngine');


// takes tweets object with tweets/location and converts to object with just tweets
function twitterGarbage2sentimentEngine(tweetFile) {

	var tweetIsolates = {};

	var tweets = JSON.parse(fs.readFileSync(tweetFile, 'utf8'));

	for (tweet in tweets) {
		tweetIsolates[(tweets[tweet].text)] = '';
	}
	jsonfile.writeFile('../machineLearningArtifacts/tweetIsolates.json', tweetIsolates, function (err) {
		console.error(err)
	});
}

function sentimentEngineIterator(tweetIsolatesFile) {

	var ready4WebApp = {};

	var tweets = JSON.parse(fs.readFileSync(tweetIsolatesFile, 'utf8'));
	for (tweet in tweets) {
		sentimentEngine.processTweet({'tweet': tweet}, function(response) {
			console.log(response.tweet, 222);
			ready4WebApp[response.tweet] = '';
		});
	}
	jsonfile.writeFile('../machineLearningArtifacts/ready4WebApp.json', ready4WebApp, function (err) {
		console.error(err)
	});
}
sentimentEngineIterator('../machineLearningArtifacts/tweetIsolates.json');