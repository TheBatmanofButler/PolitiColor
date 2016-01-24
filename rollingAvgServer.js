// Derek Hong 2016
// 

/*
Packet Object: Object format that is received from Sentiment Engine.  Object format is also used
				to pass onto the Front End
{
	state: String		Two letter state code
	subj: String		Either candidate name or "Democrat" or "Republican"
	sentiment: Num		Number between [0,1)  Represents rolling sentiment value average
}

Subject Object: Object that stores the sentiments of a Subject (candidate or party)
{
	subj: String				Either candidate name or "Democrat" or "Republican"
	states: Array[State Obj]	Array of size 50 that stores data about states related to a Subject
}

State Object: Object that stores array of all sentiment values, from which the rolling average is calculated
{
	name: String				The two letter code for the state name
	sentiments: Array[Num]		Array of size 250? that stores the sentiment values (between [0,1) ).
}
*/


// Subject Objects
var trumpData = {};
var sandersData = {};
var clintonData = {};
var cruzData = {};
var republicanData = {};
var democratData = {};

// Takes info from archived file and populates Subject Objects
function populateSubjects(file) {
	
}

// Pushes a new sentiment to the Sentiment Array.  Knocks out the first sentiment of Sentiment Array
function addSentiment(sentimentArray, newSentiment) {
	return sentimentArray.slice(1).push(newSentiment);
}







