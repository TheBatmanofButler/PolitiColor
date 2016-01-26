// Derek Hong

var fs = require('fs');
var csv = require('fast-csv');
var sentimentEngine = require('./sentimentEngine');

var oldTweetObjs = [];

// Read the file
var readStream = fs.createReadStream('oldTweets.csv');
var csvReadStream = csv()
	.on("data", function(data) {
		if (data[0] != 'tweet') {
			var tweetObj = {
				tweet: data[0],
				loc: {
					state: data[1]
				}, 
				sent: null,
				subj: null
			}

	    	oldTweetObjs.push(tweetObj);
	    }
	})
    .on("end", function() {
    	console.log('tweets read')
    	writeData();
    });



// NOTE: THIS TAKES A TON OF TIME BE PATIENT
function writeData() { 
	console.log('writting data')
	var writeStream = fs.createWriteStream("oldTweetSentiments.csv");
	var csvWriteStream = csv.createWriteStream({headers: true});
	csvWriteStream.pipe(writeStream);

	for (var i in oldTweetObjs) {

		if (i % 1000 == 0) { console.log(i); }

		var oldTweet = oldTweetObjs[i];
		sentimentEngine.processTweet(oldTweet, function(tweetSentiment){
			var tweetSentimentObj = {
				'tweet': tweetSentiment['tweet'],
				'state': tweetSentiment['loc']['state'],
				'sent': tweetSentiment['sent'],
				'subj': tweetSentiment['subj']
			}
			csvWriteStream.write(tweetSentimentObj);
		});
	}

	console.log('tweets written');
}




readStream.pipe(csvReadStream);





