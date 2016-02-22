// Derek Hong 2016
// 

//NOTES FOR FUTURE:
// it would be better to populate each and every subject object initially rather than on the fly.
// this avoids pesky "undefined" issues downstream

var fs = require('fs');
var csv = require('fast-csv');

/*
Location Object: Object that can store information related to a Subject or Packet.  Currently only stores state.
{
	state: String				The two letter code for the state name
}

Packet Object: Object format that is received from Sentiment Engine.  Object format is also used
				to pass onto the Front End
{
	loc: Location Object	The Location object which stores information about location
	subj: Array[String]		Is either candidate name, "Democrat", or "Republican"
	sent: Num				Number that is -1 or 1.  Represents rolling sentiment value average
	tweet: String 			The processed tweet from the Sentiment Engine (not currently used)
}

Subject Object: Object that stores the sentiments of a Subject (either candidate name or party)
{
	subj: String			Is either candidate name, "Democrat", or "Republican"
	_locName_: LocationSentiment Object			{ The sentiments tied to a location
	_locName_: LocationSentiment Object			for this certain subject.  
	.											_locName_ is replaced with the appropriate
	.											loc denomination (currently "state", the 
	.											two letter state code). }
	_locName_: LocationSentiment Object			
}

LocationSentiment Object: Object that stores the sentiments tied to a location and a user
{
	subj: String
	loc: Location Object
	avgResponse: Num		Average of sentimentResponses
	currResponse: Num 		The newest sentiment response
	sentimentResponses: Array[Num]		Array of numbers representing a log of the sentiment Responses
}

*/

// Max sentimentResponses Array[Num] size
var MAX_SENTIMENT_RESPONSES = 50000;


// Subject Objects
var trumpData = 	{ 'subj': 'trump' };
var sandersData = 	{ 'subj': 'sanders' };
var clintonData = 	{ 'subj': 'clinton' };
var cruzData = 		{ 'subj': 'cruz' };
var republicanData = { 'subj': 'republican' };
var democratData = 	{ 'subj': 'democrat' };

// ALL THE DATA
var METADATA = {
	'trump': trumpData,
	'sanders': sandersData,
	'clinton': clintonData,
	'cruz': cruzData,
	'republican': republicanData,
	'democrat': democratData
};

module.exports = {

	//sentimentResponse: Packet Object
	updateSubject: function(sentimentResponse, callback) {
		localUpdateSubject(sentimentResponse, callback);
	}

	,

	// Dumps all avgSentiment Data to client
	dumpData: function(callback) {
		console.log('dumping data');
		// dumpSubjData('trump', callback);
		// dumpSubjData('sanders', callback);
		// dumpSubjData('clinton', callback);
		// dumpSubjData('cruz', callback);
		// dumpSubjData('republican', callback);
		// dumpSubjData('democrat', callback);  // you really only need to dump one, but YOLO
		dumpSubjData('republican', callback);
		dumpSubjData('democrat', callback);
		console.log('data dumped');
	}

	,

	// THIS WILL BREAK IF THE PACKET INFORMATION CHANGES CONTACT DEREK SEE IF HE REMEMBERS IF NOT ALL HOPE IS LOST
	// not currently used
	loadData: function(callback) {

		console.log('loading')
		var readStream = fs.createReadStream('oldTweetSentiments.csv');
		var csvReadStream = csv()
			.on("data", function(data) {
				if (data.length == 4) {
					var subjData = data[3].split(',');
					if (subjData[3] == '') { 
						subjData = [];
					}

					if (data[0] != 'tweet') {
						var packetObject = {
							'tweet': data[0],
							'loc': {'state': data[1]},
							'sent': Number(data[2]),
							'subj': subjData
						}

						localUpdateSubject(packetObject, function(whocares){});
					}
				}
			})
		    .on("end", function() {
		    	console.log('data loaded');
		    	callback();
		    });
		
	readStream.pipe(csvReadStream);
	}
}

