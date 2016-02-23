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
		dumpSubjData('repub-dem', callback);
		console.log('data dumped');
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
		updateSubjData(state, subject, sentiment);

		// Executes all the nessecary METADATA adjustments to republican or democrat
		if (subject == 'trump' || subject == 'cruz') {
			updateSubjData(state, 'republican', sentiment);
		}
		if (subject == 'clinton' || subject == 'sanders') {
			updateSubjData(state, 'democrat', sentiment);
		}

		// now, build a final sentiment response
		if (subject == 'republican' || subject == 'cruz' || subject == 'trump') {
			sentimentResponse.subj = ['republican'];
			sentimentResponse.sent = combinedAvg(state, ['republican', 'cruz', 'trump']); 
		}
		else {  // subject == 'democrat' || subject == 'clinton' || subject == 'sanders'
			sentimentResponse.subj = ['democrat'];
			sentimentResponse.sent = combinedAvg(state, ['democrat', 'clinton', 'sanders']); 
		}
		// Finally, return the requested data
		callback(sentimentResponse);

		// Also callback for repubdem down both party data for map.js
		sentimentResponse.subj = ['repub-dem'];
		sentimentResponse.sent = combinedRepubdemAvg(state); 
		callback(sentimentResponse);
	}
}

function dumpSubjData(subject, callback) {
	var responsePacket = {
		'subj': [subject],
		'loc': {'state': ''},
		'sent': 00,
	}

	//console.log(subject)

	for (var state in METADATA[subject]) {
		if (state != 'subj') { //ignore the subject key
			responsePacket['loc']['state'] = state;

			var combined_AvgResponse;
			if (subject == 'republican') {
				combined_AvgResponse = combinedAvg(state, ['republican', 'cruz', 'trump']); }
			else if (subject == 'democrat' ) {
				combined_AvgResponse = combinedAvg(state, ['democrat', 'clinton', 'sanders']); }
			
			// Hollaback for that subject
			responsePacket['sent'] = combined_AvgResponse;
			callback(responsePacket)

			// Also hollabkac for the repubdem for that state
			responsePacket['subj'] = ['repub-dem']
			responsePacket['sent'] = combinedRepubdemAvg(state);
			callback(responsePacket)
		}
	}
}

function updateSubjData(state, subject, sentiment) {
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
}


// Pushes a new sentiment to a full Sentiment Array.
function addSentiment(sentimentArray, sentiment) {
	// remove first sentiment
	sentimentArray = sentimentArray.slice(1);
	// add new sentiment to end
	sentimentArray.push(sentiment);

	return sentimentArray;
}

//special case of combined avg
function combinedRepubdemAvg(state) {
	var combined_numSentiments = 0;
	var combinedAvg = 0;
	var sentimentArray;
	for (var subject in METADATA) {
		try {
			sentimentArray = METADATA[subject][state]['sentimentResponses']; }
		catch(err) { // state does not exist
			sentimentArray = []; }

		var subject_avgResponse;
		if (subject == 'republican' || subject == 'cruz' || subject == 'trump') {
			subject_avgResponse = -1 * arrayAvg(sentimentArray); } 
		else { //subject == 'democrat' || subject == 'clinton' || subject == 'sanders'
			subject_avgResponse = arrayAvg(sentimentArray); }


		combinedAvg = (combinedAvg*combined_numSentiments + subject_avgResponse*sentimentArray.length) / (combined_numSentiments + sentimentArray.length)
		//idk a better way to do this, so it'll look like shit in the meantime
		if (Number.isNaN(combinedAvg)) { //ie: it's NaN (we divide BY ZERO OH SHIT)
		combinedAvg = 0; }

		combined_numSentiments += sentimentArray.length;
	}
	return combinedAvg;
}

// OF NOTE: if 'republican' is to be passed to this function, then it MUST be passed as subj1
function combinedAvg(state, subjectArray) {
	var combined_numSentiments = 0;
	var combinedAvg = 0;
	var sentimentArray;
	for (var i in subjectArray) {
		var subject = subjectArray[i];
		try {
			sentimentArray = METADATA[subject][state]['sentimentResponses']; }
		catch(err) { // state does not exist
			sentimentArray = []; }

		var subject_avgResponse = arrayAvg(sentimentArray);

		combinedAvg = (combinedAvg*combined_numSentiments + subject_avgResponse*sentimentArray.length) / (combined_numSentiments + sentimentArray.length)
		combined_numSentiments += sentimentArray.length;
	}

	return combinedAvg;
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
// console.log(combinedAvg('NY', ['republican', 'cruz', 'trump']));




