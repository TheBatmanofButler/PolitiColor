//Derek Hong
//csv tweet combine

var fs = require('fs');
var csv = require('fast-csv');

var tweetObjs = [];

function combineTweetCSVs(arrayTweetCSVs) {
	if (arrayTweetCSVs.length == 0) {
		//console.log('finished file traversal');

		var writeStream = fs.createWriteStream("totalTweetData.csv");
		var csvWriteStream = csv.createWriteStream({headers: true});

		csvWriteStream.pipe(writeStream);

		for (i in tweetObjs) {
			csvWriteStream.write(tweetObjs[i]);
		}

		console.log('csv file combination complete');
	}
	else {
		var filename = arrayTweetCSVs.shift();
		var readStream = fs.createReadStream(filename);

		var csvReadStream = csv()
			.on("data", function(data) {
				if (data[0] != 'tweet') {
					var tweetObj = {
						'tweet': data[0],
						'location': data[1]
					}

			    	tweetObjs.push(tweetObj);
			    }
			})
		    .on("end", function() {
		    	//console.log(filename + ': ' + tweetObjs.length);
		    	combineTweetCSVs(arrayTweetCSVs);
		    });

		readStream.pipe(csvReadStream);
	}
	
}



combineTweetCSVs(['stream1.csv', 'stream2.csv', 'stream3.csv', 'stream4.csv', 'stream5.csv']);