function localUpdateSubject(sentimentResponse, callback) {

	// Unpack sentiment Response		
	var subjectArray = sentimentResponse['subj'];
	var state = sentimentResponse['loc']['state'];
	var sentiment = sentimentResponse['sent'];

	//console.log(sentiment)

	for (var i in subjectArray) {
		var subject = subjectArray[i];

		// Executes all the nessecary METADATA adjustments to the subject in question
		updateSubjData(state, subject, sentiment, sentimentResponse, callback)

		// Executes all the nessecary METADATA adjustments to republican or democrat
		if (subject == 'trump' || subject == 'cruz') {
			updateSubjData(state, 'republican', sentiment, sentimentResponse, callback)
		}
		if (subject == 'clinton' || subject == 'sanders') {
			updateSubjData(state, 'democrat', sentiment, sentimentResponse, callback)
		}
	}
}

function dumpSubjData(subject, callback) {
	var responsePacket = {
		'subj': [subject],
		'loc': {'state': ''},
		'sent': 0,
	}

	//console.log(subject)

	for (var state in METADATA[subject]) {
		if (state != 'subj') { //ignore the subject key
			responsePacket['loc']['state'] = state;

			var combined_AvgResponse;
			// slipperly dippery repub-dem calculations
			if (subject == 'republican' || subject == 'democrat') {
				// OF NOTE: if 'republican' is to be passed to this function, then it MUST be passed as subj1
				combined_AvgResponse = combinedAvg(state, 'republican', 'democrat');

				// some slippery cases where negation is necessary
				//repub && avg < 0		NEGATE
				//dem 	&& avg < 0		OK
				//repub && avg > 0		NEGATE
				//dem 	&& avg > 0		OK
				if (subject == 'republican') {
					responsePacket['sent'] = -1 * combined_AvgResponse;
				}
				else {  // subject == 'democrat'
					responsePacket['sent'] = combined_AvgResponse;
				}
			}
			else if (subject == 'clinton' || subject == 'sanders') {
				combined_AvgResponse = combinedAvg(state, 'clinton', 'sanders');
				responsePacket['sent'] = combined_AvgResponse;
			}
			else if (subject == 'trump' || subject == 'cruz') {
				combined_AvgResponse = combinedAvg(state, 'trump', 'cruz');
				responsePacket['sent'] = combined_AvgResponse;
			}
			else {
				//this should never happen, unless we have more stuff to stuff
			}

			callback(responsePacket)
		}
	}
}

function updateSubjData(state, subject, sentiment, originalResponse, callback) {
	// if the _locName_ key for the state does not already exist, make it so
	if (!METADATA[subject][state]){
		var newLocationSentiment = {
			'subj': subject,
			'loc': { 'state': state },
			'avgResponse': 0,
			'currResponse': 0,
			'sentimentResponses': []
		};
		METADATA[subject][state] = newLocationSentiment;
	}

	// unpack relevant data from the LocnationSentiment Object
	var subjLocSent = METADATA[subject][state];

	var subjLocSent_AvgResponse = subjLocSent['avgResponse'];
	var subjLocSent_CurrResponse = subjLocSent['currResponse'];
	var subjLocSent_SentResponses = subjLocSent['sentimentResponses'];

	// now, deposit the newest sentiment response into the LocationSentiment for this Subject
	if (subjLocSent_SentResponses.length > MAX_SENTIMENT_RESPONSES) {
		// if the length of the array exceeds MAX_SENTIMENT_RESPONSES, ROLL BABY ROLL
		subjLocSent_SentResponses = addSentiment(subjLocSent_SentResponses, subjLocSent_CurrResponse);
	}
	else {
		subjLocSent_SentResponses.push(subjLocSent_CurrResponse);
	}

	// Recalculate the average of the sentimentResponses
	subjLocSent_AvgResponse = arrayAvg(subjLocSent_SentResponses);

	// Set the new currResponse to the newly obtained sentiment
	subjLocSent_CurrResponse = sentiment;


	// rebuild METADATA for this subject for the new data
	METADATA[subject][state]['avgResponse'] = subjLocSent_AvgResponse;
	METADATA[subject][state]['currResponse'] = subjLocSent_CurrResponse;
	METADATA[subject][state]['sentimentResponses'] = subjLocSent_SentResponses;

	originalResponse.subj = [subject];

	// NOW HERE COME THE ELEPHANTS:
	// if subject is "republican" or "democrat", then a special average needs to be conveyed
	// we need to combine repub and dem so front end can handle the jazz
	var combined_AvgResponse;
	if (subject == 'republican' || subject == 'democrat') {
		// OF NOTE: if 'republican' is to be passed to this function, then it MUST be passed as subj1
		combined_AvgResponse = combinedAvg(state, 'republican', 'democrat');

		// some slippery cases where negation is necessary
		//repub && avg < 0		NEGATE
		//dem 	&& avg < 0		OK
		//repub && avg > 0		NEGATE
		//dem 	&& avg > 0		OK
		if (subject == 'republican') {
			originalResponse.sent =  -1 * combined_AvgResponse;
		}
		else {
			originalResponse.sent = combined_AvgResponse;
		}
	}
	else if (subject == 'sanders' || subject == 'clinton') { 
		combined_AvgResponse = combinedAvg(state, 'clinton', 'sanders');
		originalResponse.sent = combined_AvgResponse;
	}
	else if (subject == 'trump' || subject == 'cruz') {
		combined_AvgResponse = combinedAvg(state, 'trump', 'cruz');
		originalResponse.sent = combined_AvgResponse;
	}
	else {
		//this hsoul never happen unless we stuff more stuff
	}

	// Finally, return the requested data
	callback(originalResponse);
}


