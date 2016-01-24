/**
	@author: Ganesh Ravichandran
	@version: 0.1
	@date: 1-22-16

	Description: Sentiment
**/ 

var sentiment = require('sentiment');
var bayes = require('bayes');
var fs = require('fs');
var jsonfile = require('jsonfile');

// creates bayes classifer
function bayesClassifier() {
	var classifier = bayes();

	var tweets = JSON.parse(fs.readFileSync('../NLPtrainer/trainer.json', 'utf8'));

	for (var key in tweets) {
		classifier.learn(key, tweets[key]);
	}

	// serialize the classifier's state as a JSON string. 
	var stateJson = classifier.toJson()

	jsonfile.writeFile('bayesClassifier.json', stateJson, function (err) {
		console.error(err)
	})

}

module.exports = {

	process: function(response, callback) {
		// callback(response);
		var stateJson = JSON.parse(fs.readFileSync('bayesClassifier.json', 'utf8'));
		var revivedClassifier = bayes.fromJson(stateJson)
		revivedClassifier.categorize(response);

		console.log(revivedClassifier);
		callback();
	}
}

bayesClassifier();