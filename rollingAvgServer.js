// Derek Hong 2016
// 

/*
_______ Object: Object that is spit out by this program to the front end
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

function addSentiment(sentimentArray, newSentiment) {
	return sentimentArray()
}