// Pushes a new sentiment to a full Sentiment Array.
function addSentiment(sentimentArray, sentiment) {
	// remove first sentiment
	sentimentArray = sentimentArray.slice(1);
	// add new sentiment to end
	sentimentArray.push(sentiment);

	return sentimentArray;
}


// OF NOTE: if 'republican' is to be passed to this function, then it MUST be passed as subj1
function combinedAvg(state, subj1, subj2) {
	var subj1_sentimentArray;
	var subj2_sentimentArray;
	try {
		subj1_sentimentArray = METADATA[subj1][state]['sentimentResponses']; }
	catch(err) { // state does not exist
		subj1_sentimentArray = []; }

	try {
		subj2_sentimentArray = METADATA[subj2][state]['sentimentResponses']; }
	catch(err) {  // state does not exist
		subj2_sentimentArray = []; }

	var combined_numSentiments = subj1_sentimentArray.length + subj2_sentimentArray.length;

	var subj1_avgResponse;
	var subj2_avgResponse;
	if (subj1 == 'republican') { //slippery dippery republican negation thing
		subj1_avgResponse = -1 * arrayAvg(subj1_sentimentArray);
	}
	else {
		subj1_avgResponse = arrayAvg(subj1_sentimentArray);
	}

	subj2_avgResponse = arrayAvg(subj2_sentimentArray);

	return (subj1_avgResponse*subj1_sentimentArray.length + subj2_avgResponse*subj2_sentimentArray.length) / combined_numSentiments;
}

// find average of Array[Num]
function arrayAvg(array) {
	if (array.length == 0) {
		return 0;
	}
	else {
		var arraySum = array.reduce(function(num1, num2) { return num1 + num2; });
		return arraySum / array.length;
	}
}



// // test first data in clean database
// var sent1 = {
// 	loc: {state: 'NY'},
// 	subj: ['republican'],
// 	sent: -0.45
// }
// var sent2 = {
// 	loc: {state: 'NY'},
// 	subj: ['republican'],
// 	sent: -0.45
// }
// var sent3 = {
// 	loc: {state: 'NY'},
// 	subj: ['republican'],
// 	sent: -0.45
// }
// var sent4 = {
// 	loc: {state: 'NY'},
// 	subj: ['republican'],
// 	sent: -0.45
// }
// var sent5 = {
// 	loc: {state: 'NY'},
// 	subj: ['republican'],
// 	sent: -0.45
// }



// localUpdateSubject(sent1, (data) => {console.log(METADATA['republican'])});
// localUpdateSubject(sent2, (data) => {console.log(METADATA['republican'])});
// localUpdateSubject(sent3, (data) => {console.log(METADATA['republican'])});
// localUpdateSubject(sent4, (data) => {console.log(METADATA['republican'])});
// localUpdateSubject(sent5, (data) => {console.log(METADATA['republican'])});





