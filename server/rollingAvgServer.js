// Derek Hong 2016
// 

/*
Location Object: Object that can store information related to a Subject or Packet.  Currently only stores state.
{
	state: String				The two letter code for the state name
}

Packet Object: Object format that is received from Sentiment Engine.  Object format is also used
				to pass onto the Front End
{
	loc: Location Object	The Location object which stores information about location
	subj: String			Is candidate name or "Democrat" or "Republican"
	sent: Num				Number between [0,1)  Represents rolling sentiment value average
	tweet: String 			The processed tweet from the Sentiment Engine (not used)
}

Subject Object: Object that stores the sentiments of a Subject (either candidate name or party)
{
	subj: String			Is candidate name, or "Democrat" or "Republican"
	_locName_: LocationSentiment Object			The sentiments tied to a location
	_locName_: LocationSentiment Object			for this certain subject.  Stored
	.											as an array of LocationSentiments.
	.											_locName_ is replaced with the appropriate
	.											loc denomination (currently "state", the 
	_locName_: LocationSentiment Object			two letter state code).
}

LocationSentiment Object: Object that stores the sentiments tied to a location and a user
							It is up to the user to know that information accordingly.
{
	subj: String
	loc: Location Object
	avgResponse: Num		Average of sentimentResponses
	currResponse: Num 		The newest sentiment response
	sentimentResponses: Array[Num]		Array of numbers representing a log of the sentiment Responses
}

*/

// Max sentimentResponses Array[Num] size
var MAX_SENTIMENT_RESPONSES = 5;


// Subject Objects
var trumpData = { 'subj': 'trump' };
var sandersData = { 'subj': 'sanders' };
var clintonData = { 'subj': 'clinton' };
var cruzData = { 'subj': 'cruz' };
var republicanData = { 'subj': 'republican' };
var democratData = { 'subj': 'democrat' };

// ALL THE DATA
var METADATA = {
	'trump': trumpData,
	'sanders': sandersData,
	'clinton': clintonData,
	'cruz': cruzData,
	'republican': republicanData,
	'democrat': democratData
};

//sentimentResponse: Packet Object
function updateSubject(sentimentResponse, callback) {
	// Unpack sentiment Response
	var state = sentimentResponse['loc']['state'];
	var subject = sentimentResponse['subj'];
	var sentiment = sentimentResponse['sent'];

	// Executes all the nessecary METADATA adjustments to the subject in question
	updateSubjData(state, subject, sentiment, callback)

	// Executes all the nessecary METADATA adjustments to republican or democratic
	if (subject == 'trump' || subject == 'cruz') {
		updateSubjData(state, 'republican', sentiment, callback)
	}
	if (subject == 'clinton' || subject == 'sanders') {
		updateSubjData(state, 'democrat', sentiment, callback)
	}
}

function updateSubjData(state, subject, sentiment, callback) {
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
		addSentiment(subjLocSent_SentResponses, subjLocSent_CurrResponse);
	}
	else if (subjLocSent_CurrResponse < 0) {
		// only push if this is not the very first sentiment responses
		subjLocSent_SentResponses.push(subjLocSent_CurrResponse);
		// Recalculate the average of the sentimentResponses
		subjLocSent_AvgResponse = arrayAvg(subjLocSent_SentResponses);
	}

	// Set the new currResponse to the newly obtained sentiment
	subjLocSent_CurrResponse = sentiment;

	// rebuild METADATA for this subject for the new data
	METADATA[subject][state]['avgResponse'] = subjLocSent_AvgResponse;
	METADATA[subject][state]['currResponse'] = subjLocSent_CurrResponse;
	METADATA[subject][state]['sentimentResponses'] = subjLocSent_SentResponses;

	// Finally, return the requested data
	callback(subjLocSent_AvgResponse, subjLocSent_CurrResponse);
}


// Pushes a new sentiment to a full Sentiment Array.
function addSentiment(sentimentArray, sentiment) {
	return sentimentArray.slice(1).push(sentiment);
}

// find average of Array[Num]
function arrayAvg(array) {
	var arraySum = array.reduce((num1, num2) => {
		return num1 + num2
	});

	return arraySum / array.length;
}

// Dummy function to intercept unnessecary callback
var dummy = function(a,b) {}


/*
// test first data in clean database
var sent1 = {
	loc: {state: 'NY'},
	subj: 'cruz',
	sent: -0.45
}


updateSubject(sent1, (data) => {console.log(data)});
updateSubject(sent1, (data) => {console.log(data)});
updateSubject(sent1, (data) => {console.log(data)});
updateSubject(sent1, (data) => {console.log(data)});
updateSubject(sent1, (data) => {console.log(data)});
updateSubject(sent1, (data) => {console.log(data)});
updateSubject(sent1, (data) => {console.log(data)});
updateSubject(sent1, (data) => {console.log(data)});
updateSubject(sent1, (data) => {console.log(data)});
updateSubject(sent1, (data) => {console.log(data)});
updateSubject(sent1, (data) => {console.log(data)});
updateSubject(sent1, (data) => {console.log(data)});
updateSubject(sent1, (data) => {console.log(METADATA['cruz'])});
updateSubject(sent1, (data) => {console.log(METADATA['republican'])});
updateSubject(sent1, (data) => {console.log(METADATA['democrat'])});*/






