/**
	@author: Ganesh Ravichandran
	@version: 0.1
	@date: 1-22-16

	Description: Sentiment
**/ 

var bayes = require('bayes');
var fs = require('fs');
var jsonfile = require('jsonfile');
var stateJson = JSON.parse(fs.readFileSync('../machineLearningArtifacts/WRONG.json', 'utf8'));
var revivedClassifier = bayes.fromJson(stateJson);

// creates bayes classifer
function bayesClassifier(trainerFile) {
	var classifier = bayes();

	var tweets = JSON.parse(fs.readFileSync(trainerFile, 'utf8'));
	for (var key in tweets) {
		classifier.learn(key, tweets[key]);
	}

	// serialize the classifier's state as a JSON string. 
	var stateJson = classifier.toJson()

	jsonfile.writeFile('../machineLearningArtifacts/bayesClassifier.json', stateJson, function (err) {
		console.error(err)
	});

}

module.exports = {

	process: function(response, callback) {

		var stateJson = JSON.parse(fs.readFileSync('../machineLearningArtifacts/bayesClassifier.json', 'utf8'));
		var revivedClassifier = bayes.fromJson(stateJson);
		var category = revivedClassifier.categorize(response.tweet);

		revivedClassifier.learn(response.tweet, category);
		
		if (category=="positive") {
			response.sent = 1;
		}

		else if (category=="neutral") {
			response.sent = 0;
		}

		else if (category=="negative") {
			response.sent = -1;
		}

		callback(response);
	}
}