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
	sentiment: Num			Number between [0,1)  Represents rolling sentiment value average
}

Subject Object: Object that stores the sentiments of a Subject (either candidate name or party)
{
	subj: String			Is candidate name or "Democrat" or "Republican"
	_locName_Array: Array[Num]		The Subject's sentiment Array based on a Location name.
	_locName_Array: Array[Num]		The _locName_ should correspond (or be identical) to 
	.								that string in the Location Object.  The Array[Number] is
	.								a large array (500 elements?) which carries the sentiments
	.								gathered from Packet Objects for that Location for that Subject.  
	_locName_Array: Array[Num]		There are as many _locName_Arrays as there are different Location Objects

	_locName_CurrAvg: Num 			The current average of the Array for that _locName_						
	.							
	_locName_CurrAvg: Num

	_locName_BumpedAvg: Num 		The bumped average of the Array for that _locName_						
	.							
	_locName_BumpedAvg: Num
*/


// Subject Objects
var trumpData = {};
var sandersData = {};
var clintonData = {};
var cruzData = {};
var republicanData = {};
var democratData = {};

function initializeSubjects

// Takes info from archived file and populates Subject Objects
function populateSubjects(filename) {

}

// Pushes a new sentiment to the Sentiment Array.  Knocks out the first sentiment of Sentiment Array
function addSentiment(sentimentArray, newSentiment) {
	return sentimentArray.slice(1).push(newSentiment);
}







