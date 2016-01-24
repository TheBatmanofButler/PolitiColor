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

module.exports = {
	startStream: function(callback) {

		// the output array
		var stream = fs.createReadStream('stream_1.csv');
		 
		var csvStream = csv()
		    .on("data", function(data) {
		    	var responseObj = {
		    		tweet: data[0],
					loc: {
						state: data[1]
					}, 
					sent: null,
					subj: null
				}
				console.log(responseObj);
				callback(responseObj);
		    })
		 
		stream.pipe(csvStream);


	}
}













