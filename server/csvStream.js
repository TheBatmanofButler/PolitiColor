// Derek Hong 2016
// Twitter data parser (test run for rolling Avg Server)


// npm install fast-csv
var fs = require('fs');
var csv = require('fast-csv');
var jsonfile = require('jsonfile');

// filename: String of csv filename
// callback: function that executes after CSV has been parsed
// 		Param: the parsed csv file
// RETURNS: an Array of the tweet Objects
/*		tweet Objects are of:
			{
				text: String,				the text of the tweet
				loc: {
					state: String			the two letter character of the state
				}
			}
*/


var tweets = []

module.exports = {
	startStream: function(callback) {

	var stream1 = fs.createReadStream('stream1.csv');
	var csvStream1 = csv()
	    .on("data", function(data) {
	    	var tweetObj = {
	    		tweet: data[0],
				state: data[1]
			}
			tweets.push(tweetObj);
		})
	    .on("end", function() {
	        //execute the next function with the output array
	        console.log("done with 1")
	        var stream2 = fs.createReadStream('stream2.csv');
			var csvStream2 = csv()
			    .on("data", function(data) {
			    	var tweetObj = {
			    		tweet: data[0],
						state: data[1]
					}
					tweets.push(tweetObj);
				})
			    .on("end", function() {
			        //execute the next function with the output array
			        console.log("done with 2")
			        var stream3 = fs.createReadStream('stream3.csv');
					var csvStream3 = csv()
					    .on("data", function(data) {
					    	var tweetObj = {
					    		tweet: data[0],
								state: data[1]
							}
							tweets.push(tweetObj);
						})
					    .on("end", function() {
					        //execute the next function with the output array
					        console.log("done with 3")
					        var stream4 = fs.createReadStream('stream4.csv');
							var csvStream4 = csv()
							    .on("data", function(data) {
							    	var tweetObj = {
							    		tweet: data[0],
										state: data[1]
									}
									tweets.push(tweetObj);
								})
							    .on("end", function() {
							        var stream5 = fs.createReadStream('stream5.csv');
									var csvStream5 = csv()
									    .on("data", function(data) {
									    	var tweetObj = {
									    		tweet: data[0],
												state: data[1]
											}
											tweets.push(tweetObj);
										})
									    .on("end", function() {
									        //execute the next function with the output array
									        console.log("done with 5")
									        console.log(tweets.length)

									        // Ramp
									        for (var i=0; i<10000; i++) {
									        	var data = tweets.pop();
									        	var responseObj = {
													tweet: data.tweet,
													loc: {
														state: data.state
													}, 
													sent: null,
													subj: null
												}
									        	callback(responseObj)
									        };

									        setInterval(function() {
									        	console.log(tweets.length)

									        	var data = tweets.pop();

									        	var responseObj = {
													tweet: data.tweet,
													loc: {
														state: data.state
													}, 
													sent: null,
													subj: null
												}
									        	callback(responseObj)
									        }, 500);
									    });
									stream5.pipe(csvStream5);
							    });
							stream4.pipe(csvStream4);
					    });
					stream3.pipe(csvStream3);

			    });
			stream2.pipe(csvStream2);

	    });
		stream1.pipe(csvStream1);
	}
}













