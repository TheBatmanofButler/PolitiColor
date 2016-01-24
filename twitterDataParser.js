// Derek Hong 2016
// Twitter data parser (test run for rolling Avg Server)


var output = []

var fs = require('fs');
var csv = require('csv');

var reader = fs.createReadStream('stream1.csv');

reader.on('readable', () => {
	var csvRead = reader.read();
	csv.parse(csvRead, function(err, data){
		console.log(csvRead)
		console.log(err);
		//output.push(data);
		//console.log(data);
	});
});

reader.on('end', () => {
  	console.log('end');
});










