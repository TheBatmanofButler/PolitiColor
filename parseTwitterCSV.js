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
function parseTwitterCSV(filename, callback) {
	// the output array
	var output = [];
	var stream = fs.createReadStream(filename);
	 
	var csvStream = csv()
	    .on("data", function(data) {
	    	output.push({
	    		text: data[0],
	    		loc: { state: data[1] }
	    	});
	    })
	    //when the file is complete, return the output array
	    .on("end", function() {
	        //execute the next function with the output array
	        callback(output);
	    });
	 
	stream.pipe(csvStream);
}

parseTwitterCSV('machineLearningArtifacts/stream1.csv', function(response) {
	jsonfile.writeFile('machineLearningArtifacts/tweets1.json', response, function (err) {
		console.error(err)
	})
});